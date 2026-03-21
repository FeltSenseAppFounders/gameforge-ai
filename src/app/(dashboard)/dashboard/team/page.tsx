"use client";

import { useState } from "react";

const ROLES = [
  {
    value: "owner",
    label: "Practice Owner",
    badge: "Owner",
    description: "Full access to all settings, billing, team management, and clinical data. Can delete the practice account.",
    badgeBg: "#EBF8FF",
    badgeColor: "#2B6CB0",
  },
  {
    value: "manager",
    label: "Office Manager",
    badge: "Manager",
    description: "Manage appointments, staff schedules, insurance verification, and reports. Cannot change billing or delete records.",
    badgeBg: "#FAF5FF",
    badgeColor: "#553C9A",
  },
  {
    value: "staff",
    label: "Front Desk Staff",
    badge: "Staff",
    description: "View and create appointments, manage patient check-ins, and handle basic communications. No access to financial or clinical notes.",
    badgeBg: "#F0FFF4",
    badgeColor: "#276749",
  },
  {
    value: "patient-facing",
    label: "Patient-Facing",
    badge: "Patient",
    description: "Limited read-only access to patient-facing information. Cannot view internal notes, billing, or staff records.",
    badgeBg: "#FFFBEB",
    badgeColor: "#B7791F",
  },
];

const getRoleConfig = (value: string) => ROLES.find((r) => r.value === value) ?? ROLES[2];

const initialMembers = [
  { id: 1, name: "Dr. Anita Patel", email: "dr.patel@clinic.com", role: "owner", lastActive: "2026-03-18 09:14" },
  { id: 2, name: "Sarah Kim", email: "s.kim@clinic.com", role: "manager", lastActive: "2026-03-18 08:45" },
  { id: 3, name: "Marcus Rivera", email: "m.rivera@clinic.com", role: "staff", lastActive: "2026-03-17 17:30" },
  { id: 4, name: "Jessica Nguyen", email: "j.nguyen@clinic.com", role: "staff", lastActive: "2026-03-17 16:10" },
  { id: 5, name: "Front Desk Kiosk", email: "kiosk@clinic.com", role: "patient-facing", lastActive: "2026-03-18 07:00" },
];

