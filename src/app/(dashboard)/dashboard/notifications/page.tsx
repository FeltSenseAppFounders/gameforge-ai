"use client";

import { useState } from "react";

type Channel = "email" | "sms" | "inApp";

interface NotificationEvent {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  channels: Record<Channel, boolean>;
}

const DEFAULT_EVENTS: NotificationEvent[] = [
  { id: "missed_call", label: "Missed Call", description: "Triggered when an inbound call goes unanswered", enabled: true, channels: { email: true, sms: true, inApp: true } },
  { id: "failed_insurance", label: "Failed Insurance Verification", description: "Triggered when a patient's insurance cannot be verified", enabled: true, channels: { email: true, sms: false, inApp: true } },
  { id: "failed_pms_sync", label: "Failed PMS Sync", description: "Triggered when a Practice Management System sync fails", enabled: true, channels: { email: true, sms: false, inApp: true } },
  { id: "new_lead", label: "New Lead", description: "Triggered when a new prospective patient contacts the practice", enabled: true, channels: { email: true, sms: true, inApp: true } },
  { id: "appointment_cancelled", label: "Appointment Cancelled", description: "Triggered when a patient cancels their scheduled appointment", enabled: true, channels: { email: false, sms: true, inApp: true } },
  { id: "voicemail_received", label: "Voicemail Received", description: "Triggered when a patient leaves a voicemail message", enabled: false, channels: { email: true, sms: false, inApp: true } },
  { id: "payment_failed", label: "Payment Failed", description: "Triggered when a payment or billing transaction is declined", enabled: false, channels: { email: true, sms: false, inApp: true } },
];

