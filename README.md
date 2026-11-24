# ClaimWise – AI-Powered Health Insurance Claim Analyzer

ClaimWise is an AI-powered health insurance claim analysis application that helps users understand their hospital expenses and insurance coverage by analyzing hospital bills and insurance policy documents.

The application combines a React frontend with an n8n automation workflow to process documents, identify potentially covered expenses, highlight missing documentation, and generate an easy-to-understand claim analysis report.

## Key Features

- **Document Upload:** Upload hospital bills and health insurance policy documents.
- **AI-Powered Analysis:** Analyze uploaded documents using an AI-driven workflow.
- **Expense Categorization:** Identify and categorize potentially covered hospital expenses.
- **Coverage Estimation:** Generate illustrative insurance coverage estimates.
- **Patient Responsibility:** Estimate the amount potentially payable by the patient.
- **Missing Document Identification:** Highlight documents that may be required for claim processing.
- **EMI Estimation:** Calculate illustrative monthly EMI based on the estimated patient share and selected tenure.
- **Analysis Report:** Present results in a structured and user-friendly dashboard.

## Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- CSS

### Workflow Automation and AI
- n8n
- AI/LLM integration
- Document processing
- Webhook-based communication

## Project Structure

```text
ClaimWise/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── n8n-workflow/
│   └── claimwise-ai_demo.json
│
├── .gitignore
└── README.md
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Nikhilreddy1011/ClaimWise-Prototype.git
cd ClaimWise
```

### 2. Set Up the Frontend

```bash
cd frontend
npm install
```

Configure the required environment variables in a local `.env` file. Refer to the frontend source code for the expected variable names.

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

### 3. Set Up the n8n Workflow

1. Start your n8n instance.
2. Open the n8n dashboard.
3. Import `n8n-workflow/claimwise-ai_demo.json`.
4. Configure the required AI provider credentials.
5. Verify the webhook configuration and connect it to the frontend.
6. Execute and test the workflow.

**Note:** The workflow requires a running n8n instance and valid provider credentials.

## Application Workflow

1. User uploads a hospital bill and insurance policy.
2. The frontend sends the documents to the n8n workflow.
3. The workflow processes the documents and performs AI-powered analysis.
4. Potentially covered expenses and missing documentation are identified.
5. Illustrative coverage and patient responsibility are estimated.
6. The frontend displays the generated claim analysis report.

## Security and Privacy

- Never commit API keys, access tokens, passwords, or other credentials.
- Keep environment variables in local `.env` files.
- Do not upload real patient documents or personally identifiable medical information.
- Use anonymized sample documents when demonstrating the application.

## Disclaimer

ClaimWise provides AI-generated estimates and informational assistance. Its results are illustrative and are not official insurance claim approvals, guaranteed coverage amounts, or financial advice.

Actual claim settlement depends on the insurance policy terms, exclusions, limits, medical necessity, documentation, and the insurer's final assessment.

## Future Enhancements

- Improved document extraction and validation.
- More detailed policy clause analysis.
- Claim rejection risk identification.
- Support for additional document formats.
- Downloadable claim analysis reports.
- Enhanced AI explanations and recommendations.

## Project Status

🚧 Under Development

---

**ClaimWise – Understand your health insurance claim with greater clarity.**