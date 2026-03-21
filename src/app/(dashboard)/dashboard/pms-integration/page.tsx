"use client";

import { useState } from "react";

// --- Sync Activity Log ---

type SyncStatus = "success" | "error" | "partial";
type SyncDirection = "Push" | "Pull";

interface SyncEvent {
  id: string;
  timestamp: string;
  direction: SyncDirection;
  dataType: string;
  recordCount: number;
  status: SyncStatus;
  errorMessage?: string;
}

const syncStatusStyle: Record<SyncStatus, { bg: string; text: string }> = {
  success: { bg: "#F0FFF4", text: "#276749" },
  error: { bg: "#FFF5F5", text: "#C53030" },
  partial: { bg: "#FFFBEB", text: "#B7791F" },
};

const initialSyncEvents: SyncEvent[] = [
  { id: "1", timestamp: "Mar 17, 2026 9:14 AM", direction: "Pull", dataType: "Appointments", recordCount: 42, status: "success" },
  { id: "2", timestamp: "Mar 17, 2026 9:00 AM", direction: "Push", dataType: "Patient Records", recordCount: 15, status: "partial", errorMessage: "3 records failed to sync: missing required field 'date_of_birth' on patient IDs 1021, 1034, 1089." },
  { id: "3", timestamp: "Mar 17, 2026 8:45 AM", direction: "Pull", dataType: "Insurance Info", recordCount: 28, status: "success" },
  { id: "4", timestamp: "Mar 17, 2026 8:30 AM", direction: "Push", dataType: "Treatment Plans", recordCount: 0, status: "error", errorMessage: "Connection timed out after 30s. Dentrix API endpoint /v2/treatment-plans returned HTTP 504 Gateway Timeout." },
  { id: "5", timestamp: "Mar 17, 2026 8:15 AM", direction: "Pull", dataType: "Patient Records", recordCount: 87, status: "success" },
  { id: "6", timestamp: "Mar 17, 2026 8:00 AM", direction: "Push", dataType: "Appointments", recordCount: 11, status: "success" },
  { id: "7", timestamp: "Mar 17, 2026 7:45 AM", direction: "Pull", dataType: "Billing Data", recordCount: 33, status: "partial", errorMessage: "5 billing records skipped: insurance codes [D0150, D2391] not recognized by the local mapping table." },
  { id: "8", timestamp: "Mar 17, 2026 7:30 AM", direction: "Push", dataType: "Patient Records", recordCount: 22, status: "success" },
  { id: "9", timestamp: "Mar 17, 2026 7:15 AM", direction: "Pull", dataType: "Appointments", recordCount: 19, status: "success" },
  { id: "10", timestamp: "Mar 17, 2026 7:00 AM", direction: "Push", dataType: "Insurance Info", recordCount: 0, status: "error", errorMessage: "Authentication failed. API key has expired. Please rotate credentials in the Configure panel and retry." },
];

const DATA_TYPES = ["Appointments", "Patient Records", "Insurance Info", "Treatment Plans", "Billing Data"];

function getRandomStatus(): SyncStatus {
  const r = Math.random();
  if (r < 0.7) return "success";
  if (r < 0.85) return "partial";
  return "error";
}

