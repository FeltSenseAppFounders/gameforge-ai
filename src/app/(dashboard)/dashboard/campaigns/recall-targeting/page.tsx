"use client";

import { useState } from "react";
import Link from "next/link";

interface Patient {
  id: number;
  name: string;
  phone: string;
  lastVisit: string;
  recallDue: string;
  insurance: string;
  appointmentType: string;
}

const allMockPatients: Patient[] = [
  { id: 1,  name: "Sarah Johnson",    phone: "(555) 210-4821", lastVisit: "Sep 14, 2025", recallDue: "Mar 14, 2026", insurance: "insured",    appointmentType: "cleaning" },
  { id: 2,  name: "Michael Torres",   phone: "(555) 384-9021", lastVisit: "Aug 30, 2025", recallDue: "Feb 28, 2026", insurance: "insured",    appointmentType: "cleaning" },
  { id: 3,  name: "Emily Chen",       phone: "(555) 472-6603", lastVisit: "Oct 02, 2025", recallDue: "Apr 02, 2026", insurance: "uninsured",  appointmentType: "exam" },
  { id: 4,  name: "David Patel",      phone: "(555) 601-3347", lastVisit: "Jul 19, 2025", recallDue: "Jan 19, 2026", insurance: "insured",    appointmentType: "cleaning" },
  { id: 5,  name: "Linda Martinez",   phone: "(555) 719-8802", lastVisit: "Sep 05, 2025", recallDue: "Mar 05, 2026", insurance: "medicaid",   appointmentType: "cleaning" },
  { id: 6,  name: "James Wilson",     phone: "(555) 835-5514", lastVisit: "Jun 28, 2025", recallDue: "Dec 28, 2025", insurance: "insured",    appointmentType: "x-ray" },
  { id: 7,  name: "Aisha Okafor",     phone: "(555) 923-1167", lastVisit: "Oct 20, 2025", recallDue: "Apr 20, 2026", insurance: "uninsured",  appointmentType: "cleaning" },
  { id: 8,  name: "Robert Kim",       phone: "(555) 045-7790", lastVisit: "Aug 11, 2025", recallDue: "Feb 11, 2026", insurance: "insured",    appointmentType: "exam" },
  { id: 9,  name: "Patricia Green",   phone: "(555) 168-2243", lastVisit: "Sep 22, 2025", recallDue: "Mar 22, 2026", insurance: "medicaid",   appointmentType: "cleaning" },
  { id: 10, name: "Thomas Nguyen",    phone: "(555) 254-8876", lastVisit: "Jul 03, 2025", recallDue: "Jan 03, 2026", insurance: "insured",    appointmentType: "cleaning" },
  { id: 11, name: "Maria Rodriguez",  phone: "(555) 362-1459", lastVisit: "Oct 08, 2025", recallDue: "Apr 08, 2026", insurance: "uninsured",  appointmentType: "exam" },
  { id: 12, name: "William Scott",    phone: "(555) 471-8834", lastVisit: "Aug 25, 2025", recallDue: "Feb 25, 2026", insurance: "insured",    appointmentType: "cleaning" },
  { id: 13, name: "Nancy Adams",      phone: "(555) 580-3312", lastVisit: "Sep 30, 2025", recallDue: "Mar 30, 2026", insurance: "medicaid",   appointmentType: "cleaning" },
  { id: 14, name: "Charles Hall",     phone: "(555) 697-6621", lastVisit: "Jul 14, 2025", recallDue: "Jan 14, 2026", insurance: "insured",    appointmentType: "x-ray" },
  { id: 15, name: "Karen Young",      phone: "(555) 712-9947", lastVisit: "Oct 17, 2025", recallDue: "Apr 17, 2026", insurance: "uninsured",  appointmentType: "cleaning" },
];

const appointmentTypeOptions = [
  { value: "all",      label: "All Types" },
  { value: "cleaning", label: "Cleaning" },
  { value: "exam",     label: "Exam" },
  { value: "x-ray",   label: "X-Ray" },
];

const insuranceOptions = [
  { value: "all",       label: "All Patients" },
  { value: "insured",   label: "Insured" },
  { value: "uninsured", label: "Uninsured" },
  { value: "medicaid",  label: "Medicaid" },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  fontSize: "14px",
  border: "1px solid #CBD5E0",
  borderRadius: "10px",
  outline: "none",
  fontFamily: "Inter, sans-serif",
  color: "#2D3748",
  backgroundColor: "#FFFFFF",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "14px",
  fontWeight: 600,
  color: "#2D3748",
  marginBottom: "6px",
};

