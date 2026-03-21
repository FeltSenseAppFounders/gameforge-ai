"use client";

import { useState } from "react";

const mockAuditLogs = [
  { id: 1, user: "dr.patel@clinic.com", action: "Viewed patient record", resource: "Patient #1042", timestamp: "2026-03-18 09:14:32" },
  { id: 2, user: "admin@clinic.com", action: "Exported insurance report", resource: "Insurance Report Q1", timestamp: "2026-03-18 08:52:11" },
  { id: 3, user: "nurse.kim@clinic.com", action: "Updated appointment", resource: "Appointment #5521", timestamp: "2026-03-18 08:31:47" },
  { id: 4, user: "dr.lee@clinic.com", action: "Viewed patient record", resource: "Patient #0987", timestamp: "2026-03-17 17:44:09" },
  { id: 5, user: "admin@clinic.com", action: "Modified user permissions", resource: "User: nurse.kim", timestamp: "2026-03-17 16:20:33" },
  { id: 6, user: "dr.patel@clinic.com", action: "Sent appointment reminder", resource: "Patient #1042", timestamp: "2026-03-17 14:05:58" },
  { id: 7, user: "system@clinic.com", action: "Automated backup completed", resource: "Database Snapshot", timestamp: "2026-03-17 02:00:01" },
  { id: 8, user: "nurse.garcia@clinic.com", action: "Viewed patient record", resource: "Patient #0334", timestamp: "2026-03-16 15:37:22" },
  { id: 9, user: "admin@clinic.com", action: "Login from new device", resource: "Session #7841", timestamp: "2026-03-16 11:12:45" },
  { id: 10, user: "dr.kim@clinic.com", action: "Updated treatment notes", resource: "Patient #2210", timestamp: "2026-03-16 09:58:03" },
];

const retentionOptions = [30, 60, 90, 180];

export default function ComplianceSecurityPage() {
  const [retentionDays, setRetentionDays] = useState(90);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#F7FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#2D3748", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: 600, fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0 }}>
          VoiceAI Dashboard
        </h1>
        <span style={{ backgroundColor: "#B7791F", color: "#FFFFFF", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", padding: "4px 10px", borderRadius: "6px" }}>
          Demo Data
        </span>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px" }}>
        {/* Page title */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0, lineHeight: 1.25 }}>
            Compliance &amp; Security
          </h2>
          <p style={{ fontSize: "14px", color: "#718096", marginTop: "8px" }}>
            HIPAA compliance status, encryption, audit logs, and data retention settings
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* HIPAA Compliance Status Card */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            borderLeft: "4px solid #276749",
            boxShadow: "0 2px 4px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04)",
            padding: "24px 32px",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  HIPAA Compliance Status
                </h3>
                <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#718096" }}>
                  Last audit: <strong style={{ color: "#2D3748" }}>February 28, 2026</strong>
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#718096" }}>
                  Next scheduled audit: <strong style={{ color: "#2D3748" }}>May 31, 2026</strong>
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                <span style={{
                  backgroundColor: "#F0FFF4",
                  color: "#276749",
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  padding: "4px 10px",
                  borderRadius: "6px",
                }}>
                  Compliant
                </span>
                <span style={{ fontSize: "12px", color: "#A0AEC0" }}>All 45 controls passed</span>
              </div>
            </div>
          </div>

          {/* Encryption Section */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04)",
            padding: "24px 32px",
          }}>
            <h3 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Encryption
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "Data at Rest", detail: "AES-256 encryption on all stored patient data", enabled: true },
                { label: "Data in Transit", detail: "TLS 1.3 enforced for all API and web traffic", enabled: true },
                { label: "Database Backups", detail: "Encrypted snapshots stored in isolated environment", enabled: true },
                { label: "Key Management", detail: "AWS KMS with automatic key rotation every 90 days", enabled: true },
              ].map((item) => (
                <div key={item.label} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  backgroundColor: "#F7FAFC",
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                }}>
                  <div>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#2D3748" }}>{item.label}</p>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#718096" }}>{item.detail}</p>
                  </div>
                  <span style={{
                    backgroundColor: "#F0FFF4",
                    color: "#276749",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    whiteSpace: "nowrap",
                  }}>
                    Enabled
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Log Table */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}>
            <div style={{ padding: "24px 32px 16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                Audit Log
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#718096" }}>Last 10 access events</p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F7FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
                    <th style={{ padding: "10px 16px 10px 32px", textAlign: "left", fontSize: "14px", fontWeight: 600, color: "#4A5568" }}>User</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "14px", fontWeight: 600, color: "#4A5568" }}>Action</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "14px", fontWeight: 600, color: "#4A5568" }}>Resource</th>
                    <th style={{ padding: "10px 32px 10px 16px", textAlign: "left", fontSize: "14px", fontWeight: 600, color: "#4A5568" }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAuditLogs.map((log, idx) => (
                    <tr key={log.id} style={{ backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#F7FAFC", borderBottom: idx < mockAuditLogs.length - 1 ? "1px solid #E2E8F0" : "none" }}>
                      <td style={{ padding: "12px 16px 12px 32px", fontSize: "14px", color: "#2D3748" }}>{log.user}</td>
                      <td style={{ padding: "12px 16px", fontSize: "14px", color: "#2D3748" }}>{log.action}</td>
                      <td style={{ padding: "12px 16px", fontSize: "14px", color: "#718096" }}>{log.resource}</td>
                      <td style={{ padding: "12px 32px 12px 16px", fontSize: "14px", color: "#718096", whiteSpace: "nowrap" }}>{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Data Retention Settings */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04)",
            padding: "24px 32px",
          }}>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Data Retention
            </h3>
            <p style={{ margin: "0 0 20px", fontSize: "14px", color: "#718096" }}>
              Configure how long audit and activity logs are retained before automatic deletion.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
              {retentionOptions.map((days) => (
                <button
                  key={days}
                  onClick={() => setRetentionDays(days)}
                  style={{
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: 600,
                    borderRadius: "10px",
                    border: retentionDays === days ? "2px solid #2B6CB0" : "2px solid #E2E8F0",
                    backgroundColor: retentionDays === days ? "#EBF8FF" : "#F7FAFC",
                    color: retentionDays === days ? "#2B6CB0" : "#4A5568",
                    cursor: "pointer",
                    transition: "all 150ms",
                    minHeight: "44px",
                  }}
                >
                  {days} days
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button
                onClick={handleSave}
                style={{
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: 600,
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#2B6CB0",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  minHeight: "44px",
                  transition: "background-color 150ms",
                }}
              >
                Save Settings
              </button>
              {saved && (
                <span style={{ fontSize: "14px", color: "#276749", fontWeight: 600 }}>
                  Settings saved
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
