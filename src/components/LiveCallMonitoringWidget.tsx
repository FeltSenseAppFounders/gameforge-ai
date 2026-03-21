"use client";

import { useState, useEffect } from "react";

interface ActiveCall {
  id: string;
  callerName: string;
  callerNumber: string;
  startedAt: number; // timestamp in ms
  aiAction: string;
  confidenceScore: number;
}

const MOCK_CALLS: ActiveCall[] = [
  {
    id: "1",
    callerName: "Sarah Johnson",
    callerNumber: "(555) 234-7891",
    startedAt: Date.now() - 127000,
    aiAction: "Scheduling appointment",
    confidenceScore: 94,
  },
  {
    id: "2",
    callerName: "Marcus Webb",
    callerNumber: "(555) 109-3342",
    startedAt: Date.now() - 43000,
    aiAction: "Verifying insurance",
    confidenceScore: 88,
  },
  {
    id: "3",
    callerName: "Unknown Caller",
    callerNumber: "(555) 876-0012",
    startedAt: Date.now() - 9000,
    aiAction: "Greeting & triage",
    confidenceScore: 72,
  },
];

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function confidenceColor(score: number): string {
  if (score >= 85) return "#276749";
  if (score >= 65) return "#B7791F";
  return "#C53030";
}

function confidenceBg(score: number): string {
  if (score >= 85) return "#F0FFF4";
  if (score >= 65) return "#FFFBEB";
  return "#FFF5F5";
}

