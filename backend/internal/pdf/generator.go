package pdf

import (
	_ "embed"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"payroll-backend/internal/models"

	"github.com/jung-kurt/gofpdf"
	"github.com/pdfcpu/pdfcpu/pkg/api"
	"github.com/pdfcpu/pdfcpu/pkg/pdfcpu/model"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
	"golang.org/x/text/message"
)

//go:embed fonts/Roboto-Regular.ttf
var robotoFont []byte

//go:embed fonts/Roboto-Bold.ttf
var robotoBoldFont []byte

func formatRupee(amount float64) string {
	p := message.NewPrinter(language.Make("en-IN"))
	return p.Sprintf("₹ %.2f", amount)
}

// create salary slip pdf ui
func GenerateAndProtectSlip(emp models.Employee, entry models.PayrollEntry) (string, error) {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddUTF8FontFromBytes("Roboto", "", robotoFont)
	pdf.AddUTF8FontFromBytes("Roboto", "B", robotoBoldFont)
	pdf.AddPage()

	pdf.SetFont("Arial", "B", 24)
	pdf.SetTextColor(235, 10, 30)
	pdf.SetXY(15, 20)
	pdf.Cell(100, 10, "NIPPON TOYOTA")

	pdf.SetFont("Arial", "", 10)
	pdf.SetTextColor(100, 100, 100)
	pdf.SetXY(15, 30)
	pdf.Cell(100, 5, "CONFIDENTIAL SALARY STATEMENT")

	pdf.SetFont("Arial", "B", 12)
	pdf.SetTextColor(0, 0, 0)
	pdf.SetXY(140, 25)
	pdf.CellFormat(55, 10, strings.ToUpper(entry.MonthYear), "", 0, "R", false, 0, "")

	pdf.SetDrawColor(235, 10, 30)
	pdf.SetLineWidth(0.5)
	pdf.Line(15, 40, 195, 40)

	pdf.Ln(25)

	pdf.SetFont("Arial", "B", 10)
	pdf.SetTextColor(150, 150, 150)
	pdf.SetX(15)
	pdf.Cell(90, 5, "EMPLOYEE NAME")
	pdf.Cell(90, 5, "EMPLOYEE ID")
	pdf.Ln(6)

	pdf.SetFont("Arial", "B", 12)
	pdf.SetTextColor(0, 0, 0)
	pdf.SetX(15)
	pdf.Cell(90, 8, strings.ToUpper(emp.Name))
	pdf.Cell(90, 8, emp.EmployeeID)
	pdf.Ln(10)

	pdf.SetFont("Arial", "B", 10)
	pdf.SetTextColor(150, 150, 150)
	pdf.SetX(15)
	pdf.Cell(90, 5, "DESIGNATION")
	pdf.Cell(90, 5, "EMAIL")
	pdf.Ln(6)

	pdf.SetFont("Arial", "", 12)
	pdf.SetTextColor(0, 0, 0)
	pdf.SetX(15)
	
	// Title case the designation
	titleCaser := cases.Title(language.English)
	formattedDesignation := titleCaser.String(emp.Designation)
	
	pdf.Cell(90, 8, formattedDesignation)
	pdf.Cell(90, 8, emp.Email)

	pdf.Ln(30) // Increased padding before Earnings table
	pdf.SetDrawColor(220, 220, 220)
	pdf.SetLineWidth(0.2)

	pdf.SetFont("Arial", "B", 10)
	pdf.SetTextColor(150, 150, 150)
	pdf.SetX(15)
	pdf.CellFormat(60, 10, "EARNINGS", "B", 0, "L", false, 0, "")
	pdf.CellFormat(25, 10, "AMOUNT", "B", 0, "R", false, 0, "")
	pdf.Cell(10, 10, "")
	pdf.CellFormat(60, 10, "DEDUCTIONS", "B", 0, "L", false, 0, "")
	pdf.CellFormat(25, 10, "AMOUNT", "B", 1, "R", false, 0, "")

	pdf.Ln(5)

	pdf.SetFont("Roboto", "", 11)
	pdf.SetTextColor(0, 0, 0)

	pdf.SetX(15)
	pdf.CellFormat(60, 10, "Basic Salary", "B", 0, "L", false, 0, "")
	pdf.CellFormat(25, 10, formatRupee(entry.BaseSalary), "B", 0, "R", false, 0, "")
	pdf.Cell(10, 10, "")
	pdf.CellFormat(60, 10, "Taxes & Deductions", "B", 0, "L", false, 0, "")
	pdf.SetTextColor(235, 10, 30)
	pdf.CellFormat(25, 10, formatRupee(entry.Deductions), "B", 1, "R", false, 0, "")
	pdf.SetTextColor(0, 0, 0)

	pdf.SetX(15)
	pdf.CellFormat(60, 10, "House Rent Allowance", "B", 0, "L", false, 0, "")
	pdf.CellFormat(25, 10, formatRupee(entry.HRA), "B", 0, "R", false, 0, "")
	pdf.Cell(10, 10, "")
	pdf.CellFormat(60, 10, "", "B", 0, "L", false, 0, "")
	pdf.CellFormat(25, 10, "", "B", 1, "R", false, 0, "")

	pdf.SetX(15)
	pdf.CellFormat(60, 10, "Special Allowances", "B", 0, "L", false, 0, "")
	pdf.CellFormat(25, 10, formatRupee(entry.Allowances), "B", 0, "R", false, 0, "")
	pdf.Cell(10, 10, "")
	pdf.CellFormat(60, 10, "", "B", 0, "L", false, 0, "")
	pdf.CellFormat(25, 10, "", "B", 1, "R", false, 0, "")

	pdf.Ln(5)
	
	// Subtotals
	totalEarnings := entry.BaseSalary + entry.HRA + entry.Allowances
	totalDeductions := entry.Deductions

	pdf.SetX(15)
	pdf.SetFont("Roboto", "B", 11) // Use Roboto for Rupee in subtotals
	pdf.CellFormat(60, 10, "Total Earnings", "", 0, "L", false, 0, "")
	pdf.CellFormat(25, 10, formatRupee(totalEarnings), "", 0, "R", false, 0, "")
	pdf.Cell(10, 10, "")
	pdf.CellFormat(60, 10, "Total Deductions", "", 0, "L", false, 0, "")
	pdf.SetTextColor(235, 10, 30)
	pdf.CellFormat(25, 10, formatRupee(totalDeductions), "", 1, "R", false, 0, "")
	pdf.SetTextColor(0, 0, 0)

	pdf.Ln(5)
	pdf.SetX(110)
	pdf.SetDrawColor(0, 0, 0)
	pdf.SetLineWidth(0.5)

	pdf.SetFont("Arial", "B", 12)
	pdf.CellFormat(40, 15, "NET PAYABLE", "T B", 0, "L", false, 0, "")
	pdf.SetFont("Roboto", "B", 14) // Use Roboto for Rupee in total
	pdf.CellFormat(45, 15, formatRupee(entry.NetSalary), "T B", 1, "R", false, 0, "")

	// Disclaimer
	pdf.SetY(280)
	pdf.SetFont("Arial", "", 9)
	pdf.SetTextColor(150, 150, 150)
	pdf.CellFormat(0, 10, "This is a system-generated document and does not require a physical signature.", "", 0, "C", false, 0, "")

	// save
	tempRawPath := filepath.Join(os.TempDir(), fmt.Sprintf("%s_raw.pdf", emp.EmployeeID))
	err := pdf.OutputFileAndClose(tempRawPath)
	if err != nil {
		return "", fmt.Errorf("failed to generate native PDF: %v", err)
	}

	//encrypt
	firstName := strings.Split(emp.Name, " ")[0]
	password := fmt.Sprintf("%s%s", firstName, emp.DOBYear)

	finalPath := filepath.Join(os.TempDir(), fmt.Sprintf("%s_salary_slip.pdf", emp.EmployeeID))

	conf := model.NewAESConfiguration(password, password, 256)
	err = api.EncryptFile(tempRawPath, finalPath, conf)

	os.Remove(tempRawPath)

	if err != nil {
		return "", fmt.Errorf("pdfcpu encryption failed: %v", err)
	}

	return finalPath, nil
}
