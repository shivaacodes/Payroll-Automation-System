package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"log"
	"os"

	"payroll-backend/internal/db"
	"payroll-backend/internal/handlers"
	"payroll-backend/internal/workers"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found or error loading it")
	}

	db.Connect()

	// start Background Workers - 5 concurrent threads
	workers.StartWorkerPool(5)

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// API Routes
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendString("Server is healthy!!!!")
	})

	app.Post("/api/upload", handlers.HandleCSVUpload)

	app.Post("/api/employees", handlers.CreateEmployee)
	app.Get("/api/employees", handlers.GetEmployees)
	app.Delete("/api/employees/:id", handlers.DeleteEmployee)

	app.Post("/api/jobs/start", handlers.StartPayrollJob)
	app.Get("/api/jobs", handlers.GetJobs)
	app.Delete("/api/jobs/:id", handlers.DeleteJob)
	app.Delete("/api/jobs", handlers.ClearAllJobs)

	app.Get("/api/dashboard/stats", handlers.GetDashboardStats)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	
	log.Printf("Starting server on port %s...", port)
	log.Fatal(app.Listen(":" + port))
}
