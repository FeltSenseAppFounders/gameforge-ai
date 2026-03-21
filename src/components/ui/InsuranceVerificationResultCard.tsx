"use client";

import { useState } from "react";

export type CoverageStatus = "Active" | "Inactive" | "Partial";

export interface BenefitCategory {
  name: string;
  percentage: number;
}

export interface VerificationResultData {
  coverageStatus: CoverageStatus;
  patientName: string;
  insuranceProvider: string;
  memberId: string;
  copayAmount: string;
  deductibleMet: number;
  annualMaximum: string;
  inNetwork: boolean;
  benefits: BenefitCategory[];
  warnings: string[];
}

interface Props {
  result: VerificationResultData;
}

const STATUS_CONFIG: Record<CoverageStatus, { bg: string; text: string; border: string; label: string }> = {
  Active: { bg: "#F0FFF4", text: "#276749", border: "#276749", label: "Active" },
  Inactive: { bg: "#FFF5F5", text: "#C53030", border: "#C53030", label: "Inactive" },
  Partial: { bg: "#FFFFF0", text: "#B7791F", border: "#B7791F", label: "Partial" },
};

export function InsuranceVerificationResultCard({ result }: Props) {
  const [copied, setCopied] = useState(false);

  const status = STATUS_CONFIG[result.coverageStatus];

  function handleCopy() {
    const summary = [
      `Insurance Verification Result`,
      `--------------------------------`,
      `Patient: ${result.patientName}`,
      `Provider: ${result.insuranceProvider}`,
      `Member ID: ${result.memberId}`,
      `Coverage Status: ${result.coverageStatus}`,
      `Copay: ${result.copayAmount}`,
      `Deductible Met: ${result.deductibleMet}%`,
      `Annual Maximum: ${result.annualMaximum}`,
      `Network: ${result.inNetwork ? "In-Network" : "Out-of-Network"}`,
      ``,
      `Benefit Coverage:`,
      ...result.benefits.map((b) => `  ${b.name}: ${b.percentage}%`),
    ];

    if (result.warnings.length > 0) {
      summary.push(``, `Warnings/Notes:`);
      result.warnings.forEach((w) => summary.push(`  • ${w}`));
    }

    navigator.clipboard.writeText(summary.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
        overflow: "hidden",
        animation: "fadeIn 300ms ease-out",
        borderLeft: `4px solid ${status.border}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#1A202C",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            margin: 0,
          }}
        >
          Verification Results
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              backgroundColor: status.bg,
              color: status.text,
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              padding: "4px 10px",
              borderRadius: "6px",
            }}
          >
            {status.label}
          </span>
          <button
            onClick={handleCopy}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "10px",
              border: "1px solid #CBD5E0",
              backgroundColor: copied ? "#F0FFF4" : "#FFFFFF",
              color: copied ? "#276749" : "#4A5568",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              minHeight: "32px",
              transition: "background-color 150ms",
            }}
          >
            {copied ? (
              <>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Core details grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div style={{ backgroundColor: "#F7FAFC", borderRadius: "10px", padding: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#718096", marginBottom: "6px" }}>Coverage Status</div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: status.text, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              {result.coverageStatus}
            </div>
          </div>

          <div style={{ backgroundColor: "#F7FAFC", borderRadius: "10px", padding: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#718096", marginBottom: "6px" }}>Copay Amount</div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#2D3748", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              {result.copayAmount}
            </div>
          </div>

          <div style={{ backgroundColor: "#F7FAFC", borderRadius: "10px", padding: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#718096", marginBottom: "6px" }}>Deductible Met</div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#2D3748", fontFamily: "Plus Jakarta Sans, sans-serif", marginBottom: "8px" }}>
              {result.deductibleMet}%
            </div>
            <div style={{ height: "6px", backgroundColor: "#E2E8F0", borderRadius: "9999px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${result.deductibleMet}%`,
                  backgroundColor: result.deductibleMet === 100 ? "#276749" : "#2B6CB0",
                  borderRadius: "9999px",
                  transition: "width 600ms ease-out",
                }}
              />
            </div>
          </div>

          <div style={{ backgroundColor: "#F7FAFC", borderRadius: "10px", padding: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#718096", marginBottom: "6px" }}>Annual Maximum</div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#2D3748", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              {result.annualMaximum}
            </div>
          </div>

          <div style={{ backgroundColor: "#F7FAFC", borderRadius: "10px", padding: "16px", gridColumn: "1 / -1" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#718096", marginBottom: "6px" }}>In-Network Status</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "9999px", backgroundColor: result.inNetwork ? "#276749" : "#C53030" }} />
              <span style={{ fontSize: "14px", fontWeight: 600, color: result.inNetwork ? "#276749" : "#C53030" }}>
                {result.inNetwork ? "In-Network" : "Out-of-Network"}
              </span>
            </div>
          </div>
        </div>

        {/* Benefit Categories */}
        <div style={{ border: "1px solid #E2E8F0", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", backgroundColor: "#F7FAFC", borderBottom: "1px solid #E2E8F0" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#718096" }}>
              Benefit Coverage
            </span>
          </div>
          <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {result.benefits.map((benefit) => (
              <div key={benefit.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#2D3748" }}>{benefit.name}</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#2B6CB0" }}>{benefit.percentage}%</span>
                </div>
                <div style={{ height: "6px", backgroundColor: "#E2E8F0", borderRadius: "9999px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${benefit.percentage}%`,
                      backgroundColor: benefit.percentage >= 80 ? "#276749" : benefit.percentage >= 50 ? "#2B6CB0" : "#B7791F",
                      borderRadius: "9999px",
                      transition: "width 600ms ease-out",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warnings / Notes */}
        {result.warnings.length > 0 && (
          <div
            style={{
              backgroundColor: "rgba(183,121,31,0.08)",
              border: "1px solid #B7791F",
              borderLeft: "4px solid #B7791F",
              borderRadius: "10px",
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#B7791F" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#B7791F" }}>Warnings / Notes</span>
            </div>
            {result.warnings.map((warning, i) => (
              <div key={i} style={{ display: "flex", gap: "8px" }}>
                <span style={{ fontSize: "13px", color: "#B7791F", flexShrink: 0 }}>•</span>
                <span style={{ fontSize: "13px", color: "#4A5568" }}>{warning}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