function focusIn(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.target.style.borderColor = "#2B6CB0";
  e.target.style.boxShadow = "0 0 0 3px rgba(43,108,176,0.35)";
}
function focusOut(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.target.style.borderColor = "#CBD5E0";
  e.target.style.boxShadow = "none";
}

export default function RecallTargetingPage() {
  const [lastVisitFrom, setLastVisitFrom] = useState("2025-06-01");
  const [lastVisitTo, setLastVisitTo] = useState("2025-10-31");
  const [appointmentType, setAppointmentType] = useState("all");
  const [insuranceStatus, setInsuranceStatus] = useState("all");
  const [previewed, setPreviewed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const filteredPatients = allMockPatients.filter((p) => {
    if (appointmentType !== "all" && p.appointmentType !== appointmentType) return false;
    if (insuranceStatus !== "all" && p.insurance !== insuranceStatus) return false;
    return true;
  });

  const handlePreview = () => {
    setPreviewed(true);
  };

  const handleConfirm = () => {
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <main style={{ minHeight: "100vh", backgroundColor: "#F7FAFC", fontFamily: "Inter, sans-serif" }}>
        <div style={{ backgroundColor: "#2D3748", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: 600, fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0 }}>
            VoiceAI Dashboard
          </h1>
          <span style={{ backgroundColor: "#B7791F", color: "#FFFFFF", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", padding: "4px 10px", borderRadius: "6px" }}>
            Demo Data
          </span>
        </div>
        <div style={{ maxWidth: "640px", margin: "80px auto", padding: "32px", textAlign: "center" }}>
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "48px 32px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)",
            border: "1px solid #E2E8F0",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
            <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: "0 0 8px" }}>
              Audience Confirmed
            </h2>
            <p style={{ fontSize: "14px", color: "#718096", margin: "0 0 8px" }}>
              <strong style={{ color: "#2B6CB0", fontSize: "28px", display: "block", lineHeight: 1.2 }}>{filteredPatients.length}</strong>
              patients locked in for this recall campaign.
            </p>
            <p style={{ fontSize: "14px", color: "#718096", margin: "16px 0 32px" }}>
              Proceeding to campaign scheduling…
            </p>
            <Link
              href="/campaigns"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#FFFFFF",
                backgroundColor: "#2B6CB0",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                textDecoration: "none",
              }}
            >
              Back to Campaigns
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#F7FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* Top bar */}
      <div style={{ backgroundColor: "#2D3748", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: 600, fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0 }}>
          VoiceAI Dashboard
        </h1>
        <span style={{ backgroundColor: "#B7791F", color: "#FFFFFF", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", padding: "4px 10px", borderRadius: "6px" }}>
          Demo Data
        </span>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", fontSize: "14px" }}>
          <Link href="/campaigns" style={{ color: "#2B6CB0", textDecoration: "none", fontWeight: 500 }}>
            Campaigns
          </Link>
          <span style={{ color: "#A0AEC0" }}>/</span>
          <span style={{ color: "#718096" }}>Recall Targeting</span>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
          {["1. Target Audience", "2. Schedule", "3. Review & Launch"].map((step, i) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {i > 0 && <span style={{ color: "#CBD5E0", fontSize: "12px" }}>›</span>}
              <span style={{
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: "9999px",
                backgroundColor: i === 0 ? "#2B6CB0" : "#E2E8F0",
                color: i === 0 ? "#FFFFFF" : "#A0AEC0",
              }}>
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Page title */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: "0 0 8px", lineHeight: 1.25 }}>
            Target Audience
          </h2>
          <p style={{ fontSize: "14px", color: "#718096", margin: 0 }}>
            Define filters to identify patients due for routine recall. Preview the matching list before confirming.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "24px", alignItems: "start" }}>
          {/* Filter panel */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04)",
            border: "1px solid #E2E8F0",
            overflow: "hidden",
          }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0 }}>
                Targeting Filters
              </h3>
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Last Visit Date Range */}
              <div>
                <label style={{ ...labelStyle, marginBottom: "10px" }}>
                  Last Visit Date Range
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div>
                    <label style={{ fontSize: "12px", color: "#718096", marginBottom: "4px", display: "block" }}>From</label>
                    <input
                      type="date"
                      value={lastVisitFrom}
                      onChange={(e) => { setLastVisitFrom(e.target.value); setPreviewed(false); }}
                      style={inputStyle}
                      onFocus={focusIn}
                      onBlur={focusOut}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "#718096", marginBottom: "4px", display: "block" }}>To</label>
                    <input
                      type="date"
                      value={lastVisitTo}
                      onChange={(e) => { setLastVisitTo(e.target.value); setPreviewed(false); }}
                      style={inputStyle}
                      onFocus={focusIn}
                      onBlur={focusOut}
                    />
                  </div>
                </div>
              </div>

              {/* Appointment Type */}
              <div>
                <label style={labelStyle}>Appointment Type</label>
                <select
                  value={appointmentType}
                  onChange={(e) => { setAppointmentType(e.target.value); setPreviewed(false); }}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={focusIn}
                  onBlur={focusOut}
                >
                  {appointmentTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Insurance Status */}
              <div>
                <label style={labelStyle}>Insurance Status</label>
                <select
                  value={insuranceStatus}
                  onChange={(e) => { setInsuranceStatus(e.target.value); setPreviewed(false); }}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={focusIn}
                  onBlur={focusOut}
                >
                  {insuranceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Preview button */}
              <button
                onClick={handlePreview}
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  backgroundColor: "#2B6CB0",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  minHeight: "44px",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1A4C8A"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2B6CB0"; }}
              >
                Preview Audience
              </button>
            </div>
          </div>

          {/* Results panel */}
          <div>
            {!previewed ? (
              <div style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                border: "1px solid #E2E8F0",
                padding: "48px 32px",
                textAlign: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04)",
              }}>
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔍</div>
                <p style={{ fontSize: "16px", fontWeight: 600, color: "#4A5568", margin: "0 0 8px", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  Set your filters and click Preview Audience
                </p>
                <p style={{ fontSize: "14px", color: "#A0AEC0", margin: 0 }}>
                  Matching patients will appear here
                </p>
              </div>
            ) : (
              <div style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04)",
                border: "1px solid #E2E8F0",
                overflow: "hidden",
              }}>
                {/* Results header */}
                <div style={{
                  padding: "20px 24px",
                  borderBottom: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0 }}>
                      Matching Patients
                    </h3>
                    <span style={{
                      display: "inline-block",
                      backgroundColor: "#EBF8FF",
                      color: "#2B6CB0",
                      fontSize: "11px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      padding: "4px 10px",
                      borderRadius: "6px",
                    }}>
                      {filteredPatients.length} patients
                    </span>
                  </div>

                  <button
                    onClick={handleConfirm}
                    style={{
                      padding: "10px 20px",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#FFFFFF",
                      backgroundColor: "#276749",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontFamily: "Inter, sans-serif",
                      minHeight: "44px",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1C4532"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#276749"; }}
                  >
                    Confirm Audience →
                  </button>
                </div>

                {filteredPatients.length === 0 ? (
                  <div style={{ padding: "48px 32px", textAlign: "center" }}>
                    <p style={{ fontSize: "14px", color: "#A0AEC0", margin: 0 }}>
                      No patients match the selected filters. Try adjusting your criteria.
                    </p>
                  </div>
                ) : (
                  <>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#F7FAFC", borderBottom: "1px solid #E2E8F0" }}>
                            {["Patient Name", "Last Visit", "Phone", "Recall Due"].map((col) => (
                              <th
                                key={col}
                                style={{
                                  padding: "12px 16px",
                                  textAlign: "left",
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  color: "#4A5568",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPatients.map((patient, idx) => (
                            <tr
                              key={patient.id}
                              style={{
                                backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#F7FAFC",
                                borderBottom: "1px solid #E2E8F0",
                                transition: "background-color 150ms",
                              }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "#EDF2F7"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = idx % 2 === 0 ? "#FFFFFF" : "#F7FAFC"; }}
                            >
                              <td style={{ padding: "14px 16px" }}>
                                <span style={{ fontSize: "14px", fontWeight: 600, color: "#2D3748" }}>
                                  {patient.name}
                                </span>
                                <div style={{ fontSize: "12px", color: "#A0AEC0", marginTop: "2px", textTransform: "capitalize" }}>
                                  {patient.appointmentType} · {patient.insurance}
                                </div>
                              </td>
                              <td style={{ padding: "14px 16px", fontSize: "14px", color: "#4A5568", whiteSpace: "nowrap" }}>
                                {patient.lastVisit}
                              </td>
                              <td style={{ padding: "14px 16px", fontSize: "14px", color: "#4A5568", whiteSpace: "nowrap" }}>
                                {patient.phone}
                              </td>
                              <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                                <span style={{
                                  display: "inline-block",
                                  backgroundColor: "#FFF5F5",
                                  color: "#C53030",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  padding: "3px 8px",
                                  borderRadius: "6px",
                                }}>
                                  {patient.recallDue}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div style={{ padding: "12px 16px", borderTop: "1px solid #E2E8F0", fontSize: "12px", color: "#A0AEC0" }}>
                      {filteredPatients.length} patients matched · filters applied
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
