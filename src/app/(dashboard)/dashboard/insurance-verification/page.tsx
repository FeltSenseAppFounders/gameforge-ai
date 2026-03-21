"use client";

import { useState } from "react";
import { InsuranceVerificationResultCard, type VerificationResultData } from "@/components/ui/InsuranceVerificationResultCard";

const INSURANCE_PROVIDERS = [
  "Aetna",
  "Blue Cross Blue Shield",
  "Cigna",
  "Delta Dental",
  "Humana",
  "MetLife",
  "Principal Financial",
  "Sun Life",
  "UnitedHealthcare",
];

const MOCK_RESULTS: Record<string, Omit<VerificationResultData, "patientName" | "insuranceProvider" | "memberId">> = {
  "Aetna": {
    coverageStatus: "Active", copayAmount: "$20", deductibleMet: 65, annualMaximum: "$2,000", inNetwork: true,
    benefits: [{ name: "Preventive", percentage: 100 }, { name: "Basic", percentage: 80 }, { name: "Major", percentage: 50 }],
    warnings: [],
  },
  "Blue Cross Blue Shield": {
    coverageStatus: "Active", copayAmount: "$25", deductibleMet: 40, annualMaximum: "$1,500", inNetwork: true,
    benefits: [{ name: "Preventive", percentage: 100 }, { name: "Basic", percentage: 70 }, { name: "Major", percentage: 40 }],
    warnings: ["6-month waiting period applies for Major services"],
  },
  "Cigna": {
    coverageStatus: "Partial", copayAmount: "$30", deductibleMet: 80, annualMaximum: "$3,000", inNetwork: true,
    benefits: [{ name: "Preventive", percentage: 80 }, { name: "Basic", percentage: 60 }, { name: "Major", percentage: 30 }],
    warnings: ["Coverage pending eligibility confirmation", "Missing group number on file"],
  },
  "Delta Dental": {
    coverageStatus: "Active", copayAmount: "$15", deductibleMet: 100, annualMaximum: "$2,500", inNetwork: true,
    benefits: [{ name: "Preventive", percentage: 100 }, { name: "Basic", percentage: 80 }, { name: "Major", percentage: 60 }],
    warnings: [],
  },
  "Humana": {
    coverageStatus: "Inactive", copayAmount: "N/A", deductibleMet: 0, annualMaximum: "N/A", inNetwork: false,
    benefits: [{ name: "Preventive", percentage: 0 }, { name: "Basic", percentage: 0 }, { name: "Major", percentage: 0 }],
    warnings: ["Policy terminated as of 2026-01-01", "Patient should contact Humana to reinstate coverage"],
  },
  "MetLife": {
    coverageStatus: "Active", copayAmount: "$20", deductibleMet: 55, annualMaximum: "$1,800", inNetwork: true,
    benefits: [{ name: "Preventive", percentage: 100 }, { name: "Basic", percentage: 75 }, { name: "Major", percentage: 45 }],
    warnings: [],
  },
  "Principal Financial": {
    coverageStatus: "Partial", copayAmount: "$35", deductibleMet: 20, annualMaximum: "$1,000", inNetwork: false,
    benefits: [{ name: "Preventive", percentage: 70 }, { name: "Basic", percentage: 40 }, { name: "Major", percentage: 0 }],
    warnings: ["Out-of-network provider — higher cost-sharing applies", "Major services not covered under current plan tier"],
  },
  "Sun Life": {
    coverageStatus: "Inactive", copayAmount: "N/A", deductibleMet: 0, annualMaximum: "N/A", inNetwork: false,
    benefits: [{ name: "Preventive", percentage: 0 }, { name: "Basic", percentage: 0 }, { name: "Major", percentage: 0 }],
    warnings: ["Policy not found — verify member ID", "Contact Sun Life at 1-800-SUN-LIFE for assistance"],
  },
  "UnitedHealthcare": {
    coverageStatus: "Active", copayAmount: "$25", deductibleMet: 75, annualMaximum: "$2,200", inNetwork: true,
    benefits: [{ name: "Preventive", percentage: 100 }, { name: "Basic", percentage: 80 }, { name: "Major", percentage: 55 }],
    warnings: [],
  },
};

const MOCK_HISTORY = [
  { id: 1, patient: "Jane Smith", provider: "Delta Dental", memberId: "DD-123456", status: "Active", timestamp: "2026-03-17 09:12 AM" },
  { id: 2, patient: "Robert Chen", provider: "Aetna", memberId: "AET-789012", status: "Active", timestamp: "2026-03-17 08:45 AM" },
  { id: 3, patient: "Maria Garcia", provider: "Humana", memberId: "HUM-345678", status: "Inactive", timestamp: "2026-03-16 03:30 PM" },
  { id: 4, patient: "David Kim", provider: "Blue Cross Blue Shield", memberId: "BCBS-901234", status: "Active", timestamp: "2026-03-16 02:15 PM" },
  { id: 5, patient: "Susan Lee", provider: "UnitedHealthcare", memberId: "UHC-567890", status: "Active", timestamp: "2026-03-15 11:00 AM" },
];

