"use client";

import { useState } from "react";

interface PatientRecord {
  name: string;
  lastVisit: string;
  nextAppointment: string;
  insurance: string;
  dob: string;
  phone: string;
}

const mockPatients: Record<string, PatientRecord> = {
  "(555) 234-5678": {
    name: "Jane Smith",
    lastVisit: "Feb 14, 2026",
    nextAppointment: "Apr 2, 2026 at 10:00 AM",
    insurance: "Delta Dental PPO",
    dob: "Mar 12, 1985",
    phone: "(555) 234-5678",
  },
  "(555) 891-2345": {
    name: "Robert Chen",
    lastVisit: "Jan 30, 2026",
    nextAppointment: "Mar 28, 2026 at 2:30 PM",
    insurance: "Delta Dental PPO",
    dob: "Jul 7, 1972",
    phone: "(555) 891-2345",
  },
  "(555) 123-9876": {
    name: "David Kim",
    lastVisit: "Feb 8, 2026",
    nextAppointment: "May 8, 2026 at 11:00 AM",
    insurance: "Cigna Dental HMO",
    dob: "Nov 3, 1990",
    phone: "(555) 123-9876",
  },
  "(555) 678-3412": {
    name: "Susan Lee",
    lastVisit: "Mar 5, 2026",
    nextAppointment: "Apr 18, 2026 at 2:00 PM",
    insurance: "Aetna PPO",
    dob: "Apr 22, 1978",
    phone: "(555) 678-3412",
  },
};

