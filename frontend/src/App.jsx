
import { useState } from "react";
import "./App.css";

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;
console.log("ClaimWise Webhook URL:", WEBHOOK_URL);

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));

function App() {
  const [bill, setBill] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const analyzeClaim = async () => {
    if (!bill || !policy) {
      setError("Please upload both hospital bill and insurance policy PDFs.");
      return;
    }

    if (bill.type !== "application/pdf" || policy.type !== "application/pdf") {
      setError("Only PDF documents are supported.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
  const formData = new FormData();

  formData.append("bill", bill);
  formData.append("policy", policy);

  console.log("Sending request to:", WEBHOOK_URL);
  console.log("Bill:", bill.name, bill.size);
  console.log("Policy:", policy.name, policy.size);

  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    body: formData
  });

  console.log("HTTP Status:", response.status);

  const responseText = await response.text();

  console.log("Raw n8n response:", responseText);

  let data;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      "n8n returned a non-JSON response. Check the webhook response configuration."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed with status ${response.status}`
    );
  }

  if (data.message === "Workflow was started") {
    throw new Error(
      "n8n acknowledged the request but did not return the analysis. Check the Respond to Webhook configuration."
    );
  }

  setResult(data);

} catch (err) {
  console.error("ClaimWise request error:", err);

  setError(
    err.message || "Unable to connect to ClaimWise AI."
  );
} finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setBill(null);
    setPolicy(null);
    setResult(null);
    setError("");
  };

  const UploadBox = ({ title, description, file, onChange }) => (
    <label className="upload-box">
      <div className="upload-icon">↑</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <input
        type="file"
        accept=".pdf,application/pdf"
        onChange={(e) => onChange(e.target.files[0] || null)}
      />
      {file ? (
        <div className="file-selected">
          <span>✓</span>
          <span>{file.name}</span>
        </div>
      ) : (
        <div className="upload-hint">Choose PDF document</div>
      )}
    </label>
  );

  const financial = result?.financial_estimate;

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">C</div>
          <div>
            <h2>ClaimWise <span>AI</span></h2>
            <p>Intelligent Healthcare Claims</p>
          </div>
        </div>

        <div className="nav-right">
          <span className="status-dot"></span>
          AI Claim Assistant
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div className="eyebrow">SMARTER CLAIMS. CLEARER DECISIONS.</div>
          <h1>Understand your health insurance claim.</h1>
          <p>
            Upload your hospital bill and insurance policy.
            ClaimWise AI analyzes expenses, identifies missing
            documents and estimates your financial responsibility.
          </p>
        </section>

        <section className="upload-section">
          <div className="section-heading">
            <div>
              <h2>Analyze a new claim</h2>
              <p>Upload the required documents to get started.</p>
            </div>
            <span className="step-label">STEP 01 · DOCUMENTS</span>
          </div>

          <div className="upload-grid">
            <UploadBox
              title="Hospital Bill"
              description="Upload the final itemized hospital bill."
              file={bill}
              onChange={setBill}
            />

            <UploadBox
              title="Insurance Policy"
              description="Upload the policy document for coverage analysis."
              file={policy}
              onChange={setPolicy}
            />
          </div>

          <div className="action-row">
            <button
              className="primary-button"
              onClick={analyzeClaim}
              disabled={loading || !bill || !policy}
            >
              {loading ? "Analyzing documents..." : "Analyze Claim →"}
            </button>
            
          </div>

          {loading && (
            <div className="loading-box">
              <div className="spinner"></div>
              <div>
                <strong>Analyzing your documents</strong>
                <p>Extracting information and checking policy evidence...</p>
              </div>
            </div>
          )}

          {error && <div className="error-box">{error}</div>}
        </section>

        {result && (
          <section className="results">
            <div className="result-heading">
              <div>
                <div className="eyebrow">ANALYSIS COMPLETE</div>
                <h2>Claim analysis report</h2>
                <p>AI-generated findings based on the uploaded documents.</p>
              </div>
              <button className="secondary-button" onClick={reset}>
                New Analysis
              </button>
            </div>

            {financial && (
              <div className="finance-grid">
                <div className="metric-card">
                  <p>Total Hospital Bill</p>
                  <h2>{money(financial.total_bill_inr)}</h2>
                </div>
                <div className="metric-card">
                  <p>Illustrative Coverage</p>
                  <h2>{money(financial.illustrative_coverage_inr)}</h2>
                </div>
                <div className="metric-card">
                  <p>Illustrative Patient Share</p>
                  <h2>{money(financial.illustrative_patient_share_inr)}</h2>
                </div>
                <div className="metric-card highlight">
                  <p>Estimated Monthly EMI</p>
                  <h2>{money(financial.estimated_monthly_emi_inr)}</h2>
                  <span>{financial.tenure_months} month tenure</span>
                </div>
              </div>
            )}

            <div className="result-grid">
              <div className="panel">
                <div className="panel-heading">
                  <h3>Potentially covered expenses</h3>
                  <span className="count">
                    {result.potentially_covered_items?.length || 0}
                  </span>
                </div>

                {result.potentially_covered_items?.map((item, index) => (
                  <div className="finding" key={index}>
                    <div className="finding-title">
                      <span className="check">✓</span>
                      <strong>{item.item}</strong>
                    </div>
                    <p>{item.reason}</p>
                    <small>Policy: {item.policy_evidence}</small>
                  </div>
                ))}
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <h3>Items requiring review</h3>
                  <span className="count warning-count">
                    {result.items_requiring_review?.length || 0}
                  </span>
                </div>

                {result.items_requiring_review?.map((item, index) => (
                  <div className="finding" key={index}>
                    <div className="finding-title">
                      <span className="warning">!</span>
                      <strong>{item.item}</strong>
                    </div>
                    <p>{item.reason}</p>
                  </div>
                ))}
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <h3>Missing documents</h3>
                  <span className="count warning-count">
                    {result.missing_documents?.length || 0}
                  </span>
                </div>

                {result.missing_documents?.length ? (
                  result.missing_documents.map((item, index) => (
                    <div className="simple-item" key={index}>
                      <span className="warning">!</span>
                      {item}
                    </div>
                  ))
                ) : (
                  <p className="empty-text">No confirmed missing documents identified.</p>
                )}
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <h3>Possible duplicate charges</h3>
                  <span className="count warning-count">
                    {result.possible_duplicates?.length || 0}
                  </span>
                </div>

                {result.possible_duplicates?.length ? (
                  result.possible_duplicates.map((item, index) => (
                    <div className="finding" key={index}>
                      <strong>{item.duplicate}</strong>
                      <p>{item.note}</p>
                    </div>
                  ))
                ) : (
                  <p className="empty-text">No possible duplicates identified.</p>
                )}
              </div>
            </div>

            <div className="panel explanation-panel">
              <h3>Patient-friendly explanation</h3>
              <p>{result.explanation}</p>
            </div>

            <div className="panel">
              <h3>Policy evidence</h3>
              {result.policy_evidence?.map((item, index) => (
                <div className="simple-item" key={index}>
                  <span className="evidence-dot"></span>
                  {item}
                </div>
              ))}
            </div>

            <div className="review-banner">
              <strong>Human review required</strong>
              <p>
                {result.review_status || "All findings must be verified by a qualified reviewer."}
              </p>
              {financial?.disclaimer && (
                <small>{financial.disclaimer}</small>
              )}
            </div>
          </section>
        )}
      </main>

      <footer>
        <strong>ClaimWise AI</strong>
        <p>AI-assisted insurance claim understanding · Educational prototype</p>
        <p>Final claim decisions remain with the insurer and authorized reviewers.</p>
      </footer>
    </div>
  );
}

export default App;
