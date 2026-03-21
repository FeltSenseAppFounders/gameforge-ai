"use client";

import { useState, useEffect } from "react";

const SMS_CONTENT = {
  en: {
    greeting: "Hi Jane,",
    body: "Your appointment has been confirmed at Bright Smile Dental.\n\n📅 Date: Thursday, Mar 20, 2026\n🕙 Time: 10:00 AM\n👨‍⚕️ Provider: Dr. Patel\n📍 123 Main St, Suite 200\n\nReply YES to confirm or CANCEL to cancel.\nQuestions? Call (555) 800-1234.",
    footer: "Bright Smile Dental · Reply STOP to opt out",
  },
  es: {
    greeting: "Hola Jane,",
    body: "Su cita ha sido confirmada en Bright Smile Dental.\n\n📅 Fecha: Jueves, 20 de mar, 2026\n🕙 Hora: 10:00 AM\n👨‍⚕️ Médico: Dr. Patel\n📍 123 Main St, Suite 200\n\nResponda SÍ para confirmar o CANCELAR para cancelar.\n¿Preguntas? Llame al (555) 800-1234.",
    footer: "Bright Smile Dental · Responda STOP para cancelar",
  },
};

type SmsStatus = "queued" | "sending" | "delivered";

export default function SmsHandoffWidget() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [smsStatus, setSmsStatus] = useState<SmsStatus>("queued");
  const [deliveredAt, setDeliveredAt] = useState<string | null>(null);

  useEffect(() => {
    // Simulate 2-second delay to delivered state
    const t1 = setTimeout(() => setSmsStatus("sending"), 800);
    const t2 = setTimeout(() => {
      setSmsStatus("delivered");
      setDeliveredAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const sms = SMS_CONTENT[lang];

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)",
        border: "1px solid #E2E8F0",
        marginBottom: "32px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "24px 32px",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#EBF8FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#2B6CB0" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#1A202C",
                fontFamily: "Plus Jakarta Sans, sans-serif",
                margin: 0,
              }}
            >
              SMS / Multi-Channel Handoff
            </h3>
            <p style={{ fontSize: "14px", color: "#718096", margin: "2px 0 0" }}>
              Post-call follow-up · Demo data
            </p>
          </div>
        </div>

        {/* Language toggle */}
        <div
          style={{
            display: "flex",
            borderRadius: "10px",
            border: "1px solid #E2E8F0",
            overflow: "hidden",
          }}
        >
          {(["en", "es"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                backgroundColor: lang === l ? "#2B6CB0" : "#FFFFFF",
                color: lang === l ? "#FFFFFF" : "#4A5568",
                transition: "background-color 150ms, color 150ms",
              }}
            >
              {l === "en" ? "English" : "Español"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Call Summary Card */}
        <div
          style={{
            backgroundColor: "#F7FAFC",
            borderRadius: "12px",
            border: "1px solid #E2E8F0",
            borderLeft: "4px solid #2B6CB0",
            padding: "24px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "#718096",
              margin: "0 0 16px",
            }}
          >
            Call Summary
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Row label="Patient" value="Jane Smith" />
            <Row label="Phone" value="(555) 234-5678" />
            <Row label="Duration" value="4m 12s" />
            <Row label="Call Time" value="Today, 9:02 AM" />
            <Row
              label="Outcome"
              value={
                <span
                  style={{
                    backgroundColor: "#F0FFF4",
                    color: "#276749",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    padding: "4px 10px",
                    borderRadius: "6px",
                  }}
                >
                  Appointment Booked
                </span>
              }
            />
          </div>

          {/* SMS Status */}
          <div
            style={{
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <StatusIcon status={smsStatus} />
            <div>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#2D3748" }}>
                {smsStatus === "queued" && "SMS Queued"}
                {smsStatus === "sending" && "Sending SMS…"}
                {smsStatus === "delivered" && "SMS Delivered"}
              </p>
              {deliveredAt && (
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#718096" }}>
                  Delivered at {deliveredAt}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SMS Preview */}
        <div
          style={{
            backgroundColor: "#F7FAFC",
            borderRadius: "12px",
            border: "1px solid #E2E8F0",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#718096",
                margin: 0,
              }}
            >
              SMS Preview
            </p>
            <span
              style={{
                backgroundColor: "#EBF8FF",
                color: "#2B6CB0",
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                padding: "4px 10px",
                borderRadius: "6px",
              }}
            >
              {lang === "en" ? "English" : "Español"}
            </span>
          </div>

          {/* Phone frame */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              border: "1px solid #E2E8F0",
              padding: "16px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04)",
            }}
          >
            {/* From line */}
            <p
              style={{
                fontSize: "12px",
                color: "#A0AEC0",
                margin: "0 0 12px",
                fontWeight: 600,
              }}
            >
              From: Bright Smile Dental · (555) 800-1234
            </p>

            {/* Bubble */}
            <div
              style={{
                backgroundColor: "#EDF2F7",
                borderRadius: "10px 10px 10px 2px",
                padding: "12px 16px",
                fontSize: "14px",
                color: "#2D3748",
                lineHeight: 1.6,
                whiteSpace: "pre-line",
              }}
            >
              <strong>{sms.greeting}</strong>
              {"\n"}
              {sms.body}
            </div>

            <p
              style={{
                fontSize: "11px",
                color: "#A0AEC0",
                margin: "12px 0 0",
                lineHeight: 1.5,
              }}
            >
              {sms.footer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
      <span style={{ fontSize: "12px", color: "#718096", fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: "14px", color: "#2D3748" }}>{value}</span>
    </div>
  );
}

function StatusIcon({ status }: { status: SmsStatus }) {
  if (status === "delivered") {
    return (
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "9999px",
          backgroundColor: "#F0FFF4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#276749" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (status === "sending") {
    return (
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "9999px",
          backgroundColor: "#EBF8FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2B6CB0"
          strokeWidth={2}
          style={{ animation: "spin 1s linear infinite" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z" />
        </svg>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  // queued
  return (
    <div
      style={{
        width: "32px",
        height: "32px",
        borderRadius: "9999px",
        backgroundColor: "#FFFBEB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#B7791F" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  );
}
