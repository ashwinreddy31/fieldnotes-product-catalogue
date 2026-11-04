# AI Usage

## 1. AI Tools Used

- **GitHub Copilot:** Used as the primary AI coding assistant for code generation and coding support.
- **ChatGPT (GPT-6):** Used for prompt preparation, planning, technical guidance, troubleshooting, and documentation.

## 2. How AI Was Used

### GitHub Copilot

GitHub Copilot was used during application development to assist with:

- Writing React and TypeScript components.
- Developing Node.js and Express backend functionality.
- Implementing API integrations.
- Creating product catalogue features.
- Supporting email integration.
- Writing and improving automated tests.
- Suggesting code improvements and helping resolve coding issues.

### ChatGPT

ChatGPT was used for:

- Understanding and breaking down the assessment requirements.
- Preparing prompts and technical instructions for development.
- Discussing architecture and technology choices.
- Troubleshooting development and configuration issues.
- Configuring and verifying local SMTP testing with Mailpit.
- Preparing README.md, DECISIONS.md, and AI_USAGE.md.
- Getting guidance on Git and GitHub submission steps.

## 3. Key AI-Assisted Moments

### Moment 1: Understanding requirements

Used ChatGPT to understand the assessment requirements and break the work into frontend, backend, product integration, enquiry handling, testing, and documentation.

### Moment 2: Code development

Used GitHub Copilot to assist with generating and completing application code based on the assessment requirements and development prompts.

### Moment 3: Email integration

Used ChatGPT for guidance on SMTP configuration and troubleshooting. Used Mailpit to verify that the enquiry email was successfully captured.

### Moment 4: Documentation

Used ChatGPT to prepare and improve the README, architecture decisions, assumptions, and AI usage documentation.

### Moment 5: Git and GitHub

Used ChatGPT for guidance on Git commands, branch management, pushing changes, and preparing the required pull request.

## 4. AI Mistakes and Validation

AI suggestions were reviewed rather than accepted blindly.

- **Email verification:** An API success response alone was not enough to confirm email delivery. I inspected the captured message in Mailpit and verified its sender, recipient, subject, and body.
- **GitHub pull request:** The initial branch comparison failed because the branches had unrelated commit histories. I checked the GitHub comparison screen and Git output to identify the issue.
- **Code review:** Copilot-generated code and suggestions were reviewed and tested during development.

## 5. Planning and Agent Instructions

The assessment brief was used as the main project specification. The work was divided into frontend development, backend development, product data integration, enquiry email handling, testing, and documentation.

No separate custom agent instruction files were used.

## 6. Human Review and Testing

The application was reviewed using local execution and manual validation.

Checks included:

- Starting the frontend and backend locally.
- Checking product pages and navigation.
- Testing the enquiry API.
- Verifying SMTP connectivity.
- Inspecting the captured enquiry email in Mailpit.
- Checking Git status, commits, and push results.

Final automated test and build results should be recorded after running the checks.

## 7. Actual Time Spent

Enter the actual time spent on each activity.

| Activity | Actual time |
|---|---|
| Planning and understanding requirements | [25 min] |
| Development using GitHub Copilot | [50 min] |
| Testing and debugging | [4 hours] |
| Documentation and final review | [1 hour] |

## 8. Final Reflection

GitHub Copilot helped accelerate coding, while ChatGPT helped with planning, prompts, troubleshooting, and documentation. I used local execution, API checks, email inspection, and Git output to validate important parts of the implementation.

AI tools supported the development process, but I remained responsible for reviewing the output and validating the application.