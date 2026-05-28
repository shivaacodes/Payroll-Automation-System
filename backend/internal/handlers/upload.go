package handlers

import (
	"github.com/gofiber/fiber/v2"
	"payroll-backend/internal/validation"
)

// recieve: POST /api/upload endpoint
func HandleCSVUpload(c *fiber.Ctx) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to extract file from request",
		})
	}

	//send  it to parser
	previewRecords, err := validation.ParseAndValidateCSV(file)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// return the parsed and validated data to the frontend
	return c.JSON(fiber.Map{
		"message": "File parsed successfully!!",
		"records": previewRecords,
	})
}
