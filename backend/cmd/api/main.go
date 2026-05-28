package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"

	"payroll-backend/internal/db"
	"payroll-backend/internal/handlers"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Println("no env file found")
	}

	db.Connect() //initialize DB Connection to Supabase

	app := fiber.New() // initialze Fiber

	// cors ( Nextjs -> Go)
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Health Check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"message": "Payroll Automation API is running smoothly!",
		})
	})

	app.Post("/api/upload", handlers.HandleCSVUpload)

	// Employee Routes
	app.Post("/api/employees", handlers.CreateEmployee)
	app.Get("/api/employees", handlers.GetEmployees)

	// Start server
	log.Println("Starting server on port 8080...")
	log.Fatal(app.Listen(":8080"))
}
