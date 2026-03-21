"use client";

import { useState } from "react";

interface ActiveAlert {
  callerName: string;
  phoneNumber: string;
  triggerKeyword: string;
  callDuration: string;
}

interface EscalationEvent {
  id: number;
  callerName: string;
  phoneNumber: string;
  triggerKeyword: string;
  timestamp: string;
  resolution: string;
  resolvedBy: string;
}

const activeAlert: ActiveAlert = {
  callerName: "Thomas Whitfield",
  phoneNumber: "(555) 738-4291",
  triggerKeyword: "chest pain",
  callDuration: "2m 14s",
};

const recentEscalations: EscalationEvent[] = [
  {
    id: 1,
    callerName: "Sandra Okafor",
    phoneNumber: "(555) 612-9034",
    triggerKeyword: "can't breathe",
    timestamp: "Mar 18, 11:42 AM",
    resolution: "Transferred to on-call physician",
    resolvedBy: "Dr. Patel",
  },
  {
    id: 2,
    callerName: "Marcus Holloway",
    phoneNumber: "(555) 480-2175",
    triggerKeyword: "suicidal",
    timestamp: "Mar 18, 10:07 AM",
    resolution: "Crisis line connected, staff notified",
    resolvedBy: "Front Desk – Lisa",
  },
  {
    id: 3,
    callerName: "Yuki Tanaka",
    phoneNumber: "(555) 209-6843",
    triggerKeyword: "severe bleeding",
    timestamp: "Mar 17, 3:55 PM",
    resolution: "Dismissed — post-procedure normal spotting",
    resolvedBy: "Nurse Ramirez",
  },
  {
    id: 4,
    callerName: "Earl Simmons",
    phoneNumber: "(555) 877-3360",
    triggerKeyword: "passed out",
    timestamp: "Mar 17, 1:20 PM",
    resolution: "911 advised, emergency transfer completed",
    resolvedBy: "Dr. Nguyen",
  },
  {
    id: 5,
    callerName: "Priya Mehta",
    phoneNumber: "(555) 341-9027",
    triggerKeyword: "allergic reaction",
    timestamp: "Mar 16, 9:33 AM",
    resolution: "Dismissed — mild reaction, no intervention needed",
    resolvedBy: "Nurse Kim",
  },
];

