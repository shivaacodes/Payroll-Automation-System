package handlers

import (
	"github.com/gofiber/fiber/v2"
	"payroll-backend/internal/db"
	"payroll-backend/internal/models"
)

// aggregates all metrics for home page
func GetDashboardStats(c *fiber.Ctx) error {
	var stats struct {
		TotalEmployees   int64             `json:"totalEmployees"`
		EmailsSent       int64             `json:"emailsSent"`
		FailedDeliveries int64             `json:"failedDeliveries"`
		CurrentBatch     string            `json:"currentBatch"`
		RecentJobs       []models.JobBatch `json:"recentJobs"`
	}

	db.DB.Model(&models.Employee{}).Count(&stats.TotalEmployees)

	db.DB.Model(&models.JobBatch{}).Select("COALESCE(sum(completed_count), 0)").Row().Scan(&stats.EmailsSent)
	db.DB.Model(&models.JobBatch{}).Select("COALESCE(sum(failed_count), 0)").Row().Scan(&stats.FailedDeliveries)

	// 5 recent jobs
	db.DB.Order("created_at desc").Limit(5).Find(&stats.RecentJobs)

	// get most recent batch
	if len(stats.RecentJobs) > 0 {
		stats.CurrentBatch = stats.RecentJobs[0].ID
	} else {
		stats.CurrentBatch = "-"
	}

	return c.JSON(stats)
}