type Member = typeof initialMembers[0];

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "staff" });
  const [tooltipRole, setTooltipRole] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleInvite() {
    if (!form.name.trim() || !form.email.trim()) return;
    setMembers((prev) => [
      ...prev,
      { id: Date.now(), name: form.name.trim(), email: form.email.trim(), role: form.role, lastActive: "Never" },
    ]);
    setForm({ name: "", email: "", role: "staff" });
    setSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
    }, 1200);
  }

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

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px" }}>
        {/* Page title */}
        <div style={{ marginBottom: "32px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0, lineHeight: 1.25 }}>
              Team &amp; Roles
            </h2>
            <p style={{ fontSize: "14px", color: "#718096", marginTop: "8px", marginBottom: 0 }}>
              Manage team members and their access permissions
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#2B6CB0",
              color: "#FFFFFF",
              cursor: "pointer",
              minHeight: "44px",
              transition: "background-color 150ms",
              flexShrink: 0,
            }}
          >
            + Invite Team Member
          </button>
        </div>

        {/* Team Members Table */}
        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 2px 4px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F7FAFC", borderBottom: "1px solid #E2E8F0" }}>
                  <th style={{ padding: "12px 16px 12px 32px", textAlign: "left", fontSize: "14px", fontWeight: 600, color: "#4A5568" }}>Name</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: 600, color: "#4A5568" }}>Email</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: 600, color: "#4A5568" }}>Role</th>
                  <th style={{ padding: "12px 32px 12px 16px", textAlign: "left", fontSize: "14px", fontWeight: 600, color: "#4A5568" }}>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, idx) => {
                  const role = getRoleConfig(member.role);
                  return (
                    <tr key={member.id} style={{ backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#F7FAFC", borderBottom: idx < members.length - 1 ? "1px solid #E2E8F0" : "none" }}>
                      <td style={{ padding: "14px 16px 14px 32px", fontSize: "14px", fontWeight: 600, color: "#2D3748" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "9999px",
                            backgroundColor: role.badgeBg,
                            border: `1px solid ${role.badgeColor}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            fontWeight: 700,
                            color: role.badgeColor,
                            flexShrink: 0,
                          }}>
                            {member.name.charAt(0)}
                          </div>
                          {member.name}
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "14px", color: "#718096" }}>{member.email}</td>
                      <td style={{ padding: "14px 16px", fontSize: "14px", color: "#2D3748" }}>
                        <span style={{
                          backgroundColor: role.badgeBg,
                          color: role.badgeColor,
                          fontSize: "11px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          whiteSpace: "nowrap",
                        }}>
                          {role.badge}
                        </span>
                      </td>
                      <td style={{ padding: "14px 32px 14px 16px", fontSize: "14px", color: "#718096", whiteSpace: "nowrap" }}>{member.lastActive}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role Permissions Reference */}
        <div style={{ marginTop: "32px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: "0 0 16px" }}>
            Role Permissions
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
            {ROLES.map((role) => (
              <div key={role.value} style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                border: "1px solid #E2E8F0",
                borderTop: `3px solid ${role.badgeColor}`,
                boxShadow: "0 2px 4px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04)",
                padding: "20px 24px",
              }}>
                <span style={{
                  backgroundColor: role.badgeBg,
                  color: role.badgeColor,
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  display: "inline-block",
                  marginBottom: "12px",
                }}>
                  {role.badge}
                </span>
                <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 600, color: "#2D3748" }}>{role.label}</p>
                <p style={{ margin: 0, fontSize: "13px", color: "#718096", lineHeight: 1.6 }}>{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(26,32,44,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: "16px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            boxShadow: "0 16px 48px rgba(0,0,0,0.10), 0 32px 64px rgba(0,0,0,0.07)",
            width: "100%",
            maxWidth: "480px",
            overflow: "hidden",
          }}>
            {/* Modal header */}
            <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontSize: "22px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                Invite Team Member
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#A0AEC0", fontSize: "22px", padding: "4px", lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <p style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#276749" }}>Invitation sent!</p>
                </div>
              ) : (
                <>
                  {/* Name */}
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#2D3748", marginBottom: "6px" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Jane Smith"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        fontSize: "16px",
                        border: "1px solid #CBD5E0",
                        borderRadius: "10px",
                        outline: "none",
                        color: "#2D3748",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#2D3748", marginBottom: "6px" }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. jane@clinic.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        fontSize: "16px",
                        border: "1px solid #CBD5E0",
                        borderRadius: "10px",
                        outline: "none",
                        color: "#2D3748",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#2D3748", marginBottom: "6px" }}>
                      Role
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {ROLES.map((role) => (
                        <div
                          key={role.value}
                          onClick={() => setForm((f) => ({ ...f, role: role.value }))}
                          onMouseEnter={() => setTooltipRole(role.value)}
                          onMouseLeave={() => setTooltipRole(null)}
                          style={{
                            position: "relative",
                            padding: "12px 16px",
                            border: form.role === role.value ? `2px solid ${role.badgeColor}` : "2px solid #E2E8F0",
                            borderRadius: "10px",
                            cursor: "pointer",
                            backgroundColor: form.role === role.value ? role.badgeBg : "#FFFFFF",
                            transition: "all 150ms",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{
                              backgroundColor: role.badgeBg,
                              color: role.badgeColor,
                              fontSize: "11px",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              padding: "3px 8px",
                              borderRadius: "6px",
                              whiteSpace: "nowrap",
                            }}>
                              {role.badge}
                            </span>
                            <span style={{ fontSize: "14px", fontWeight: 600, color: "#2D3748" }}>{role.label}</span>
                            <svg
                              width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A0AEC0" strokeWidth={2}
                              style={{ marginLeft: "auto", flexShrink: 0 }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>

                          {/* Tooltip */}
                          {tooltipRole === role.value && (
                            <div style={{
                              position: "absolute",
                              bottom: "calc(100% + 8px)",
                              left: "0",
                              right: "0",
                              backgroundColor: "#2D3748",
                              color: "#FFFFFF",
                              fontSize: "12px",
                              lineHeight: 1.5,
                              padding: "8px 12px",
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)",
                              zIndex: 10,
                              pointerEvents: "none",
                            }}>
                              {role.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal footer */}
            {!submitted && (
              <div style={{ padding: "16px 24px 24px", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: 600,
                    borderRadius: "10px",
                    border: "2px solid #E2E8F0",
                    backgroundColor: "#FFFFFF",
                    color: "#4A5568",
                    cursor: "pointer",
                    minHeight: "44px",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={!form.name.trim() || !form.email.trim()}
                  style={{
                    padding: "10px 24px",
                    fontSize: "14px",
                    fontWeight: 600,
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: form.name.trim() && form.email.trim() ? "#2B6CB0" : "#CBD5E0",
                    color: form.name.trim() && form.email.trim() ? "#FFFFFF" : "#A0AEC0",
                    cursor: form.name.trim() && form.email.trim() ? "pointer" : "not-allowed",
                    minHeight: "44px",
                    transition: "background-color 150ms",
                  }}
                >
                  Send Invite
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
