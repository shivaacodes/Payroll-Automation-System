package handlers

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"payroll-backend/internal/db"
	"payroll-backend/internal/models"
	"payroll-backend/internal/validation"
	"payroll-backend/internal/workers"
)

// creates a db tracking row and dumps tasks into the channel
func StartPayrollJob(c *fiber.Ctx) error {
	var payload struct {
		Records []validation.PreviewRecord `json:"records"`
	}

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid payload"})
	}

	batchID := fmt.Sprintf("BATCH-%s", time.Now().Format("20060102-150405"))
	batch := models.JobBatch{
		ID:             batchID,
		TotalRecords:   len(payload.Records),
		CompletedCount: 0,
		FailedCount:    0,
		Status:         "processing",
		CreatedAt:      time.Now(),
	}
	db.DB.Create(&batch)

	//push to queue
	for i, rec := range payload.Records {
		var emp models.Employee
		if err := db.DB.Where("employee_id = ?", rec.EmployeeID).First(&emp).Error; err != nil {
			db.DB.Model(&models.JobBatch{}).Where("id = ?", batchID).UpdateColumn("failed_count", gorm.Expr("failed_count + ?", 1))
			continue
		}

		workers.JobQueue <- workers.JobPayload{
			BatchID:  batchID,
			JobIndex: i,
			Employee: emp,
			Entry: models.PayrollEntry{
				MonthYear:  rec.MonthYear,
				BaseSalary: rec.BaseSalary,
				HRA:        rec.HRA,
				Allowances: rec.Allowances,
				Deductions: rec.Deductions,
				NetSalary:  rec.NetSalary,
			},
		}
	}

	return c.JSON(fiber.Map{"message": "Payroll processing started", "batchId": batchID})
}

func GetJobs(c *fiber.Ctx) error {
	var jobs []models.JobBatch
	db.DB.Order("created_at desc").Find(&jobs) // fetch newest first
	return c.JSON(jobs)
}

// deletes a single batch by ID
func DeleteJob(c *fiber.Ctx) error {
	batchID := c.Params("id")
	result := db.DB.Where("id = ?", batchID).Delete(&models.JobBatch{})

	if result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete job"})
	}
	return c.JSON(fiber.Map{"message": "Job deleted successfully"})
}

// delete all batch history
func ClearAllJobs(c *fiber.Ctx) error {
	result := db.DB.Where("1 = 1").Delete(&models.JobBatch{})

	if result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to clear jobs"})
	}
	return c.JSON(fiber.Map{"message": "All jobs cleared"})
}