export default function EmergencyEscalationPage() {
  const [dismissed, setDismissed] = useState(false);
  const [transferred, setTransferred] = useState(false);

  const alertActive = !dismissed && !transferred;

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#F7FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#2D3748", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: 600, fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0 }}>
          VoiceAI Dashboard
        </h1>
        <span style={{ backgroundColor: "#C53030", color: "#FFFFFF", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", padding: "4px 10px", borderRadius: "6px" }}>
          Emergency Mode
        </span>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px" }}>

        {/* Page title */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0, lineHeight: 1.25 }}>
            Emergency Escalation
          </h2>
          <p style={{ fontSize: "14px", color: "#718096", marginTop: "8px" }}>
            AI-detected emergency keywords trigger immediate human escalation
          </p>
        </div>

        {/* Active Alert Banner */}
        {alertActive && (
          <div
            role="alert"
            aria-live="assertive"
            style={{
              backgroundColor: "rgba(197,48,48,0.08)",
              border: "2px solid #C53030",
              borderLeft: "6px solid #C53030",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "32px",
              boxShadow: "0 8px 24px rgba(197,48,48,0.15), 0 16px 48px rgba(197,48,48,0.08)",
            }}
          >
            {/* Alert header */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "20px" }}>
              {/* Pulsing icon */}
              <div style={{
                flexShrink: 0,
                width: "48px", height: "48px",
                borderRadius: "50%",
                backgroundColor: "#C53030",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "22px",
                animation: "pulse 1.5s ease-in-out infinite",
              }}>
                🚨
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em",
                    color: "#C53030", backgroundColor: "rgba(197,48,48,0.12)", padding: "3px 10px", borderRadius: "6px",
                  }}>
                    Urgent — Immediate Action Required
                  </span>
                </div>
                <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: "8px 0 4px 0" }}>
                  Emergency Keyword Detected on Active Call
                </h3>
                <p style={{ fontSize: "14px", color: "#718096", margin: 0 }}>
                  The AI has flagged this call and paused automated handling. Human intervention required.
                </p>
              </div>
            </div>

            {/* Caller details grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "16px",
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              padding: "16px 20px",
              marginBottom: "20px",
              border: "1px solid rgba(197,48,48,0.2)",
            }}>
              <DetailField label="Caller Name" value={activeAlert.callerName} valueColor="#1A202C" bold />
              <DetailField label="Phone Number" value={activeAlert.phoneNumber} valueColor="#1A202C" />
              <DetailField
                label="Trigger Keyword"
                value={`"${activeAlert.triggerKeyword}"`}
                valueColor="#C53030"
                bold
              />
              <DetailField label="Call Duration" value={activeAlert.callDuration} valueColor="#1A202C" />
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={() => setTransferred(true)}
                style={{
                  height: "44px",
                  padding: "0 24px",
                  backgroundColor: "#C53030",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  letterSpacing: "0.01em",
                  boxShadow: "0 2px 4px rgba(197,48,48,0.3)",
                  transition: "background-color 150ms",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#9B2C2C"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C53030"; }}
              >
                📞 Transfer Call Now
              </button>
              <button
                onClick={() => setDismissed(true)}
                style={{
                  height: "44px",
                  padding: "0 24px",
                  backgroundColor: "transparent",
                  color: "#4A5568",
                  border: "1px solid #CBD5E0",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "background-color 150ms, border-color 150ms",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#EDF2F7"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#A0AEC0"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#CBD5E0"; }}
              >
                ✕ Dismiss (Not Emergency)
              </button>
            </div>
          </div>
        )}

        {/* Resolved state */}
        {(dismissed || transferred) && (
          <div style={{
            backgroundColor: "rgba(39,103,73,0.08)",
            border: "1px solid #276749",
            borderLeft: "4px solid #276749",
            borderRadius: "10px",
            padding: "16px",
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}>
            <span style={{ fontSize: "20px" }}>✓</span>
            <div>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#276749" }}>
                {transferred ? "Call transferred successfully." : "Alert dismissed — marked as non-emergency."}
              </span>
              <p style={{ fontSize: "12px", color: "#718096", margin: "2px 0 0 0" }}>
                This event has been logged in the escalation history below.
              </p>
            </div>
            <button
              onClick={() => { setDismissed(false); setTransferred(false); }}
              style={{ marginLeft: "auto", background: "none", border: "none", fontSize: "12px", color: "#2B6CB0", cursor: "pointer", fontWeight: 600 }}
            >
              Reset Demo
            </button>
          </div>
        )}

        {/* Recent escalations list */}
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: "0 0 16px 0" }}>
            Recent Escalation Events
          </h3>

          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}>
            {recentEscalations.map((event, idx) => (
              <div
                key={event.id}
                style={{
                  padding: "16px 24px",
                  borderBottom: idx < recentEscalations.length - 1 ? "1px solid #E2E8F0" : "none",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                {/* Left icon */}
                <div style={{
                  flexShrink: 0,
                  width: "36px", height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(197,48,48,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px",
                  marginTop: "2px",
                }}>
                  ⚠️
                </div>

                {/* Main content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#1A202C" }}>{event.callerName}</span>
                    <span style={{ fontSize: "12px", color: "#A0AEC0" }}>{event.phoneNumber}</span>
                    <span style={{
                      fontSize: "11px", fontWeight: 600, color: "#C53030",
                      backgroundColor: "rgba(197,48,48,0.08)", padding: "2px 8px", borderRadius: "6px",
                      textTransform: "uppercase", letterSpacing: "0.05em",
                    }}>
                      "{event.triggerKeyword}"
                    </span>
                  </div>
                  <p style={{ fontSize: "14px", color: "#4A5568", margin: "0 0 4px 0" }}>
                    {event.resolution}
                  </p>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "12px", color: "#A0AEC0" }}>{event.timestamp}</span>
                    <span style={{ fontSize: "12px", color: "#718096" }}>Resolved by: <strong>{event.resolvedBy}</strong></span>
                  </div>
                </div>

                {/* Resolution badge */}
                <span style={{
                  flexShrink: 0,
                  fontSize: "11px", fontWeight: 600,
                  backgroundColor: event.resolution.startsWith("Dismissed") ? "#F7FAFC" : "#F0FFF4",
                  color: event.resolution.startsWith("Dismissed") ? "#718096" : "#276749",
                  padding: "4px 10px", borderRadius: "6px",
                  textTransform: "uppercase", letterSpacing: "0.05em",
                  alignSelf: "center",
                }}>
                  {event.resolution.startsWith("Dismissed") ? "Dismissed" : "Escalated"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
      `}</style>
    </main>
  );
}

function DetailField({ label, value, valueColor, bold }: { label: string; value: string; valueColor: string; bold?: boolean }) {
  return (
    <div>
      <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#A0AEC0", display: "block", marginBottom: "4px" }}>
        {label}
      </span>
      <span style={{ fontSize: "16px", fontWeight: bold ? 700 : 500, color: valueColor }}>
        {value}
      </span>
    </div>
  );
}
