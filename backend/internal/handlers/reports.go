package handlers

import (
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"payroll-backend/internal/db"
	"payroll-backend/internal/mailer"
	"payroll-backend/internal/models"
	"payroll-backend/internal/pdf"
)

type ReportResponse struct {
	ID         uint    `json:"id"`
	EmployeeID string  `json:"employeeId"`
	Name       string  `json:"name"`
	MonthYear  string  `json:"monthYear"`
	NetSalary  float64 `json:"netSalary"`
	Status     string  `json:"status"`
}

func GetReports(c *fiber.Ctx) error {
	var results []ReportResponse

	err := db.DB.Table("payroll_entries").
		Select("payroll_entries.id, payroll_entries.employee_id, employees.name, payroll_entries.month_year, payroll_entries.net_salary, payroll_entries.status").
		Joins("left join employees on employees.employee_id = payroll_entries.employee_id").
		Order("payroll_entries.created_at desc").
		Scan(&results).Error

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch reports"})
	}

	return c.JSON(results)
}

func GetPayslipPDF(c *fiber.Ctx) error {
	id := c.Params("id")
	action := c.Query("action", "preview") // preview or download

	var entry models.PayrollEntry
	if err := db.DB.First(&entry, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Payroll entry not found"})
	}

	var emp models.Employee
	if err := db.DB.Where("employee_id = ?", entry.EmployeeID).First(&emp).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Employee not found"})
	}

	pdfPath, err := pdf.GenerateAndProtectSlip(emp, entry)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to generate PDF"})
	}

	defer os.Remove(pdfPath)

	if action == "download" {
		c.Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"payslip_%s_%s.pdf\"", emp.EmployeeID, entry.MonthYear))
	} else {
		c.Set("Content-Disposition", "inline")
	}

	c.Set("Content-Type", "application/pdf")
	return c.SendFile(pdfPath, false)
}

func ResendPayslip(c *fiber.Ctx) error {
	id := c.Params("id")

	var entry models.PayrollEntry
	if err := db.DB.First(&entry, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Payroll entry not found"})
	}

	var emp models.Employee
	if err := db.DB.Where("employee_id = ?", entry.EmployeeID).First(&emp).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Employee not found"})
	}

	pdfPath, err := pdf.GenerateAndProtectSlip(emp, entry)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to generate PDF for email"})
	}
	defer os.Remove(pdfPath)

	err = mailer.SendSalarySlip(emp, pdfPath, entry.MonthYear)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to resend email"})
	}

	return c.JSON(fiber.Map{"message": "Email resent successfully"})
}
