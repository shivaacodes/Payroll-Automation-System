package models

import "time"

// tracks the progress of  background queue
type JobBatch struct {
	ID             string    `gorm:"primaryKey" json:"id"`
	TotalRecords   int       `json:"totalRecords"`
	CompletedCount int       `json:"completedCount"`
	FailedCount    int       `json:"failedCount"`
	Status         string    `json:"status"` // processing, completed, failed
	CreatedAt      time.Time `json:"startedAt"`
}