export default function LiveCallMonitoringWidget() {
  const [now, setNow] = useState(Date.now());
  const [calls] = useState<ActiveCall[]>(MOCK_CALLS);
  const [takeOverCall, setTakeOverCall] = useState<ActiveCall | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  function handleConfirm() {
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setTakeOverCall(null);
    }, 1500);
  }

  return (
    <>
      {/* Card */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          marginBottom: "32px",
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
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#1A202C",
                fontFamily: "Plus Jakarta Sans, sans-serif",
                margin: 0,
              }}
            >
              Live Call Monitoring
            </h3>
            {/* Pulsing live indicator */}
            {calls.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    borderRadius: "9999px",
                    backgroundColor: "#C53030",
                    animation: "pulse-dot 1.4s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.06em",
                    color: "#C53030",
                  }}
                >
                  Live
                </span>
              </div>
            )}
          </div>

          {/* Active calls count badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase" as const,
                letterSpacing: "0.06em",
                color: "#718096",
              }}
            >
              Active Calls Now:
            </span>
            <span
              style={{
                backgroundColor: calls.length > 0 ? "#EBF8FF" : "#F7FAFC",
                color: calls.length > 0 ? "#2B6CB0" : "#A0AEC0",
                fontSize: "14px",
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: "6px",
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}
            >
              {calls.length}
            </span>
          </div>
        </div>

        {/* Body */}
        {calls.length === 0 ? (
          /* Empty state */
          <div
            style={{
              padding: "48px 32px",
              textAlign: "center" as const,
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "9999px",
                backgroundColor: "#EDF2F7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#A0AEC0" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#4A5568", margin: 0 }}>
              No active calls right now
            </p>
            <p style={{ fontSize: "14px", color: "#A0AEC0", margin: 0 }}>
              Incoming calls will appear here in real time. You&apos;re all clear!
            </p>
          </div>
        ) : (
          /* Call rows */
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {calls.map((call, idx) => {
              const elapsed = now - call.startedAt;
              const confColor = confidenceColor(call.confidenceScore);
              const confBg = confidenceBg(call.confidenceScore);
              return (
                <li
                  key={call.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "16px 32px",
                    backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#F7FAFC",
                    borderBottom: idx < calls.length - 1 ? "1px solid #E2E8F0" : "none",
                    flexWrap: "wrap" as const,
                  }}
                >
                  {/* Active call dot */}
                  <span
                    style={{
                      display: "inline-block",
                      width: "8px",
                      height: "8px",
                      borderRadius: "9999px",
                      backgroundColor: "#2B6CB0",
                      flexShrink: 0,
                      animation: "pulse-dot 1.4s ease-in-out infinite",
                    }}
                  />

                  {/* Caller info */}
                  <div style={{ minWidth: "160px", flex: "1 1 160px" }}>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#2D3748" }}>
                      {call.callerName}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#718096" }}>
                      {call.callerNumber}
                    </p>
                  </div>

                  {/* Duration */}
                  <div style={{ minWidth: "64px", textAlign: "center" as const }}>
                    <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em", color: "#A0AEC0" }}>
                      Duration
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "14px", fontWeight: 600, color: "#2D3748", fontFamily: "monospace" }}>
                      {formatDuration(elapsed)}
                    </p>
                  </div>

                  {/* AI action */}
                  <div style={{ minWidth: "160px", flex: "1 1 160px" }}>
                    <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em", color: "#A0AEC0" }}>
                      AI Action
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "14px", color: "#2D3748" }}>
                      {call.aiAction}
                    </p>
                  </div>

                  {/* Confidence score */}
                  <div
                    style={{
                      backgroundColor: confBg,
                      color: confColor,
                      fontSize: "13px",
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: "6px",
                      minWidth: "64px",
                      textAlign: "center" as const,
                      flexShrink: 0,
                    }}
                  >
                    {call.confidenceScore}% conf.
                  </div>

                  {/* Take Over button */}
                  <button
                    onClick={() => setTakeOverCall(call)}
                    style={{
                      backgroundColor: "#2B6CB0",
                      color: "#FFFFFF",
                      fontSize: "14px",
                      fontWeight: 600,
                      padding: "10px 20px",
                      borderRadius: "10px",
                      border: "none",
                      cursor: "pointer",
                      minHeight: "44px",
                      flexShrink: 0,
                      transition: "background-color 150ms ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1A4C8A")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2B6CB0")}
                  >
                    Take Over
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Modal */}
      {takeOverCall && (
        <div
          style={{
            position: "fixed" as const,
            inset: 0,
            backgroundColor: "rgba(26,32,44,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setTakeOverCall(null)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.10), 0 32px 64px rgba(0,0,0,0.07)",
              maxWidth: "480px",
              width: "90%",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ padding: "24px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h4 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                Take Over Call
              </h4>
              <button
                onClick={() => setTakeOverCall(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#718096", fontSize: "20px", lineHeight: 1, padding: "4px" }}
              >
                ×
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: "24px" }}>
              {confirmed ? (
                <div style={{ textAlign: "center" as const, padding: "16px 0" }}>
                  <p style={{ fontSize: "16px", fontWeight: 600, color: "#276749", margin: 0 }}>
                    Connecting you to the call...
                  </p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: "14px", color: "#4A5568", margin: "0 0 16px" }}>
                    You are about to take over the active call with{" "}
                    <strong>{takeOverCall.callerName}</strong> ({takeOverCall.callerNumber}).
                    The AI agent will be paused and you will speak directly to the caller.
                  </p>
                  <div
                    style={{
                      backgroundColor: "#FFFBEB",
                      borderLeft: "4px solid #B7791F",
                      borderRadius: "6px",
                      padding: "12px 16px",
                      marginBottom: "8px",
                    }}
                  >
                    <p style={{ fontSize: "13px", color: "#B7791F", fontWeight: 600, margin: 0 }}>
                      Note: This is a demo — no actual call will be connected.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Modal footer */}
            {!confirmed && (
              <div style={{ padding: "16px 24px", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  onClick={() => setTakeOverCall(null)}
                  style={{
                    backgroundColor: "transparent",
                    color: "#2B6CB0",
                    border: "1px solid #2B6CB0",
                    fontSize: "14px",
                    fontWeight: 600,
                    padding: "10px 20px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    minHeight: "44px",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  style={{
                    backgroundColor: "#B7791F",
                    color: "#FFFFFF",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: 600,
                    padding: "10px 20px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    minHeight: "44px",
                  }}
                >
                  Confirm Take Over
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Keyframes for pulsing dot */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </>
  );
}