export default function NotificationsPage() {
  const [events, setEvents] = useState<NotificationEvent[]>(DEFAULT_EVENTS);
  const [emailRecipient, setEmailRecipient] = useState("admin@brightsmile.dental");
  const [smsRecipient, setSmsRecipient] = useState("+1 (555) 123-4567");
  const [emailError, setEmailError] = useState("");
  const [smsError, setSmsError] = useState("");
  const [showToast, setShowToast] = useState(false);

  function toggleEvent(id: string) {
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, enabled: !e.enabled } : e));
  }

  function toggleChannel(id: string, channel: Channel) {
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, channels: { ...e.channels, [channel]: !e.channels[channel] } } : e));
  }

  function validateEmail(value: string) {
    if (!value) { setEmailError("Email is required"); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setEmailError("Enter a valid email address"); return false; }
    setEmailError("");
    return true;
  }

  function validateSms(value: string) {
    if (!value) { setSmsError("Phone number is required"); return false; }
    if (!/^\+?[\d\s()\-]{7,20}$/.test(value)) { setSmsError("Enter a valid phone number"); return false; }
    setSmsError("");
    return true;
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const emailOk = validateEmail(emailRecipient);
    const smsOk = validateSms(smsRecipient);
    if (!emailOk || !smsOk) return;
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#F7FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#2D3748", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: 600, fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0 }}>
          VoiceAI Dashboard
        </h1>
        <span style={{ backgroundColor: "#2B6CB0", color: "#FFFFFF", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", padding: "4px 10px", borderRadius: "6px" }}>
          Notification Settings
        </span>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 32px" }}>
        {/* Page title */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0, lineHeight: 1.25 }}>
            Notification & Alert Settings
          </h2>
          <p style={{ fontSize: "14px", color: "#718096", marginTop: "8px" }}>
            Choose which events trigger alerts and how they are delivered to your team.
          </p>
        </div>

        <form onSubmit={handleSave}>
          {/* Recipients Card */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h3 style={cardTitleStyle}>Recipient Configuration</h3>
            </div>
            <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Email */}
              <div>
                <label style={labelStyle} htmlFor="emailRecipient">Email Recipient</label>
                <input
                  id="emailRecipient"
                  type="text"
                  value={emailRecipient}
                  onChange={(e) => { setEmailRecipient(e.target.value); if (emailError) validateEmail(e.target.value); }}
                  onBlur={(e) => { validateEmail(e.target.value); e.currentTarget.style.borderColor = emailError ? "#C53030" : "#CBD5E0"; e.currentTarget.style.boxShadow = "none"; }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#2B6CB0"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(43,108,176,0.35)"; }}
                  style={{ ...inputStyle, borderColor: emailError ? "#C53030" : "#CBD5E0" }}
                  placeholder="admin@yourpractice.com"
                />
                {emailError && <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#C53030" }}>{emailError}</p>}
              </div>

              {/* SMS */}
              <div>
                <label style={labelStyle} htmlFor="smsRecipient">SMS Recipient</label>
                <input
                  id="smsRecipient"
                  type="text"
                  value={smsRecipient}
                  onChange={(e) => { setSmsRecipient(e.target.value); if (smsError) validateSms(e.target.value); }}
                  onBlur={(e) => { validateSms(e.target.value); e.currentTarget.style.borderColor = smsError ? "#C53030" : "#CBD5E0"; e.currentTarget.style.boxShadow = "none"; }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#2B6CB0"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(43,108,176,0.35)"; }}
                  style={{ ...inputStyle, borderColor: smsError ? "#C53030" : "#CBD5E0" }}
                  placeholder="+1 (555) 000-0000"
                />
                {smsError && <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#C53030" }}>{smsError}</p>}
              </div>
            </div>
          </div>

          {/* Notification Events Card */}
          <div style={{ ...cardStyle, marginTop: "24px" }}>
            <div style={{ ...cardHeaderStyle, display: "flex", alignItems: "center" }}>
              <h3 style={{ ...cardTitleStyle, flex: 1 }}>Event Notifications</h3>
              <div style={{ display: "flex", gap: "24px" }}>
                {(["Email", "SMS", "In-App"] as const).map((ch) => (
                  <span key={ch} style={{ fontSize: "11px", fontWeight: 600, color: "#718096", textTransform: "uppercase", letterSpacing: "0.05em", minWidth: "48px", textAlign: "center" }}>{ch}</span>
                ))}
              </div>
            </div>

            <div style={{ padding: "0 32px" }}>
              {events.map((event, i) => (
                <div key={event.id} style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  padding: "20px 0",
                  borderBottom: i < events.length - 1 ? "1px solid #E2E8F0" : "none",
                }}>
                  {/* Toggle + label */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={event.enabled}
                      onClick={() => toggleEvent(event.id)}
                      style={{
                        width: "40px", height: "22px", borderRadius: "9999px", border: "none", cursor: "pointer",
                        backgroundColor: event.enabled ? "#2B6CB0" : "#CBD5E0",
                        position: "relative", transition: "background-color 150ms", flexShrink: 0,
                      }}
                    >
                      <span style={{
                        position: "absolute", top: "3px",
                        left: event.enabled ? "21px" : "3px",
                        width: "16px", height: "16px", borderRadius: "9999px",
                        backgroundColor: "#FFFFFF", transition: "left 150ms",
                      }} />
                    </button>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: event.enabled ? "#2D3748" : "#A0AEC0" }}>
                        {event.label}
                      </div>
                      <div style={{ fontSize: "12px", color: "#A0AEC0", marginTop: "2px" }}>
                        {event.description}
                      </div>
                    </div>
                  </div>

                  {/* Channel checkboxes */}
                  <div style={{ display: "flex", gap: "24px" }}>
                    {(["email", "sms", "inApp"] as Channel[]).map((ch) => (
                      <div key={ch} style={{ minWidth: "48px", display: "flex", justifyContent: "center" }}>
                        <input
                          type="checkbox"
                          checked={event.channels[ch]}
                          disabled={!event.enabled}
                          onChange={() => toggleChannel(event.id, ch)}
                          style={{ width: "18px", height: "18px", cursor: event.enabled ? "pointer" : "not-allowed", accentColor: "#2B6CB0" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              style={saveButtonStyle}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1A4C8A"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#2B6CB0"; }}
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div style={{
          position: "fixed", bottom: "32px", right: "32px",
          backgroundColor: "#276749", color: "#FFFFFF",
          padding: "16px 24px", borderRadius: "10px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.06)",
          fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "10px",
          zIndex: 1000,
        }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Preferences saved successfully!
        </div>
      )}
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)",
  border: "1px solid #E2E8F0",
  overflow: "hidden",
};

const cardHeaderStyle: React.CSSProperties = {
  padding: "20px 32px",
  borderBottom: "1px solid #E2E8F0",
  backgroundColor: "#F7FAFC",
  display: "flex",
  alignItems: "center",
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: "18px", fontWeight: 600, color: "#1A202C",
  fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0,
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "14px", fontWeight: 600, color: "#4A5568", marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  backgroundColor: "#FFFFFF", border: "1px solid #CBD5E0",
  borderRadius: "10px", padding: "10px 14px",
  fontSize: "16px", color: "#2D3748", outline: "none",
  transition: "border-color 150ms, box-shadow 150ms",
  fontFamily: "Inter, sans-serif",
};

const saveButtonStyle: React.CSSProperties = {
  backgroundColor: "#2B6CB0", color: "#FFFFFF",
  padding: "12px 32px", borderRadius: "10px", border: "none",
  fontSize: "14px", fontWeight: 600, cursor: "pointer",
  minHeight: "44px", transition: "background-color 150ms",
  fontFamily: "Inter, sans-serif",
};
