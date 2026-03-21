"use client";

import Link from "next/link";

type Outcome =
  | "Appointment Booked"
  | "Voicemail Left"
  | "No Answer"
  | "Declined"
  | "Callback Requested";

interface CallAttempt {
  id: number;
  patient: string;
  phone: string;
  attemptTime: string;
  duration: string;
  outcome: Outcome;
}

const mockCallAttempts: CallAttempt[] = [
  { id: 1, patient: "Sarah Johnson",   phone: "(555) 210-4821", attemptTime: "Mar 15, 2026 9:02 AM",  duration: "3m 24s", outcome: "Appointment Booked"  },
  { id: 2, patient: "Michael Torres",  phone: "(555) 384-9021", attemptTime: "Mar 15, 2026 9:18 AM",  duration: "0m 32s", outcome: "No Answer"            },
  { id: 3, patient: "Emily Chen",      phone: "(555) 472-6603", attemptTime: "Mar 15, 2026 9:35 AM",  duration: "1m 47s", outcome: "Voicemail Left"        },
  { id: 4, patient: "David Patel",     phone: "(555) 601-3347", attemptTime: "Mar 15, 2026 10:04 AM", duration: "4m 12s", outcome: "Callback Requested"    },
  { id: 5, patient: "Linda Martinez",  phone: "(555) 719-8802", attemptTime: "Mar 15, 2026 10:22 AM", duration: "2m 55s", outcome: "Appointment Booked"    },
  { id: 6, patient: "James Wilson",    phone: "(555) 835-5514", attemptTime: "Mar 15, 2026 10:48 AM", duration: "1m 03s", outcome: "Declined"               },
  { id: 7, patient: "Aisha Okafor",    phone: "(555) 923-1167", attemptTime: "Mar 15, 2026 11:10 AM", duration: "0m 47s", outcome: "No Answer"              },
  { id: 8, patient: "Robert Kim",      phone: "(555) 045-7790", attemptTime: "Mar 15, 2026 11:31 AM", duration: "3m 58s", outcome: "Appointment Booked"    },
  { id: 9, patient: "Patricia Green",  phone: "(555) 168-2243", attemptTime: "Mar 15, 2026 1:05 PM",  duration: "1m 22s", outcome: "Voicemail Left"         },
  { id: 10, patient: "Thomas Nguyen",  phone: "(555) 254-8876", attemptTime: "Mar 15, 2026 1:44 PM",  duration: "5m 08s", outcome: "Appointment Booked"    },
];

const outcomeConfig: Record<Outcome, { bg: string; text: string }> = {
  "Appointment Booked":  { bg: "#F0FFF4", text: "#276749" },
  "Voicemail Left":      { bg: "#EBF8FF", text: "#2B6CB0" },
  "No Answer":           { bg: "#F7FAFC", text: "#718096" },
  "Declined":            { bg: "#FFF5F5", text: "#C53030" },
  "Callback Requested":  { bg: "#FFFBEB", text: "#B7791F" },
};

function OutcomeBadge({ outcome }: { outcome: Outcome }) {
  const cfg = outcomeConfig[outcome];
  return (
    <span style={{
      display: "inline-block",
      backgroundColor: cfg.bg,
      color: cfg.text,
      fontSize: "11px",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      padding: "4px 10px",
      borderRadius: "6px",
      whiteSpace: "nowrap",
    }}>
      {outcome}
    </span>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{
      backgroundColor: "#FFFFFF",
      borderRadius: "16px",
      padding: "24px 32px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)",
      border: "1px solid #E2E8F0",
      borderTop: "3px solid #2B6CB0",
      flex: 1,
      minWidth: "160px",
    }}>
      <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#718096", margin: "0 0 8px" }}>
        {label}
      </p>
      <p style={{ fontSize: "36px", fontWeight: 700, color: "#2B6CB0", margin: 0, lineHeight: 1 }}>
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: "12px", color: "#A0AEC0", margin: "4px 0 0" }}>{sub}</p>
      )}
    </div>
  );
}

function handleExportCSV() {
  const header = ["Patient", "Phone", "Attempt Time", "Duration", "Outcome"].join(",");
  const rows = mockCallAttempts.map((r) =>
    [r.patient, r.phone, r.attemptTime, r.duration, r.outcome]
      .map((v) => `"${v}"`)
      .join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "campaign-call-attempts.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function CampaignDetailPage() {
  const booked = mockCallAttempts.filter((r) => r.outcome === "Appointment Booked").length;
  const voicemails = mockCallAttempts.filter((r) => r.outcome === "Voicemail Left").length;
  const contacted = mockCallAttempts.filter(
    (r) => r.outcome !== "No Answer"
  ).length;

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

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", fontSize: "14px" }}>
          <Link href="/campaigns" style={{ color: "#2B6CB0", textDecoration: "none", fontWeight: 500 }}>
            Campaigns
          </Link>
          <span style={{ color: "#A0AEC0" }}>/</span>
          <span style={{ color: "#718096" }}>Q1 Recall – Overdue Cleanings</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <h2 style={{ fontSize: "28px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: "0 0 8px", lineHeight: 1.25 }}>
                Q1 Recall – Overdue Cleanings
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <span style={{
                  display: "inline-block",
                  backgroundColor: "#EDF2F7",
                  color: "#4A5568",
                  fontSize: "12px",
                  fontWeight: 500,
                  padding: "3px 8px",
                  borderRadius: "6px",
                }}>
                  Recall
                </span>
                <span style={{
                  display: "inline-block",
                  backgroundColor: "#F0FFF4",
                  color: "#276749",
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  padding: "4px 10px",
                  borderRadius: "6px",
                }}>
                  Active
                </span>
                <span style={{ fontSize: "14px", color: "#718096" }}>
                  Mar 1, 2026 – Mar 31, 2026
                </span>
              </div>
            </div>

            <button
              onClick={handleExportCSV}
              style={{
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#2B6CB0",
                backgroundColor: "transparent",
                border: "1px solid #2B6CB0",
                borderRadius: "10px",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                minHeight: "44px",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#EBF8FF"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "32px", flexWrap: "wrap" }}>
          <StatCard label="Contacts Reached" value={contacted} sub={`of ${mockCallAttempts.length} total`} />
          <StatCard label="Appointments Booked" value={booked} sub={`${Math.round((booked / mockCallAttempts.length) * 100)}% success rate`} />
          <StatCard label="Voicemails Left" value={voicemails} sub="awaiting callback" />
        </div>

        {/* Call attempts table */}
        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
        }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0 }}>
              Call Attempt Log
            </h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F7FAFC", borderBottom: "1px solid #E2E8F0" }}>
                  {["Patient", "Phone", "Attempt Time", "Duration", "Outcome"].map((col) => (
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
                {mockCallAttempts.map((row, idx) => (
                  <tr
                    key={row.id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#F7FAFC",
                      borderBottom: "1px solid #E2E8F0",
                      transition: "background-color 150ms",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "#EDF2F7"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = idx % 2 === 0 ? "#FFFFFF" : "#F7FAFC"; }}
                  >
                    <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 600, color: "#2D3748" }}>
                      {row.patient}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: "#4A5568" }}>
                      {row.phone}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: "#718096", whiteSpace: "nowrap" }}>
                      {row.attemptTime}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: "#718096" }}>
                      {row.duration}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <OutcomeBadge outcome={row.outcome} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid #E2E8F0", fontSize: "12px", color: "#A0AEC0" }}>
            {mockCallAttempts.length} call attempts
          </div>
        </div>
      </div>
    </main>
  );
}
