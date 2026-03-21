"use client";

import { useState, useEffect, useRef } from "react";

const MOCK_LEADS = [
  { name: "Sarah Johnson", phone: "(555) 248-1937", source: "Google Ads", timestamp: "Just now" },
  { name: "Marcus Rivera", phone: "(555) 391-7204", source: "Meta", timestamp: "Just now" },
  { name: "Emily Chen", phone: "(555) 472-6815", source: "Google Ads", timestamp: "Just now" },
];

const TOTAL_SECONDS = 8;

export default function LeadResponseSimulation() {
  const [leadIndex, setLeadIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState<"idle" | "counting" | "done">("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const lead = MOCK_LEADS[leadIndex % MOCK_LEADS.length];

  function startSimulation() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setElapsed(0);
    setPhase("counting");
  }

  useEffect(() => {
    if (phase === "counting") {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev >= TOTAL_SECONDS) {
            clearInterval(intervalRef.current!);
            setPhase("done");
            return TOTAL_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase]);

  function handleSimulateNew() {
    setLeadIndex((i) => i + 1);
    setPhase("idle");
    setElapsed(0);
    setTimeout(() => startSimulation(), 50);
  }

  const progress = elapsed / TOTAL_SECONDS;
  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference * (1 - progress);

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)",
        border: "1px solid #E2E8F0",
        overflow: "hidden",
        marginTop: "32px",
      }}
    >
      {/* Header */}
      <div style={{ padding: "24px 32px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0 }}>
            Lead Response Demo
          </h3>
          <p style={{ fontSize: "14px", color: "#718096", margin: "4px 0 0" }}>
            Watch a new lead trigger an outbound call in under 10 seconds
          </p>
        </div>
        <span style={{ backgroundColor: "#EBF8FF", color: "#2B6CB0", fontSize: "11px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em", padding: "4px 10px", borderRadius: "6px" }}>
          Demo
        </span>
      </div>

      <div style={{ padding: "32px", display: "flex", flexDirection: "column" as const, gap: "24px" }}>
        {/* Incoming Lead Card */}
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          {/* Step indicator */}
          <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "4px", flexShrink: 0 }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9999px", backgroundColor: "#EBF8FF", border: "2px solid #2B6CB0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#2B6CB0" }}>
              1
            </div>
            {phase !== "idle" && (
              <div style={{ width: "2px", height: "48px", backgroundColor: phase === "done" ? "#2B6CB0" : "#CBD5E0" }} />
            )}
          </div>
          {/* Lead details card */}
          <div style={{ flex: 1, backgroundColor: "#F7FAFC", borderRadius: "10px", border: "1px solid #E2E8F0", padding: "16px", borderLeft: "4px solid #2B6CB0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em", color: "#718096" }}>
                Incoming Lead — Webhook
              </span>
              <span style={{ fontSize: "12px", color: "#A0AEC0" }}>{lead.timestamp}</span>
            </div>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#1A202C" }}>{lead.name}</p>
            <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#4A5568" }}>{lead.phone}</p>
            <div style={{ marginTop: "8px" }}>
              <span style={{
                fontSize: "11px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em",
                padding: "3px 8px", borderRadius: "6px",
                backgroundColor: lead.source === "Google Ads" ? "#EBF8FF" : "#FAF5FF",
                color: lead.source === "Google Ads" ? "#2B6CB0" : "#6B46C1",
              }}>
                {lead.source}
              </span>
            </div>
          </div>
        </div>

        {/* Countdown / Call initiated */}
        {phase !== "idle" && (
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", flexShrink: 0 }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "9999px", backgroundColor: phase === "done" ? "#F0FFF4" : "#EBF8FF", border: `2px solid ${phase === "done" ? "#276749" : "#2B6CB0"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: phase === "done" ? "#276749" : "#2B6CB0" }}>
                2
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {phase === "counting" && (
                <div style={{ backgroundColor: "#F7FAFC", borderRadius: "10px", border: "1px solid #E2E8F0", padding: "16px", display: "flex", alignItems: "center", gap: "16px" }}>
                  {/* Circular timer */}
                  <div style={{ position: "relative" as const, width: "80px", height: "80px", flexShrink: 0 }}>
                    <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="40" cy="40" r="36" fill="none" stroke="#E2E8F0" strokeWidth="6" />
                      <circle
                        cx="40" cy="40" r="36" fill="none"
                        stroke="#2B6CB0" strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        style={{ transition: "stroke-dashoffset 0.8s ease" }}
                      />
                    </svg>
                    <div style={{ position: "absolute" as const, inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" as const }}>
                      <span style={{ fontSize: "22px", fontWeight: 700, color: "#1A202C", lineHeight: 1, fontFamily: "Plus Jakarta Sans, sans-serif" }}>{elapsed}</span>
                      <span style={{ fontSize: "11px", color: "#718096", fontWeight: 600 }}>sec</span>
                    </div>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#2D3748" }}>Triggering outbound call…</p>
                    <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#718096" }}>Response target: &lt; 10 seconds</p>
                  </div>
                </div>
              )}

              {phase === "done" && (
                <div style={{ backgroundColor: "#F0FFF4", borderRadius: "10px", border: "1px solid #C6F6D5", padding: "16px", borderLeft: "4px solid #276749" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#276749" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#276749" }}>Call Initiated</span>
                    <span style={{ fontSize: "11px", fontWeight: 600, backgroundColor: "#276749", color: "#FFFFFF", padding: "2px 8px", borderRadius: "6px", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
                      {elapsed}s Response
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "14px", color: "#2D3748", fontWeight: 600 }}>Calling {lead.phone}</p>
                  <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#718096" }}>AI agent dialing {lead.name} · Source: {lead.source}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Controls */}
        <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
          {phase === "idle" && (
            <button
              onClick={startSimulation}
              style={{ height: "44px", padding: "0 24px", backgroundColor: "#2B6CB0", color: "#FFFFFF", borderRadius: "10px", border: "none", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
            >
              Start Demo
            </button>
          )}
          {phase !== "idle" && (
            <button
              onClick={handleSimulateNew}
              style={{ height: "44px", padding: "0 24px", backgroundColor: "#2B6CB0", color: "#FFFFFF", borderRadius: "10px", border: "none", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
            >
              Simulate New Lead
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
