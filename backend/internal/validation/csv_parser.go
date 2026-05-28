package validation

import (
	"encoding/csv"
	"fmt"
	"mime/multipart"
	"strconv"
	"strings"

	"payroll-backend/internal/db"
	"payroll-backend/internal/models"
)

type PreviewRecord struct {
	EmployeeID  string  `json:"employeeId"`
	Name        string  `json:"name"`
	Email       string  `json:"email"`
	BaseSalary  float64 `json:"baseSalary"`
	HRA         float64 `json:"hra"`
	Allowances  float64 `json:"allowances"`
	Deductions  float64 `json:"deductions"`
	MonthYear   string  `json:"monthYear"`
	NetSalary   float64 `json:"netSalary"`
	Status      string  `json:"status"` // valid or error
	ErrorReason string  `json:"errorReason,omitempty"`
}

func ParseAndValidateCSV(file *multipart.FileHeader) ([]PreviewRecord, error) {
	// open the uploaded file
	src, err := file.Open()
	if err != nil {
		return nil, err
	}
	defer src.Close()

	// csv reader
	reader := csv.NewReader(src)
	records, err := reader.ReadAll()
	if err != nil {
		return nil, fmt.Errorf("failed to read csv: %v", err)
	}

	// make sure it has header and all the needed datas
	if len(records) < 2 {
		return nil, fmt.Errorf("CSV file is empty or missing data rows")
	}

	var previews []PreviewRecord

	//loop through the data rows(skip 0th row since it is the header)

	// expected csv format -> EmployeeID, MonthYear, BaseSalary, HRA, Allowances, Deductions
	for i, row := range records[1:] {
		//length validation
		if len(row) < 7 {
			previews = append(previews, PreviewRecord{
				Status:      "Error",
				ErrorReason: fmt.Sprintf("Row %d: Missing columns", i+2),
			})
			continue
		}

		empID := strings.TrimSpace(row[0])

		//send a query to confirm  this employee exists
		var emp models.Employee
		result := db.DB.Where("employee_id = ?", empID).First(&emp)

		if result.Error != nil {
			previews = append(previews, PreviewRecord{
				EmployeeID:  empID,
				Status:      "Error",
				ErrorReason: "Employee not found in Employee database",
			})
			continue
		}

		//parse the salary
		base, _ := strconv.ParseFloat(row[1], 64)
		hra, _ := strconv.ParseFloat(row[2], 64)
		allowances, _ := strconv.ParseFloat(row[3], 64)
		deductions, _ := strconv.ParseFloat(row[4], 64)

		//calculate the total salary
		netSalary := (base + hra + allowances) - deductions

		previews = append(previews, PreviewRecord{
			EmployeeID: emp.EmployeeID,
			Name:       emp.Name,
			Email:      emp.Email,
			BaseSalary: base,
			HRA:        hra,
			Allowances: allowances,
			Deductions: deductions,
			MonthYear:  row[5] + " " + row[6], // eg, "May 2026"
			NetSalary:  netSalary,
			Status:     "Valid",
		})
	}

	return previews, nil
}
