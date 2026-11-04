# Decisions and Assumptions

## 1. Project Overview

The Fieldnotes Product Catalogue is an MVP web application that allows customers to browse products, explore categories, search for products, view product details, and submit product enquiries.

The objective was to build a functional proof of concept while keeping the architecture maintainable and flexible enough to support future changes.

## 2. Technology Choices

### Frontend: React with TypeScript

React was selected to build a responsive and component-based web application.

TypeScript was chosen to improve type safety, maintainability, and consistency when handling product data and API responses.

Vite is used as the frontend development and build tool.

### Backend: Node.js, Express and TypeScript

Node.js with Express was selected to provide REST API endpoints for the frontend.

TypeScript provides consistent data structures and better maintainability across the frontend and backend.

The backend handles product requests, enquiry validation, and email integration.

### Product Data Source: Fake Store API

Fake Store API was selected because the assessment explicitly permits it and product metadata is not important for the MVP.

A separate `product-data-service` package handles communication with the external product API.

This prevents the frontend from calling Fake Store API directly and separates external data access from application routes.

### Email: Nodemailer and SMTP

Nodemailer was selected to support configurable email delivery.

The email provider is configurable through environment variables.

Mailpit was used as a local SMTP testing tool to capture and verify enquiry emails without requiring a paid email service.

The application supports console mode for simple local development and SMTP mode for email testing and future production integration.

## 3. Architecture Decisions

The application is separated into three main areas:

- Frontend: Handles the user interface, navigation, product browsing, search, and enquiry forms.
- Backend: Handles API requests, validation, and enquiry processing.
- Product Data Service: Handles communication with Fake Store API.

The browser communicates only with the backend for product information and product images.

This separation makes it possible to replace the external product provider without requiring major changes to the frontend.

The email implementation is also separated into its own service so that the email provider can be changed independently.

## 4. Assumptions

The assessment leaves some implementation details open. The following assumptions were made:

1. Fake Store API provides sufficient product data for the initial MVP.
2. The five featured products are selected based on product ratings.
3. Category pages display top-rated products separately from additional products.
4. Search checks product title, description, and category.
5. Product enquiries require the customer's name, email address, phone number, and message.
6. Enquiries are sent to a configurable sales inbox.
7. Product images are retrieved through the backend rather than directly from the browser.
8. A successful enquiry submission displays a thank-you message to the customer.

## 5. Requirements Simplified or Deferred

The following areas were kept outside the initial MVP scope:

- User registration and authentication were not implemented because they were not required by the acceptance criteria.
- Shopping cart, checkout, and payment functionality were excluded because the application is a product catalogue rather than an e-commerce platform.
- Product management and administration features were deferred.
- Fake Store API remains the product data source rather than introducing a database.
- Mailpit is used for local email testing instead of requiring an external paid email provider.
- Advanced search filters, pagination, and product recommendations were not included in the initial scope.
- Production deployment and AWS infrastructure were not included because the assessment does not require deployed infrastructure.

These decisions helped keep the implementation focused on the acceptance criteria and the available development time.

## 6. Extensibility and Future Growth

The architecture is designed to support future changes.

### Product Data Source

The separate product-data-service package allows the external product provider to be replaced with a database or another API.

### Frontend Design

React components and TypeScript interfaces provide a foundation for introducing new layouts, branding, and additional catalogue functionality.

### Email Provider

The email service is separated from the enquiry route. A different SMTP provider or email delivery service can be introduced without changing the frontend enquiry flow.

### Backend

The Express API provides a central place for business logic, validation, and integration with future services.

### Testing

The project includes Python-based browser and API automation tests. These provide an initial foundation for validating important user journeys and backend functionality.

## 7. Testing Approach

The following areas were included in the testing effort:

- Product and category API endpoints.
- Frontend product browsing.
- Search and product navigation.
- Customer enquiry submission.
- Backend enquiry validation.
- SMTP integration using Mailpit.
- Browser automation using Python and Pytest.

The SMTP integration was manually verified by submitting a test enquiry and confirming that the email appeared in the Mailpit inbox.

Automated test execution results should be verified before treating the test suite as fully passing.

## 8. What I Would Improve With Another Day

If additional development time were available, I would prioritise:

1. Add more comprehensive backend unit and integration tests.
2. Improve browser automation coverage for category, search, product details, and enquiry journeys.
3. Add automated frontend testing.
4. Introduce structured logging and improved error monitoring.
5. Add pagination and advanced product filtering.
6. Introduce a database-backed product service.
7. Add CI/CD using GitHub Actions.
8. Improve production email configuration and delivery monitoring.
9. Add deployment infrastructure compatible with AWS.
10. Improve accessibility and responsive testing across different devices.

## 9. Overall Design Philosophy

The goal was not to build a large e-commerce platform within the assessment time.

The focus was to deliver the requested customer journey with clear separation between the frontend, backend, product data source, and email service.

The implementation prioritises maintainability, replaceable integrations, local development, and a foundation that can evolve as the business requirements become clearer.