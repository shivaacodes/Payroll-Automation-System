package models

import (
	"time"
)

// it is the master record in teh db
// gorm will create employees table automatically
type Employee struct {
	ID          uint      `gorm:"primaryKey"`
	EmployeeID  string    `gorm:"uniqueIndex;not null"`
	Name        string    `gorm:"not null"`
	Email       string    `gorm:"uniqueIndex;not null"`
	Designation string    `gorm:"not null"`
	DOBYear     string    `gorm:"not null"` // will use for the PDF password
	CreatedAt   time.Time `gorm:"autoCreateTime"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime"`
}