const DEMO_KNOWN = "(555) 234-5678";
const DEMO_UNKNOWN = "(555) 999-0000";

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function PatientRecognitionPage() {
  const [rawInput, setRawInput] = useState("");
  const [searched, setSearched] = useState(false);

  const phone = formatPhone(rawInput);
  const patient = searched ? (mockPatients[phone] ?? null) : undefined;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawInput(e.target.value.replace(/\D/g, "").slice(0, 10));
    setSearched(false);
  };

  const handleSearch = () => {
    if (rawInput.replace(/\D/g, "").length >= 10) setSearched(true);
  };

  const handleDemo = (number: string) => {
    const digits = number.replace(/\D/g, "");
    setRawInput(digits);
    setSearched(true);
  };

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

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px" }}>
        {/* Page title */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0, lineHeight: 1.25 }}>
            Patient Recognition
          </h2>
          <p style={{ fontSize: "14px", color: "#718096", marginTop: "8px" }}>
            Enter a caller phone number to identify the patient
          </p>
        </div>

        {/* Phone Input */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)",
            border: "1px solid #E2E8F0",
            marginBottom: "24px",
          }}
        >
          <label
            htmlFor="phone-input"
            style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#4A5568", marginBottom: "6px" }}
          >
            Phone Number
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              id="phone-input"
              type="text"
              inputMode="numeric"
              placeholder="(555) 000-0000"
              value={phone}
              onChange={handleInput}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              style={{
                flex: 1,
                padding: "10px 14px",
                fontSize: "16px",
                border: "1px solid #CBD5E0",
                borderRadius: "10px",
                outline: "none",
                fontFamily: "Inter, sans-serif",
                color: "#2D3748",
                backgroundColor: "#FFFFFF",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#2B6CB0"; e.target.style.boxShadow = "0 0 0 3px rgba(43,108,176,0.35)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#CBD5E0"; e.target.style.boxShadow = "none"; }}
            />
            <button
              onClick={handleSearch}
              disabled={rawInput.replace(/\D/g, "").length < 10}
              style={{
                padding: "10px 24px",
                fontSize: "14px",
                fontWeight: 600,
                backgroundColor: rawInput.replace(/\D/g, "").length < 10 ? "#CBD5E0" : "#2B6CB0",
                color: rawInput.replace(/\D/g, "").length < 10 ? "#A0AEC0" : "#FFFFFF",
                border: "none",
                borderRadius: "10px",
                cursor: rawInput.replace(/\D/g, "").length < 10 ? "default" : "pointer",
                minHeight: "44px",
                transition: "background-color 150ms",
              }}
            >
              Look Up
            </button>
          </div>

          {/* Demo toggle buttons */}
          <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#A0AEC0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Demo:
            </span>
            <button
              onClick={() => handleDemo(DEMO_KNOWN)}
              style={{
                padding: "4px 12px",
                fontSize: "12px",
                fontWeight: 600,
                backgroundColor: "#F0FFF4",
                color: "#276749",
                border: "1px solid #276749",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Known Patient
            </button>
            <button
              onClick={() => handleDemo(DEMO_UNKNOWN)}
              style={{
                padding: "4px 12px",
                fontSize: "12px",
                fontWeight: 600,
                backgroundColor: "#F7FAFC",
                color: "#718096",
                border: "1px solid #CBD5E0",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Unknown Patient
            </button>
          </div>
        </div>

        {/* Results */}
        {patient !== undefined && (
          patient ? (
            <RecognizedPatientCard patient={patient} />
          ) : (
            <UnknownPatientCard phone={phone} />
          )
        )}
      </div>
    </main>
  );
}

function RecognizedPatientCard({ patient }: { patient: PatientRecord }) {
  return (
    <div>
      {/* Banner */}
      <div
        style={{
          padding: "12px 16px",
          backgroundColor: "#F0FFF4",
          borderLeft: "4px solid #276749",
          borderRadius: "6px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#276749" strokeWidth={2.5} style={{ flexShrink: 0 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#276749" }}>
            Patient Recognized
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: "#276749", opacity: 0.8 }}>
            Record found for {patient.phone}
          </p>
        </div>
      </div>

      {/* Patient Card */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)",
          border: "1px solid #E2E8F0",
          borderLeft: "4px solid #2B6CB0",
          overflow: "hidden",
        }}
      >
        {/* Card Header */}
        <div style={{ padding: "24px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "9999px",
              backgroundColor: "#EBF8FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: 700,
              color: "#2B6CB0",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              flexShrink: 0,
            }}
          >
            {patient.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "22px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              {patient.name}
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#718096" }}>{patient.phone} · DOB {patient.dob}</p>
          </div>
          <span
            style={{
              marginLeft: "auto",
              backgroundColor: "#F0FFF4",
              color: "#276749",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              padding: "4px 10px",
              borderRadius: "6px",
              whiteSpace: "nowrap",
            }}
          >
            Returning Patient
          </span>
        </div>

        {/* Card Details */}
        <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <InfoItem
            icon={
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#2B6CB0" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            label="Last Visit"
            value={patient.lastVisit}
          />
          <InfoItem
            icon={
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#2B6CB0" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Next Appointment"
            value={patient.nextAppointment}
          />
          <InfoItem
            icon={
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#2B6CB0" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            label="Insurance Provider"
            value={patient.insurance}
          />
        </div>
      </div>
    </div>
  );
}

function UnknownPatientCard({ phone }: { phone: string }) {
  return (
    <div>
      {/* Banner */}
      <div
        style={{
          padding: "12px 16px",
          backgroundColor: "#FFFBEB",
          borderLeft: "4px solid #B7791F",
          borderRadius: "6px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#B7791F" strokeWidth={2.5} style={{ flexShrink: 0 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#B7791F" }}>
            Unknown Patient
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: "#B7791F", opacity: 0.8 }}>
            No record found for {phone}
          </p>
        </div>
      </div>

      {/* New Patient Intake Card */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)",
          border: "1px solid #E2E8F0",
          padding: "24px",
        }}
      >
        <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          New Patient Intake
        </h3>
        <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#718096", lineHeight: 1.6 }}>
          This caller is not in the system. Collect their information to create a new patient record.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <FormField label="Full Name" placeholder="e.g. Maria Garcia" />
          <FormField label="Date of Birth" placeholder="MM/DD/YYYY" />
          <FormField label="Insurance Provider" placeholder="e.g. Blue Cross Blue Shield" />
          <FormField label="Email Address" placeholder="e.g. patient@email.com" />
        </div>

        <div style={{ marginTop: "24px", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 600,
              backgroundColor: "transparent",
              color: "#2B6CB0",
              border: "1px solid #2B6CB0",
              borderRadius: "10px",
              cursor: "pointer",
              minHeight: "44px",
            }}
          >
            Skip
          </button>
          <button
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 600,
              backgroundColor: "#2B6CB0",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              minHeight: "44px",
            }}
          >
            Create Patient Record
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          backgroundColor: "#EBF8FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#A0AEC0" }}>
          {label}
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "14px", fontWeight: 500, color: "#2D3748" }}>{value}</p>
      </div>
    </div>
  );
}

function FormField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#4A5568", marginBottom: "6px" }}>
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 14px",
          fontSize: "16px",
          border: "1px solid #CBD5E0",
          borderRadius: "10px",
          outline: "none",
          fontFamily: "Inter, sans-serif",
          color: "#2D3748",
          backgroundColor: "#FFFFFF",
          boxSizing: "border-box",
        }}
        onFocus={(e) => { e.target.style.borderColor = "#2B6CB0"; e.target.style.boxShadow = "0 0 0 3px rgba(43,108,176,0.35)"; }}
        onBlur={(e) => { e.target.style.borderColor = "#CBD5E0"; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}
