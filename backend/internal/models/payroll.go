package models

import (
	"time"
)

// this table represent a single salary record for a particular month
type PayrollEntry struct {
	ID         uint      `gorm:"primaryKey"`
	EmployeeID string    `gorm:"index;not null"` // foreign key to link Employee.EmployeeID
	MonthYear  string    `gorm:"not null"`
	BaseSalary float64   `gorm:"not null"`
	HRA        float64   `gorm:"not null"`
	Allowances float64   `gorm:"not null"`
	Deductions float64   `gorm:"not null"`
	NetSalary  float64   `gorm:"not null"`
	Status     string    `gorm:"default:'pending'"` // pending, processing, completed, failed
	CreatedAt  time.Time `gorm:"autoCreateTime"`
}
