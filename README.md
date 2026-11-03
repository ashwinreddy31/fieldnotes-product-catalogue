# Fieldnotes Product Catalogue

A responsive React + TypeScript catalogue backed by an Express + TypeScript API. The browser only requests the local backend, including for product images; the backend's dedicated product-data-service package fetches product data and images from Fake Store API.

## Requirements

- Node.js 20 or newer and npm
- Internet access for the Fake Store API and product images

## Install and configure

From the project root:

```powershell
npm install
Copy-Item apps\backend\.env.example apps\backend\.env
Copy-Item apps\frontend\.env.example apps\frontend\.env
```

The defaults work for local development. The backend uses `EMAIL_PROVIDER=console`, a local testing option that prints enquiry email content in the backend terminal and does not send it to an external address.

Do not put real credentials in either example file.

## Run locally

Open two terminals in the project root.

Backend:

```powershell
npm run dev:backend
```

Frontend:

```powershell
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173).

The backend health endpoint is [http://localhost:4000/api/health](http://localhost:4000/api/health).

## Email configuration

The application supports console and SMTP email providers.

### Console mode

The default configuration is:

```env
EMAIL_PROVIDER=console
```

In this mode, enquiry emails are printed in the backend terminal. No external email is sent.

### Local SMTP testing with Mailpit

Mailpit captures outgoing emails locally without sending them to real recipients.

1. Download and extract Mailpit for Windows.
2. Open PowerShell and navigate to the folder containing `mailpit.exe`.
3. Start Mailpit:

```powershell
.\mailpit.exe
```

4. Keep the Mailpit terminal running.

Mailpit uses these default addresses:

- SMTP server: `localhost:1025`
- Web inbox: [http://localhost:8025](http://localhost:8025)

In `apps/backend/.env`, configure:

```env
EMAIL_PROVIDER=smtp
ENQUIRY_TO_EMAIL=hello@example.com
EMAIL_FROM=Product Catalogue <no-reply@example.com>

SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
```

No username or password is required for the default local Mailpit SMTP configuration.

Restart the backend after changing environment variables.

### Test an enquiry email

Submit an enquiry through the application or run this PowerShell command from any terminal:

```powershell
$body = @{
    name = "Mailpit Verification"
    email = "test@example.com"
    phone = "9876543210"
    message = "Testing SMTP email delivery."
    productTitle = "Test Product"
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "http://localhost:4000/api/enquiries" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

Expected API response:

```json
{
  "message": "Your enquiry has been sent."
}
```

Open [http://localhost:8025](http://localhost:8025) and verify that the test email appears in the inbox.

The email should contain:

- From: Product Catalogue
- To: hello@example.com
- Reply-To: test@example.com
- Subject: Product enquiry: Test Product
- Customer name, email, phone number, product name, and message

**Testing status:** Local SMTP integration was successfully tested using Mailpit. The test enquiry was captured in the Mailpit inbox with the expected sender, recipient, reply-to address, subject, and message content.

### Production email configuration

For production email delivery:

- Configure a real SMTP provider.
- Set the correct SMTP host and port.
- Configure SMTP authentication if required.
- Store credentials securely using environment variables or a secrets manager.
- Never commit `.env` files or SMTP credentials to Git.

Mailpit is intended for local development and testing only.

## Build

```powershell
npm run build
```

## Application features

- The home page requests and displays exactly five featured products, chosen by rating.
- Category pages divide all category products into a top-rated group and additional finds.
- Search matches product title, description, and category.
- Product detail pages include a product-specific enquiry form.
- The standalone enquiry page has required name, email, phone, and message fields, client- and server-side validation, and an in-page thank-you state after successful submission.
- API loading, empty, network, upstream, and submission errors are surfaced in the UI.
- Form controls and major product collections include labels and stable `data-testid` selectors.

## Structure

- `apps/frontend` - React, TypeScript, Vite UI
- `apps/backend` - Express API, validation, and configurable enquiry email provider
- `packages/product-data-service` - isolated Fake Store API client used only by the backend
