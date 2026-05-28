package handlers

import (
	"github.com/gofiber/fiber/v2"
	"payroll-backend/internal/db"
	"payroll-backend/internal/models"
)

// CreateEmployee handles POST /api/employees
func CreateEmployee(c *fiber.Ctx) error {
	var emp models.Employee

	// Parse JSON body
	if err := c.BodyParser(&emp); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request payload",
		})
	}

	// Validate required fields
	if emp.EmployeeID == "" || emp.Name == "" || emp.Email == "" || emp.DOBYear == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing required fields (EmployeeID, Name, Email, DOBYear)",
		})
	}

	// Save to Postgres
	result := db.DB.Create(&emp)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create employee, might be a duplicate EmployeeID or Email",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Employee created successfully",
		"data":    emp,
	})
}

// GetEmployees handles GET /api/employees
func GetEmployees(c *fiber.Ctx) error {
	var employees []models.Employee

	result := db.DB.Order("created_at desc").Find(&employees)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch employees",
		})
	}

	return c.JSON(fiber.Map{
		"data": employees,
	})
}
