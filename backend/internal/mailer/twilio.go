package mailer

import (
	"fmt"
	"log"
	"time"

	"payroll-backend/internal/models"
)

// SendWhatsAppSlip simulates sending a WhatsApp message via Twilio API
// with the encrypted PDF attached.
func SendWhatsAppSlip(emp models.Employee, pdfPath string, month string) error {
	if emp.PhoneNumber == "" {
		return fmt.Errorf("employee %s has no phone number for WhatsApp delivery", emp.EmployeeID)
	}

	// In a production environment, this would initialize the Twilio Go client:
	// client := twilio.NewRestClient(os.Getenv("TWILIO_ACCOUNT_SID"), os.Getenv("TWILIO_AUTH_TOKEN"))
	// message, err := client.Api.V2010.CreateMessage(&openapi.CreateMessageParams{
	// 	To:   "whatsapp:" + emp.PhoneNumber,
	// 	From: "whatsapp:" + os.Getenv("TWILIO_WHATSAPP_NUMBER"),
	// 	Body: fmt.Sprintf("Hi %s, your official salary slip for %s is attached. Use your First Name + Birth Year as the password.", emp.Name, month),
	//  MediaUrl: []string{pdfUrl}, // Would require uploading the PDF to a secure S3 bucket first
	// })

	log.Printf("==================================================")
	log.Printf("[TWILIO API] 🟢 Routing to WhatsApp")
	log.Printf("[TWILIO API] Employee: %s (%s)", emp.Name, emp.PhoneNumber)
	log.Printf("[TWILIO API] Status: Attaching Encrypted PDF...")
	
	// Simulate API latency
	time.Sleep(200 * time.Millisecond)
	
	log.Printf("[TWILIO API] ✅ Successfully delivered WhatsApp message!")
	log.Printf("==================================================")

	return nil
}
