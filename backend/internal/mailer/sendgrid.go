package mailer

import (
	"encoding/base64"
	"fmt"
	"os"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
	"payroll-backend/internal/models"
)

// email the password-protected PDF to the employees
func SendSalarySlip(emp models.Employee, pdfPath string, month string) error {
	apiKey := os.Getenv("SENDGRID_API_KEY")
	fromEmail := os.Getenv("SENDGRID_FROM_EMAIL")

	if apiKey == "" || fromEmail == "" {
		return fmt.Errorf("SENDGRID_API_KEY or SENDGRID_FROM_EMAIL not set in .env")
	}

	// Read & Base64 encode the PDF for attachment
	pdfData, err := os.ReadFile(pdfPath)
	if err != nil {
		return fmt.Errorf("failed to read PDF: %v", err)
	}
	encodedPDF := base64.StdEncoding.EncodeToString(pdfData)

	from := mail.NewEmail("Nippon Toyota HR", fromEmail)
	to := mail.NewEmail(emp.Name, emp.Email)
	subject := fmt.Sprintf("Your %s Salary Slip - Nippon Toyota", month)

	// html body
	htmlBody := fmt.Sprintf(`
		<div style="background-color: #f4f4f4; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
			<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
				<tr>
					<td style="background-color: #eb0a1e; padding: 35px 30px; text-align: center;">
						<h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: bold; letter-spacing: 1.5px;">NIPPON TOYOTA</h1>
						<p style="color: #ffcccc; margin: 8px 0 0 0; font-size: 13px; font-weight: bold; letter-spacing: 1px;">CONFIDENTIAL PAYROLL DISTRIBUTION</p>
					</td>
				</tr>
				<tr>
					<td style="padding: 40px 30px; color: #333333; line-height: 1.6;">
						<p style="font-size: 16px; margin-top: 0;">Dear <strong>%s</strong>,</p>
						<p style="font-size: 16px;">Please find attached your salary slip for <strong>%s</strong>.</p>
						<div style="margin: 35px 0; padding: 25px; background-color: #f8fafc; border-left: 4px solid #eb0a1e; border-radius: 4px;">
							<h3 style="margin: 0 0 10px 0; color: #eb0a1e; font-size: 16px;">🔒 SECURITY NOTICE</h3>
							<p style="margin: 0; font-size: 14px; color: #4b5563;">Your document is securely encrypted. To unlock it, use your First Name followed by your Birth Year.</p>
							<p style="margin: 15px 0 0 0; font-size: 14px; color: #1e293b;">
								<strong>Example format:</strong> <span style="background: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Shiva2004</span>
							</p>
						</div>
						<p style="font-size: 14px; color: #64748b;">For any discrepancies, contact the HR department directly.</p>
						<br/>
						<p style="font-size: 16px; margin-bottom: 0;">Best regards,</p>
						<p style="font-size: 16px; font-weight: bold; margin-top: 5px; color: #1e293b;">Human Resources<br/>Nippon Toyota</p>
					</td>
				</tr>
				<tr>
					<td style="background-color: #1a1a1a; padding: 25px; text-align: center;">
						<p style="color: #888888; font-size: 12px; margin: 0;">&copy; 2026 Nippon Toyota Motors. All rights reserved.</p>
						<p style="color: #888888; font-size: 12px; margin: 8px 0 0 0;">This is an automated system email. Please do not reply.</p>
					</td>
				</tr>
			</table>
		</div>
	`, emp.Name, month)

	// trying to override spam detection
	plainTextBody := fmt.Sprintf(`Dear %s,

This email contains your official confidential salary slip for the month of %s. 

Please find the document attached to this email as a secure PDF file. This document details your base salary, deductions, and net pay for the specified period. We advise you to review the contents carefully and keep this document for your personal financial records.

SECURITY NOTICE: 
To protect your privacy, your salary slip is securely encrypted with AES-256 bit encryption. To unlock and view the attached PDF, you must use your First Name followed by your Birth Year as the password. 

Example format: Shiva2004

If you have any questions, encounter issues opening your document, or notice any discrepancies in your pay, please contact the HR department directly.

Best regards,
Human Resources
Nippon Toyota
`, emp.Name, month)

	message := mail.NewSingleEmail(from, subject, to, plainTextBody, htmlBody)

	attachment := mail.NewAttachment()
	attachment.SetContent(encodedPDF)
	attachment.SetType("application/pdf")
	attachment.SetFilename(fmt.Sprintf("%s_Salary_Slip_%s.pdf", emp.EmployeeID, month))
	attachment.SetDisposition("attachment")
	message.AddAttachment(attachment)

	client := sendgrid.NewSendClient(apiKey)
	response, err := client.Send(message)
	if err != nil {
		return fmt.Errorf("SendGrid error: %v", err)
	}
	if response.StatusCode >= 400 {
		return fmt.Errorf("SendGrid rejected (status %d): %s", response.StatusCode, response.Body)
	}

	return nil
}
