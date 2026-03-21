"use client";

import { useState } from "react";
import Link from "next/link";

type CampaignStatus = "active" | "scheduled" | "paused" | "completed";
type CampaignType = "Lead Follow-up" | "Recall" | "Payment Collection";

interface Campaign {
  id: number;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  contacts: number;
  contacted: number;
  successRate: number;
  startDate: string;
  endDate: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Q1 Recall – Overdue Cleanings",
    type: "Recall",
    status: "active",
    contacts: 340,
    contacted: 218,
    successRate: 62,
    startDate: "Mar 1, 2026",
    endDate: "Mar 31, 2026",
  },
  {
    id: 2,
    name: "New Patient Lead Follow-up",
    type: "Lead Follow-up",
    status: "active",
    contacts: 120,
    contacted: 74,
    successRate: 55,
    startDate: "Mar 10, 2026",
    endDate: "Mar 24, 2026",
  },
  {
    id: 3,
    name: "Outstanding Balances – Feb",
    type: "Payment Collection",
    status: "paused",
    contacts: 85,
    contacted: 40,
    successRate: 38,
    startDate: "Feb 15, 2026",
    endDate: "Mar 15, 2026",
  },
  {
    id: 4,
    name: "Spring Recall Drive",
    type: "Recall",
    status: "scheduled",
    contacts: 500,
    contacted: 0,
    successRate: 0,
    startDate: "Apr 1, 2026",
    endDate: "Apr 30, 2026",
  },
  {
    id: 5,
    name: "Holiday Lead Re-engagement",
    type: "Lead Follow-up",
    status: "completed",
    contacts: 200,
    contacted: 200,
    successRate: 71,
    startDate: "Dec 1, 2025",
    endDate: "Dec 31, 2025",
  },
  {
    id: 6,
    name: "Year-End Balance Collection",
    type: "Payment Collection",
    status: "completed",
    contacts: 150,
    contacted: 150,
    successRate: 44,
    startDate: "Nov 15, 2025",
    endDate: "Dec 15, 2025",
  },
];

const statusConfig: Record<CampaignStatus, { label: string; bg: string; text: string }> = {
  active:    { label: "Active",    bg: "#F0FFF4", text: "#276749" },
  scheduled: { label: "Scheduled", bg: "#EBF8FF", text: "#2B6CB0" },
  paused:    { label: "Paused",    bg: "#FFFBEB", text: "#B7791F" },
  completed: { label: "Completed", bg: "#F7FAFC", text: "#718096" },
};

const campaignTypes: CampaignType[] = ["Lead Follow-up", "Recall", "Payment Collection"];

function StatusBadge({ status }: { status: CampaignStatus }) {
  const cfg = statusConfig[status];
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
    }}>
      {cfg.label}
    </span>
  );
}

function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{
        flex: 1,
        height: "6px",
        backgroundColor: "#E2E8F0",
        borderRadius: "9999px",
        overflow: "hidden",
        minWidth: "80px",
      }}>
        <div style={{
          width: `${pct}%`,
          height: "100%",
          backgroundColor: pct === 100 ? "#276749" : "#2B6CB0",
          borderRadius: "9999px",
          transition: "width 0.3s ease",
        }} />
      </div>
      <span style={{ fontSize: "12px", color: "#718096", whiteSpace: "nowrap", minWidth: "32px" }}>
        {pct}%
      </span>
    </div>
  );
}

const campaignTypeInfo: Record<CampaignType, { description: string; icon: string; patientCount: number }> = {
  "Lead Follow-up": {
    description: "Automatically calls new leads who haven't yet booked an appointment. AI agent introduces the practice, answers questions, and schedules a first visit.",
    icon: "📞",
    patientCount: 143,
  },
  Recall: {
    description: "Re-engages patients overdue for routine care (cleanings, check-ups, etc.). Reminds them of their health status and books them back in.",
    icon: "🔔",
    patientCount: 312,
  },
  "Payment Collection": {
    description: "Contacts patients with outstanding balances to arrange payment or set up a payment plan, reducing accounts receivable without burdening staff.",
    icon: "💳",
    patientCount: 87,
  },
};

const inputStyle: React.CSSProperties = {
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
};

function NewCampaignModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<CampaignType>("Recall");
  const [startDate, setStartDate] = useState("");
  const [timeFrom, setTimeFrom] = useState("09:00");
  const [timeTo, setTimeTo] = useState("17:00");
  const [success, setSuccess] = useState(false);

  const info = campaignTypeInfo[type];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => onClose(), 2000);
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "#2B6CB0";
    e.target.style.boxShadow = "0 0 0 3px rgba(43,108,176,0.35)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "#CBD5E0";
    e.target.style.boxShadow = "none";
  };

  if (success) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 50,
        backgroundColor: "rgba(26,32,44,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
      }}>
        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          boxShadow: "0 16px 48px rgba(0,0,0,0.10), 0 32px 64px rgba(0,0,0,0.07)",
          width: "100%",
          maxWidth: "400px",
          padding: "48px 32px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
          <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: "0 0 8px" }}>
            Campaign Created!
          </h2>
          <p style={{ fontSize: "14px", color: "#718096", margin: 0 }}>
            &ldquo;{name}&rdquo; has been scheduled. Returning to campaigns list…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        backgroundColor: "rgba(26,32,44,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          boxShadow: "0 16px 48px rgba(0,0,0,0.10), 0 32px 64px rgba(0,0,0,0.07)",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "24px",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0 }}>
            New Campaign
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#718096", padding: "4px 8px", borderRadius: "6px", lineHeight: 1 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#EDF2F7"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Campaign Name */}
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#2D3748", marginBottom: "6px" }}>
              Campaign Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q2 Recall Drive"
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </div>

          {/* Campaign Type */}
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#2D3748", marginBottom: "6px" }}>
              Campaign Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as CampaignType)}
              style={{ ...inputStyle, cursor: "pointer" }}
              onFocus={focusStyle}
              onBlur={blurStyle}
            >
              {campaignTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Description Panel */}
          <div style={{
            backgroundColor: "#EBF8FF",
            border: "1px solid #BEE3F8",
            borderRadius: "10px",
            padding: "16px",
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
          }}>
            <span style={{ fontSize: "24px", lineHeight: 1, flexShrink: 0 }}>{info.icon}</span>
            <p style={{ fontSize: "14px", color: "#2B6CB0", margin: 0, lineHeight: 1.6 }}>
              {info.description}
            </p>
          </div>

          {/* Target Audience */}
          <div style={{
            backgroundColor: "#F7FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "10px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#718096", margin: "0 0 4px" }}>
                Target Audience
              </p>
              <p style={{ fontSize: "14px", color: "#2D3748", margin: 0 }}>
                Matching patients for <strong>{type}</strong>
              </p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#2B6CB0", margin: 0, lineHeight: 1 }}>
                {info.patientCount}
              </p>
              <p style={{ fontSize: "12px", color: "#718096", margin: "2px 0 0" }}>patients</p>
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#2D3748", marginBottom: "6px" }}>
              Start Date
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </div>

          {/* Call Time Window */}
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#2D3748", marginBottom: "6px" }}>
              Call Time Window
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "8px", alignItems: "center" }}>
              <input
                type="time"
                required
                value={timeFrom}
                onChange={(e) => setTimeFrom(e.target.value)}
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              <span style={{ fontSize: "14px", color: "#718096", textAlign: "center" }}>to</span>
              <input
                type="time"
                required
                value={timeTo}
                onChange={(e) => setTimeTo(e.target.value)}
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", paddingTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "12px 24px", fontSize: "14px", fontWeight: 600,
                color: "#2B6CB0", backgroundColor: "transparent",
                border: "1px solid #2B6CB0", borderRadius: "10px",
                cursor: "pointer", fontFamily: "Inter, sans-serif", minHeight: "44px",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#EBF8FF"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "12px 24px", fontSize: "14px", fontWeight: 600,
                color: "#FFFFFF", backgroundColor: "#2B6CB0",
                border: "none", borderRadius: "10px",
                cursor: "pointer", fontFamily: "Inter, sans-serif", minHeight: "44px",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1A4C8A"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2B6CB0"; }}
            >
              Create Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CampaignsPage() {
  const [showModal, setShowModal] = useState(false);

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

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px" }}>
        {/* Page title + New Campaign button */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", gap: "16px" }}>
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0, lineHeight: 1.25 }}>
              Outbound Campaigns
            </h2>
            <p style={{ fontSize: "14px", color: "#718096", marginTop: "8px" }}>
              Manage active, scheduled, and completed outbound calling campaigns
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
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
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1A4C8A"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2B6CB0"; }}
          >
            + New Campaign
          </button>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)", border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F7FAFC", borderBottom: "1px solid #E2E8F0" }}>
                  {["Campaign Name", "Type", "Status", "Contacts", "Progress", "Success Rate"].map((col) => (
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
                {mockCampaigns.map((campaign, idx) => (
                  <tr
                    key={campaign.id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#F7FAFC",
                      borderBottom: "1px solid #E2E8F0",
                      transition: "background-color 150ms",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "#EDF2F7"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = idx % 2 === 0 ? "#FFFFFF" : "#F7FAFC"; }}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <Link href={`/campaigns/${campaign.id}`} style={{ fontSize: "14px", fontWeight: 600, color: "#2B6CB0", textDecoration: "none" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "none"; }}
                      >{campaign.name}</Link>
                      <div style={{ fontSize: "12px", color: "#A0AEC0", marginTop: "2px" }}>{campaign.startDate} – {campaign.endDate}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        display: "inline-block",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#4A5568",
                        backgroundColor: "#EDF2F7",
                        padding: "3px 8px",
                        borderRadius: "6px",
                      }}>
                        {campaign.type}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <StatusBadge status={campaign.status} />
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: "#2D3748", textAlign: "right" }}>
                      <span style={{ fontWeight: 600 }}>{campaign.contacted.toLocaleString()}</span>
                      <span style={{ color: "#A0AEC0" }}> / {campaign.contacts.toLocaleString()}</span>
                    </td>
                    <td style={{ padding: "14px 16px", minWidth: "140px" }}>
                      <ProgressBar value={campaign.contacted} total={campaign.contacts} />
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      {campaign.status === "scheduled" ? (
                        <span style={{ fontSize: "14px", color: "#A0AEC0" }}>—</span>
                      ) : (
                        <span style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: campaign.successRate >= 60 ? "#276749" : campaign.successRate >= 40 ? "#B7791F" : "#C53030",
                        }}>
                          {campaign.successRate}%
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid #E2E8F0", fontSize: "12px", color: "#A0AEC0" }}>
            {mockCampaigns.length} campaigns total
          </div>
        </div>
      </div>

      {showModal && <NewCampaignModal onClose={() => setShowModal(false)} />}
    </main>
  );
}