export default function InsuranceVerificationPage() {
  const [form, setForm] = useState({
    patientName: "",
    dateOfBirth: "",
    insuranceProvider: "",
    memberId: "",
    groupNumber: "",
  });
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResultData | null>(null);
  const [verified, setVerified] = useState(false);

  function handleVerify() {
    setVerifying(true);
    setResult(null);
    setVerified(false);
    setTimeout(() => {
      const base = MOCK_RESULTS[form.insuranceProvider] || {
        coverageStatus: "Active" as const,
        copayAmount: "$25",
        deductibleMet: 50,
        annualMaximum: "$2,000",
        inNetwork: true,
        benefits: [{ name: "Preventive", percentage: 100 }, { name: "Basic", percentage: 70 }, { name: "Major", percentage: 50 }],
        warnings: [],
      };
      const mockResult: VerificationResultData = {
        ...base,
        patientName: form.patientName,
        insuranceProvider: form.insuranceProvider,
        memberId: form.memberId,
      };
      setResult(mockResult);
      setVerified(true);
      setVerifying(false);
    }, 2500);
  }

  const canVerify =
    form.patientName.trim() &&
    form.dateOfBirth &&
    form.insuranceProvider &&
    form.memberId.trim() &&
    form.groupNumber.trim();

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#F7FAFC", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{ backgroundColor: "#2D3748", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: 600, fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0 }}>
          VoiceAI Dashboard
        </h1>
        <span style={{ backgroundColor: "#B7791F", color: "#FFFFFF", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", padding: "4px 10px", borderRadius: "6px" }}>
          Demo Data
        </span>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px" }}>
        {/* Page title */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0, lineHeight: 1.25 }}>
            Insurance Verification
          </h2>
          <p style={{ fontSize: "14px", color: "#718096", marginTop: "8px" }}>
            Verify patient insurance coverage in real time · Mock data
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>
          {/* Verification Form */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.07)", overflow: "hidden", borderLeft: "4px solid #2B6CB0" }}>
            <div style={{ padding: "24px", borderBottom: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0 }}>
                Patient & Insurance Details
              </h3>
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Patient Name */}
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#2D3748", marginBottom: "6px" }}>
                  Patient Name
                </label>
                <input
                  type="text"
                  placeholder="Enter patient full name"
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #CBD5E0", borderRadius: "10px", fontSize: "16px", color: "#2D3748", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#2D3748", marginBottom: "6px" }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #CBD5E0", borderRadius: "10px", fontSize: "16px", color: "#2D3748", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* Insurance Provider */}
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#2D3748", marginBottom: "6px" }}>
                  Insurance Provider
                </label>
                <select
                  value={form.insuranceProvider}
                  onChange={(e) => { setForm({ ...form, insuranceProvider: e.target.value }); setResult(null); setVerified(false); }}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #CBD5E0", borderRadius: "10px", fontSize: "16px", color: form.insuranceProvider ? "#2D3748" : "#A0AEC0", outline: "none", backgroundColor: "#FFFFFF", boxSizing: "border-box" }}
                >
                  <option value="">Select insurance provider</option>
                  {INSURANCE_PROVIDERS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Member ID */}
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#2D3748", marginBottom: "6px" }}>
                  Member ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. AET-789012"
                  value={form.memberId}
                  onChange={(e) => setForm({ ...form, memberId: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #CBD5E0", borderRadius: "10px", fontSize: "16px", color: "#2D3748", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* Group Number */}
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#2D3748", marginBottom: "6px" }}>
                  Group Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. GRP-001234"
                  value={form.groupNumber}
                  onChange={(e) => setForm({ ...form, groupNumber: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #CBD5E0", borderRadius: "10px", fontSize: "16px", color: "#2D3748", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerify}
                disabled={!canVerify || verifying}
                style={{
                  marginTop: "8px",
                  padding: "12px 24px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: !canVerify || verifying ? "#CBD5E0" : "#2B6CB0",
                  color: !canVerify || verifying ? "#A0AEC0" : "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: !canVerify || verifying ? "not-allowed" : "pointer",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                }}
              >
                {verifying && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ animation: "spin 0.8s linear infinite" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                )}
                {verifying ? "Verifying..." : "Verify Now"}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {!verified && !verifying && (
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.07)", padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "9999px", backgroundColor: "#EDF2F7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#A0AEC0" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p style={{ fontSize: "14px", color: "#718096", margin: 0 }}>
                  Fill in the form and click <strong>Verify Now</strong> to check insurance coverage.
                </p>
              </div>
            )}

            {verifying && (
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.07)", padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2B6CB0" strokeWidth={2.5} style={{ animation: "spin 0.8s linear infinite" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                <p style={{ fontSize: "14px", color: "#4A5568", margin: 0, fontWeight: 600 }}>Verifying insurance coverage...</p>
                <p style={{ fontSize: "12px", color: "#A0AEC0", margin: 0 }}>Checking eligibility with {form.insuranceProvider}</p>
              </div>
            )}

            {verified && result && (
              <InsuranceVerificationResultCard result={result} />
            )}
          </div>
        </div>

        {/* Verification History Table */}
        <div style={{ marginTop: "32px", backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.07)", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0 }}>
              Recent Verifications
            </h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#F7FAFC" }}>
                {["Patient", "Insurance Provider", "Member ID", "Status", "Timestamp"].map((col) => (
                  <th key={col} style={{ padding: "14px 20px", textAlign: "left", fontSize: "14px", fontWeight: 600, color: "#4A5568", borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_HISTORY.map((row, idx) => (
                <tr key={row.id} style={{ backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#F7FAFC", borderBottom: "1px solid #E2E8F0" }}>
                  <td style={{ padding: "14px 20px", fontSize: "14px", fontWeight: 600, color: "#2D3748" }}>{row.patient}</td>
                  <td style={{ padding: "14px 20px", fontSize: "14px", color: "#4A5568" }}>{row.provider}</td>
                  <td style={{ padding: "14px 20px", fontSize: "14px", color: "#4A5568", fontFamily: "monospace" }}>{row.memberId}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{
                      backgroundColor: row.status === "Active" ? "#F0FFF4" : "#FFF5F5",
                      color: row.status === "Active" ? "#276749" : "#C53030",
                      fontSize: "11px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      padding: "4px 10px",
                      borderRadius: "6px",
                    }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "14px", color: "#718096" }}>{row.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
