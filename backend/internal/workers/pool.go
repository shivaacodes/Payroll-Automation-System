package workers

import (
	"log"
	"time"

	"gorm.io/gorm"
	"payroll-backend/internal/db"
	"payroll-backend/internal/mailer"
	"payroll-backend/internal/models"
	"payroll-backend/internal/pdf"
)

type JobPayload struct {
	BatchID  string
	JobIndex int
	Employee models.Employee
	Entry    models.PayrollEntry
}

var JobQueue = make(chan JobPayload, 100)

func StartWorkerPool(numWorkers int) {
	for i := 1; i <= numWorkers; i++ {
		go worker(i)
	}
	log.Printf("Started Worker Pool with %d concurrent workers", numWorkers)
}

func worker(workerID int) {
	for job := range JobQueue {
		log.Printf("[Worker %d] Processing: %s", workerID, job.Employee.Name)

		pdfPath, err := pdf.GenerateAndProtectSlip(job.Employee, job.Entry)
		success := true
		if err != nil {
			log.Printf("[Worker %d] ERROR PDF: %v", workerID, err)
			success = false
		} else {
			if job.JobIndex < 5 {
				err = mailer.SendSalarySlip(job.Employee, pdfPath, job.Entry.MonthYear)
				if err != nil {
					log.Printf("[Worker %d] ERROR Email: %v", workerID, err)
					success = false
				}
			} else {
				//Simulate SendGrid request to prevent sending too many requests
				time.Sleep(50 * time.Millisecond)
			}
		}

		job.Entry.EmployeeID = job.Employee.EmployeeID

		// Atomic database updates so we don't get race conditions between workers
		if success {
			job.Entry.Status = "completed"
			db.DB.Create(&job.Entry)
			db.DB.Model(&models.JobBatch{}).Where("id = ?", job.BatchID).UpdateColumn("completed_count", gorm.Expr("completed_count + ?", 1))
		} else {
			job.Entry.Status = "failed"
			db.DB.Create(&job.Entry)
			db.DB.Model(&models.JobBatch{}).Where("id = ?", job.BatchID).UpdateColumn("failed_count", gorm.Expr("failed_count + ?", 1))
		}
	}
}
