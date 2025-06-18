package mailer

import (
	"bytes"
	"embed"
	"html/template"
	"time"

	"github.com/go-mail/mail/v2"
)


// Do not remove the comment below, it is used by the go:embed directive.
// ↓↓↓

//go:embed "templates"
var templateFS embed.FS

type Mailer struct {
	dialer *mail.Dialer
	sender string
}

// NewMailer() creates a new Mailer instance with the provided SMTP server configuration.
// It initializes a mail.Dialer with the specified host, port, username, password,
// and a timeout of 5 seconds. The sender information is also set.
func NewMailer(host string, port int, username, password, sender string) Mailer {
	dialer := mail.NewDialer(host, port, username, password)
	dialer.Timeout = 5 * time.Second

	return Mailer{
		dialer: dialer,
		sender: sender,
	}
}

// Send() send an email to recipient using the specified template file and data.
// It parses the template file from the embedded filesystem, executes it with the provided data,
// and sends the email using the mail.Dialer. The email includes a subject, plain text body,
// and HTML body. If any error occurs during the process, it returns the error.
// The recipient parameter specifies the email address of the recipient.
// The template file should contain three templates: "subject", "plainBody", and "htmlBody".
// The "subject" template is used for the email subject, while "plainBody" and "htmlBody"
// are used for the plain text and HTML bodies of the email, respectively.
// The data parameter is used to populate the templates with dynamic content.
func (m Mailer) Send(recipient, templateFile string, data any) error {
	tmpl, err := template.New("email").ParseFS(templateFS, "templates/"+templateFile)
	if err != nil {
		return err
	}

	subject := new(bytes.Buffer)
	err = tmpl.ExecuteTemplate(subject, "subject", data)
	if err != nil {
		return err
	}

	plainBody := new(bytes.Buffer)
	err = tmpl.ExecuteTemplate(plainBody, "plainBody", data)
	if err != nil {
		return err
	}

	htmlBody := new(bytes.Buffer)
	err = tmpl.ExecuteTemplate(htmlBody, "htmlBody", data)
	if err != nil {
		return err
	}

	msg := mail.NewMessage()
	msg.SetHeader("From", m.sender)
	msg.SetHeader("To", recipient)
	msg.SetHeader("Subject", subject.String())
	msg.SetBody("text/plain", plainBody.String())
	msg.AddAlternative("text/html", htmlBody.String())

	// Attempt to send the email up to 3 times with a delay of 500ms between attempts.
	for range 3 {
		err = m.dialer.DialAndSend(msg)
		if err == nil {
			return nil
		}

		time.Sleep(500 * time.Millisecond) // Retry after 500ms
	}

	return nil
}
