package db

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"payroll-backend/internal/models"
)

var DB *gorm.DB // Db is a global variable. contains databse connection pool

func Connect() {

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=postgres password=postgres dbname=payroll port=5432 sslmode=disable"
	}

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to DB \n", err)
	}

	log.Println("DB Connceted!!!!!!!!!!!")

	// reads structs and automatically creates,updates tables
	err = DB.AutoMigrate(&models.Employee{}, &models.JobBatch{})
	if err != nil {
		log.Fatal("Failed to create schemas \n", err)
	}

	log.Println("DB Schemas migrated!!!")
}
