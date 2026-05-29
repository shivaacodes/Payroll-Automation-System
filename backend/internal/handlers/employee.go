package handlers

import (
	"encoding/csv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"payroll-backend/internal/db"
	"payroll-backend/internal/models"
)

// recieves POST /api/employees
func CreateEmployee(c *fiber.Ctx) error {
	var emp models.Employee

	// Parse JSON body
	if err := c.BodyParser(&emp); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request payload",
		})
	}

	if emp.EmployeeID == "" || emp.Name == "" || emp.Email == "" || emp.DOBYear == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing required fields (EmployeeID, Name, Email, DOBYear)",
		})
	}

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

// handle: GET /api/employees
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

// handle: DELETE /api/employees/:id
func DeleteEmployee(c *fiber.Ctx) error {
	employeeID := c.Params("id")

	result := db.DB.Where("employee_id = ?", employeeID).Delete(&models.Employee{})
	if result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete employee"})
	}
	if result.RowsAffected == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Employee not found"})
	}

	return c.JSON(fiber.Map{"message": "Employee deleted successfully"})
}

// handle: POST /api/employees/bulk
func BulkUploadEmployees(c *fiber.Ctx) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "No file uploaded"})
	}

	f, err := file.Open()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to open file"})
	}
	defer f.Close()

	reader := csv.NewReader(f)
	records, err := reader.ReadAll()
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Failed to parse CSV"})
	}

	if len(records) < 2 {
		return c.Status(400).JSON(fiber.Map{"error": "CSV is empty or missing headers"})
	}

	var employees []models.Employee
	for i, row := range records {
		if i == 0 {
			continue
		}
		if len(row) < 5 {
			continue
		}
		emp := models.Employee{
			EmployeeID:  strings.TrimSpace(row[0]),
			Name:        strings.TrimSpace(row[1]),
			Email:       strings.TrimSpace(row[2]),
			Designation: strings.TrimSpace(row[3]),
			DOBYear:     strings.TrimSpace(row[4]),
		}

		if emp.EmployeeID != "" && emp.Name != "" && emp.Email != "" {
			employees = append(employees, emp)
		}
	}

	if len(employees) == 0 {
		return c.Status(400).JSON(fiber.Map{"error": "No valid employees found in CSV"})
	}

	// Bulk insert ; gorm will batch insert automatically
	result := db.DB.Create(&employees)
	if result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to bulk insert employees. Check for duplicate IDs or Emails."})
	}

	return c.Status(201).JSON(fiber.Map{
		"message": "Employees successfully imported",
		"count":   len(employees),
	})
}

// handle: DELETE /api/employees
func ClearAllEmployees(c *fiber.Ctx) error {
	result := db.DB.Where("1 = 1").Delete(&models.Employee{})
	if result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to clear all employees"})
	}

	return c.JSON(fiber.Map{"message": "All employees deleted successfully", "count": result.RowsAffected})
}