function SyncActivityLog() {
  const [events, setEvents] = useState<SyncEvent[]>(initialSyncEvents);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [syncing, setSyncing] = useState(false);

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSyncNow() {
    if (syncing) return;
    setSyncing(true);
    setTimeout(() => {
      const status = getRandomStatus();
      const direction: SyncDirection = Math.random() > 0.5 ? "Push" : "Pull";
      const dataType = DATA_TYPES[Math.floor(Math.random() * DATA_TYPES.length)];
      const recordCount = status === "error" ? 0 : Math.floor(Math.random() * 80) + 5;
      const newEvent: SyncEvent = {
        id: Date.now().toString(),
        timestamp: "Mar 17, 2026 " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        direction,
        dataType,
        recordCount,
        status,
        errorMessage: status === "error"
          ? "Sync failed: remote server returned HTTP 503. Please check PMS connectivity and retry."
          : status === "partial"
          ? `${Math.floor(recordCount * 0.15) + 1} records could not be written due to validation errors.`
          : undefined,
      };
      setEvents((prev) => [newEvent, ...prev]);
      setSyncing(false);
    }, 2000);
  }

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04)",
        border: "1px solid #E2E8F0",
        marginTop: "32px",
        overflow: "hidden",
      }}
    >
      {/* Card header */}
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
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 600,
              color: "#1A202C",
              fontFamily: "Plus Jakarta Sans, sans-serif",
            }}
          >
            Sync Activity Log
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#718096", fontFamily: "Inter, sans-serif" }}>
            Recent bidirectional sync events with connected PMS.
          </p>
        </div>
        <button
          onClick={handleSyncNow}
          disabled={syncing}
          style={{
            padding: "12px 24px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: syncing ? "#CBD5E0" : "#2B6CB0",
            color: syncing ? "#A0AEC0" : "#FFFFFF",
            fontSize: "14px",
            fontWeight: 600,
            cursor: syncing ? "not-allowed" : "pointer",
            fontFamily: "Inter, sans-serif",
            minHeight: "44px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          {syncing && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 1s linear infinite" }}>
              <circle cx="8" cy="8" r="6" stroke="#A0AEC0" strokeWidth="2" />
              <path d="M8 2a6 6 0 016 6" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
          {syncing ? "Syncing..." : "Sync Now"}
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Inter, sans-serif" }}>
          <thead>
            <tr style={{ backgroundColor: "#F7FAFC" }}>
              {["Timestamp", "Direction", "Data Type", "Record Count", "Status", ""].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 16px",
                    textAlign: h === "Record Count" ? "right" : "left",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#4A5568",
                    borderBottom: "1px solid #E2E8F0",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => {
              const ss = syncStatusStyle[ev.status];
              const isExpanded = expandedIds.has(ev.id);
              const isExpandable = !!ev.errorMessage;
              return (
                <>
                  <tr
                    key={ev.id}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderBottom: isExpanded ? "none" : "1px solid #E2E8F0",
                      transition: "background-color 150ms",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = "#EDF2F7")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = "#FFFFFF")}
                  >
                    <td style={{ padding: "12px 16px", fontSize: "14px", color: "#2D3748", whiteSpace: "nowrap" }}>
                      {ev.timestamp}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "11px",
                          fontWeight: 600,
                          textTransform: "uppercase" as const,
                          letterSpacing: "0.05em",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          backgroundColor: ev.direction === "Push" ? "#EBF8FF" : "#F0FFF4",
                          color: ev.direction === "Push" ? "#2B6CB0" : "#276749",
                        }}
                      >
                        {ev.direction === "Push" ? "↑" : "↓"} {ev.direction}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "14px", color: "#2D3748" }}>
                      {ev.dataType}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "14px", color: "#2D3748", textAlign: "right" }}>
                      {ev.recordCount}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: "11px",
                          fontWeight: 600,
                          textTransform: "uppercase" as const,
                          letterSpacing: "0.05em",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          backgroundColor: ss.bg,
                          color: ss.text,
                        }}
                      >
                        {ev.status === "success" ? "Success" : ev.status === "error" ? "Error" : "Partial"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      {isExpandable && (
                        <button
                          onClick={() => toggleExpand(ev.id)}
                          aria-label={isExpanded ? "Collapse error" : "Expand error"}
                          style={{
                            background: "none",
                            border: "1px solid #CBD5E0",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#718096",
                            padding: "4px 10px",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          {isExpanded ? "▲ Hide" : "▼ Details"}
                        </button>
                      )}
                    </td>
                  </tr>
                  {isExpanded && ev.errorMessage && (
                    <tr key={`${ev.id}-detail`} style={{ borderBottom: "1px solid #E2E8F0" }}>
                      <td colSpan={6} style={{ padding: "0 16px 12px 16px" }}>
                        <div
                          style={{
                            padding: "12px 16px",
                            borderRadius: "10px",
                            borderLeft: "4px solid #C53030",
                            backgroundColor: "rgba(197,48,48,0.06)",
                            fontSize: "14px",
                            color: "#C53030",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          {ev.errorMessage}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type ConnectionStatus = "Connected" | "Disconnected" | "Pending";

interface PmsSystem {
  id: string;
  name: string;
  description: string;
  status: ConnectionStatus;
  lastSync: string | null;
}

const initialSystems: PmsSystem[] = [
  {
    id: "dentrix",
    name: "Dentrix",
    description: "Henry Schein's practice management software",
    status: "Connected",
    lastSync: "Mar 17, 2026 at 9:14 AM",
  },
  {
    id: "opendental",
    name: "OpenDental",
    description: "Open source dental practice software",
    status: "Disconnected",
    lastSync: null,
  },
  {
    id: "eaglesoft",
    name: "Eaglesoft",
    description: "Patterson Dental's practice management platform",
    status: "Pending",
    lastSync: null,
  },
];

const statusStyle: Record<ConnectionStatus, { bg: string; text: string; dot: string }> = {
  Connected: { bg: "#F0FFF4", text: "#276749", dot: "#276749" },
  Disconnected: { bg: "#FFF5F5", text: "#C53030", dot: "#C53030" },
  Pending: { bg: "#FFFBEB", text: "#B7791F", dot: "#B7791F" },
};

function PmsIcon({ name }: { name: string }) {
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <div
      style={{
        width: "48px",
        height: "48px",
        borderRadius: "10px",
        backgroundColor: "#EBF8FF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Plus Jakarta Sans, sans-serif",
        fontWeight: 700,
        fontSize: "16px",
        color: "#2B6CB0",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

interface ConfigPanelProps {
  system: PmsSystem;
  onClose: () => void;
  onStatusUpdate: (id: string, status: ConnectionStatus) => void;
}

function ConfigPanel({ system, onClose, onStatusUpdate }: ConfigPanelProps) {
  const [apiUrl, setApiUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [practiceId, setPracticeId] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<null | "success" | "failure">(null);

  function handleTestConnection() {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      const success = apiUrl.length > 0 && apiKey.length > 0 && practiceId.length > 0;
      setTestResult(success ? "success" : "failure");
      if (success) {
        onStatusUpdate(system.id, "Connected");
      }
      setTesting(false);
    }, 1500);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#FFFFFF",
    border: "1px solid #CBD5E0",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "16px",
    color: "#2D3748",
    fontFamily: "Inter, sans-serif",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    color: "#4A5568",
    marginBottom: "6px",
    fontFamily: "Inter, sans-serif",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(26,32,44,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          boxShadow: "0 16px 48px rgba(0,0,0,0.10), 0 32px 64px rgba(0,0,0,0.07)",
          width: "100%",
          maxWidth: "560px",
          margin: "0 16px",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 600,
              color: "#1A202C",
              fontFamily: "Plus Jakarta Sans, sans-serif",
            }}
          >
            Configure {system.name}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "22px",
              color: "#718096",
              lineHeight: 1,
              padding: "4px",
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={labelStyle}>API URL</label>
            <input
              style={inputStyle}
              type="text"
              placeholder="https://api.example.com"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>API Key</label>
            <input
              style={inputStyle}
              type="password"
              placeholder="••••••••••••••••"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Practice ID</label>
            <input
              style={inputStyle}
              type="text"
              placeholder="PRAC-001"
              value={practiceId}
              onChange={(e) => setPracticeId(e.target.value)}
            />
          </div>

          {testResult && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                borderLeft: `4px solid ${testResult === "success" ? "#276749" : "#C53030"}`,
                backgroundColor: testResult === "success" ? "rgba(39,103,73,0.08)" : "rgba(197,48,48,0.08)",
                fontSize: "14px",
                fontWeight: 600,
                color: testResult === "success" ? "#276749" : "#C53030",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {testResult === "success"
                ? "Connection successful! Status updated to Connected."
                : "Connection failed. Please check your credentials and try again."}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "24px",
            borderTop: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "12px 24px",
              borderRadius: "10px",
              border: "1px solid #2B6CB0",
              backgroundColor: "transparent",
              color: "#2B6CB0",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              minHeight: "44px",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleTestConnection}
            disabled={testing}
            style={{
              padding: "12px 24px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: testing ? "#CBD5E0" : "#2B6CB0",
              color: testing ? "#A0AEC0" : "#FFFFFF",
              fontSize: "14px",
              fontWeight: 600,
              cursor: testing ? "not-allowed" : "pointer",
              fontFamily: "Inter, sans-serif",
              minHeight: "44px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {testing && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{ animation: "spin 1s linear infinite" }}
              >
                <circle cx="8" cy="8" r="6" stroke="#A0AEC0" strokeWidth="2" />
                <path d="M8 2a6 6 0 016 6" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
            {testing ? "Testing..." : "Test Connection"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PmsIntegrationPage() {
  const [systems, setSystems] = useState<PmsSystem[]>(initialSystems);
  const [configuringId, setConfiguringId] = useState<string | null>(null);

  const configuringSystem = systems.find((s) => s.id === configuringId) ?? null;

  function handleStatusUpdate(id: string, status: ConnectionStatus) {
    setSystems((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status, lastSync: status === "Connected" ? "Mar 17, 2026 at " + new Date().toLocaleTimeString() : s.lastSync }
          : s
      )
    );
  }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#F7FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#2D3748",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1
          style={{
            color: "#FFFFFF",
            fontSize: "18px",
            fontWeight: 600,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            margin: 0,
          }}
        >
          VoiceAI Dashboard
        </h1>
        <span
          style={{
            backgroundColor: "#B7791F",
            color: "#FFFFFF",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            padding: "4px 10px",
            borderRadius: "6px",
          }}
        >
          Demo Data
        </span>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px" }}>
        {/* Page title */}
        <div style={{ marginBottom: "32px" }}>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#1A202C",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              margin: 0,
              lineHeight: 1.25,
            }}
          >
            PMS Integrations
          </h2>
          <p style={{ fontSize: "14px", color: "#718096", marginTop: "8px" }}>
            Connect your practice management software to sync patient records and appointments.
          </p>
        </div>

        {/* PMS Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {systems.map((system) => {

            const s = statusStyle[system.status];
            return (
              <div
                key={system.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "16px",
                  padding: "24px 32px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04)",
                  border: "1px solid #E2E8F0",
                  borderLeft: `4px solid ${system.status === "Connected" ? "#276749" : system.status === "Pending" ? "#B7791F" : "#CBD5E0"}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <PmsIcon name={system.name} />

                <div style={{ flex: 1, minWidth: "180px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#1A202C",
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                      }}
                    >
                      {system.name}
                    </h3>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        backgroundColor: s.bg,
                        color: s.text,
                        fontSize: "11px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        padding: "4px 10px",
                        borderRadius: "6px",
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "9999px",
                          backgroundColor: s.dot,
                          flexShrink: 0,
                        }}
                      />
                      {system.status}
                    </span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#718096" }}>
                    {system.description}
                  </p>
                  {system.lastSync && (
                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#A0AEC0" }}>
                      Last sync: {system.lastSync}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setConfiguringId(system.id)}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "#2B6CB0",
                    color: "#FFFFFF",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    minHeight: "44px",
                    flexShrink: 0,
                  }}
                >
                  Configure
                </button>
              </div>
            );
          })}
        </div>

        {/* Sync Activity Log */}
        <SyncActivityLog />
      </div>

      {configuringSystem && (
        <ConfigPanel
          system={configuringSystem}
          onClose={() => setConfiguringId(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
