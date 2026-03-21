"use client";

import { useState } from "react";

type AccountStatus = "overdue" | "paid" | "payment_plan" | "callback" | "no_answer";

type CallOutcome = "paid_full" | "payment_plan" | "callback" | "no_answer";

interface OverdueAccount {
  id: number;
  patientName: string;
  balance: number;
  daysOverdue: number;
  lastContact: string;
  phone: string;
  status: AccountStatus;
}

const initialAccounts: OverdueAccount[] = [
  { id: 1, patientName: "Margaret Collins", balance: 480.00, daysOverdue: 62, lastContact: "Jan 15, 2026", phone: "(555) 234-5678", status: "overdue" },
  { id: 2, patientName: "Derek Washington", balance: 1250.50, daysOverdue: 91, lastContact: "Dec 28, 2025", phone: "(555) 891-2345", status: "overdue" },
  { id: 3, patientName: "Sandra Kim", balance: 315.00, daysOverdue: 45, lastContact: "Feb 2, 2026", phone: "(555) 456-7890", status: "overdue" },
  { id: 4, patientName: "Harold Patel", balance: 740.75, daysOverdue: 78, lastContact: "Jan 5, 2026", phone: "(555) 123-9876", status: "overdue" },
  { id: 5, patientName: "Cynthia Moore", balance: 195.00, daysOverdue: 33, lastContact: "Feb 14, 2026", phone: "(555) 678-3412", status: "overdue" },
  { id: 6, patientName: "Frank Nguyen", balance: 890.25, daysOverdue: 105, lastContact: "Dec 10, 2025", phone: "(555) 321-6540", status: "overdue" },
  { id: 7, patientName: "Joyce Taylor", balance: 560.00, daysOverdue: 52, lastContact: "Jan 22, 2026", phone: "(555) 987-1234", status: "overdue" },
];

const CALL_STEPS = [
  { key: "greeting", label: "Greeting", description: "AI introduces itself and confirms patient identity" },
  { key: "balance", label: "Balance Statement", description: "AI states the outstanding balance and due date" },
  { key: "options", label: "Payment Options Offered", description: "AI presents available payment methods and plans" },
  { key: "outcome", label: "Outcome Recorded", description: "Patient responds — select the call outcome below" },
];

const outcomeOptions: { value: CallOutcome; label: string; color: string; bg: string }[] = [
  { value: "paid_full", label: "Paid in Full", color: "#276749", bg: "#F0FFF4" },
  { value: "payment_plan", label: "Payment Plan Set", color: "#2B6CB0", bg: "#EBF4FF" },
  { value: "callback", label: "Callback Scheduled", color: "#B7791F", bg: "#FFFBEB" },
  { value: "no_answer", label: "No Answer", color: "#718096", bg: "#F7FAFC" },
];

const outcomeToStatus: Record<CallOutcome, AccountStatus> = {
  paid_full: "paid",
  payment_plan: "payment_plan",
  callback: "callback",
  no_answer: "no_answer",
};

const statusConfig: Record<AccountStatus, { label: string; bg: string; color: string }> = {
  overdue: { label: "Overdue", bg: "#FFF5F5", color: "#C53030" },
  paid: { label: "Paid in Full", bg: "#F0FFF4", color: "#276749" },
  payment_plan: { label: "Payment Plan", bg: "#EBF4FF", color: "#2B6CB0" },
  callback: { label: "Callback Scheduled", bg: "#FFFBEB", color: "#B7791F" },
  no_answer: { label: "No Answer", bg: "#F7FAFC", color: "#718096" },
};

export default function PaymentCollectionPage() {
  const [accounts, setAccounts] = useState<OverdueAccount[]>(initialAccounts);
  const [activeAccount, setActiveAccount] = useState<OverdueAccount | null>(null);
  const [callStep, setCallStep] = useState(0);
  const [selectedOutcome, setSelectedOutcome] = useState<CallOutcome | null>(null);
  const [callComplete, setCallComplete] = useState(false);

  function startCall(account: OverdueAccount) {
    setActiveAccount(account);
    setCallStep(0);
    setSelectedOutcome(null);
    setCallComplete(false);
  }

  function nextStep() {
    if (callStep < CALL_STEPS.length - 1) {
      setCallStep((s) => s + 1);
    }
  }

  function recordOutcome() {
    if (!selectedOutcome || !activeAccount) return;
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === activeAccount.id ? { ...a, status: outcomeToStatus[selectedOutcome] } : a
      )
    );
    setCallComplete(true);
  }

  function closePanel() {
    setActiveAccount(null);
    setCallStep(0);
    setSelectedOutcome(null);
    setCallComplete(false);
  }

  const overdueCount = accounts.filter((a) => a.status === "overdue").length;
  const totalOverdue = accounts.filter((a) => a.status === "overdue").reduce((s, a) => s + a.balance, 0);

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
        {/* Page Title */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0, lineHeight: 1.25 }}>
            Payment Collection
          </h2>
          <p style={{ fontSize: "14px", color: "#718096", marginTop: "8px" }}>
            AI-initiated outbound calls for overdue account collection
          </p>
        </div>

        {/* Summary KPIs */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)",
            border: "1px solid #E2E8F0",
            borderTop: "3px solid #C53030",
            minWidth: "180px",
          }}>
            <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#718096", margin: 0 }}>Overdue Accounts</p>
            <p style={{ fontSize: "36px", fontWeight: 700, color: "#C53030", margin: "4px 0 0 0", lineHeight: 1.2 }}>{overdueCount}</p>
          </div>
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)",
            border: "1px solid #E2E8F0",
            borderTop: "3px solid #2B6CB0",
            minWidth: "180px",
          }}>
            <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#718096", margin: 0 }}>Total Outstanding</p>
            <p style={{ fontSize: "36px", fontWeight: 700, color: "#2B6CB0", margin: "4px 0 0 0", lineHeight: 1.2 }}>
              ${totalOverdue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Two-column layout when panel is open */}
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
          {/* Accounts Table */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)",
              border: "1px solid #E2E8F0",
              overflow: "hidden",
            }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F7FAFC", borderBottom: "1px solid #E2E8F0" }}>
                      {["Patient Name", "Balance", "Days Overdue", "Last Contact", "Status", "Action"].map((h) => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: 600, color: "#4A5568", whiteSpace: "nowrap" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((account, idx) => {
                      const sc = statusConfig[account.status];
                      const isActive = activeAccount?.id === account.id;
                      return (
                        <tr
                          key={account.id}
                          style={{
                            backgroundColor: isActive ? "#EBF4FF" : idx % 2 === 0 ? "#FFFFFF" : "#F7FAFC",
                            borderBottom: "1px solid #E2E8F0",
                            transition: "background-color 150ms",
                          }}
                        >
                          <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 600, color: "#2D3748" }}>{account.patientName}</td>
                          <td style={{ padding: "12px 16px", fontSize: "14px", color: "#2D3748", fontWeight: 600, textAlign: "right" }}>
                            ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td style={{ padding: "12px 16px", fontSize: "14px", color: account.daysOverdue > 60 ? "#C53030" : "#B7791F", fontWeight: 600, textAlign: "right" }}>
                            {account.daysOverdue}d
                          </td>
                          <td style={{ padding: "12px 16px", fontSize: "14px", color: "#718096", whiteSpace: "nowrap" }}>{account.lastContact}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{
                              display: "inline-block",
                              backgroundColor: sc.bg,
                              color: sc.color,
                              fontSize: "11px",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              whiteSpace: "nowrap",
                            }}>
                              {sc.label}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            {account.status === "overdue" ? (
                              <button
                                onClick={() => startCall(account)}
                                style={{
                                  backgroundColor: isActive ? "#1A4C8A" : "#2B6CB0",
                                  color: "#FFFFFF",
                                  border: "none",
                                  borderRadius: "10px",
                                  padding: "8px 16px",
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  whiteSpace: "nowrap",
                                  minHeight: "44px",
                                  fontFamily: "Inter, sans-serif",
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1A4C8A"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = isActive ? "#1A4C8A" : "#2B6CB0"; }}
                              >
                                Start Collection Call
                              </button>
                            ) : (
                              <span style={{ fontSize: "14px", color: "#A0AEC0" }}>—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: "12px 16px", borderTop: "1px solid #E2E8F0", fontSize: "12px", color: "#A0AEC0" }}>
                {accounts.length} accounts
              </div>
            </div>
          </div>

          {/* Call Flow Panel */}
          {activeAccount && (
            <div style={{
              width: "380px",
              flexShrink: 0,
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.06)",
              border: "1px solid #E2E8F0",
              overflow: "hidden",
            }}>
              {/* Panel Header */}
              <div style={{ backgroundColor: "#2D3748", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#A0AEC0", margin: 0 }}>Active Call</p>
                  <p style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", margin: "4px 0 0 0", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                    {activeAccount.patientName}
                  </p>
                  <p style={{ fontSize: "13px", color: "#A0AEC0", margin: "2px 0 0 0" }}>{activeAccount.phone}</p>
                </div>
                <button
                  onClick={closePanel}
                  aria-label="Close call panel"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "20px",
                    color: "#A0AEC0",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    lineHeight: 1,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#A0AEC0"; }}
                >
                  ×
                </button>
              </div>

              {/* Balance Info */}
              <div style={{ padding: "16px 20px", backgroundColor: "#FFF5F5", borderBottom: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#718096", margin: 0 }}>Outstanding Balance</p>
                    <p style={{ fontSize: "22px", fontWeight: 700, color: "#C53030", margin: "4px 0 0 0", lineHeight: 1.3 }}>
                      ${activeAccount.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#718096", margin: 0 }}>Days Overdue</p>
                    <p style={{ fontSize: "22px", fontWeight: 700, color: "#B7791F", margin: "4px 0 0 0", lineHeight: 1.3 }}>
                      {activeAccount.daysOverdue}
                    </p>
                  </div>
                </div>
              </div>

              {/* Call Steps */}
              <div style={{ padding: "20px" }}>
                <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#718096", margin: "0 0 16px 0" }}>
                  Call Flow
                </p>

                {callComplete ? (
                  <div style={{
                    padding: "16px",
                    backgroundColor: "#F0FFF4",
                    borderRadius: "10px",
                    border: "1px solid #C6F6D5",
                    marginBottom: "16px",
                  }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#276749", margin: 0 }}>
                      Call complete — outcome recorded
                    </p>
                    {selectedOutcome && (
                      <p style={{ fontSize: "13px", color: "#276749", margin: "4px 0 0 0" }}>
                        {outcomeOptions.find((o) => o.value === selectedOutcome)?.label}
                      </p>
                    )}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                    {CALL_STEPS.map((step, idx) => {
                      const isDone = idx < callStep;
                      const isActive = idx === callStep;
                      const isPending = idx > callStep;

                      return (
                        <div
                          key={step.key}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px",
                            padding: "12px",
                            borderRadius: "10px",
                            backgroundColor: isActive ? "#EBF4FF" : isDone ? "#F0FFF4" : "#F7FAFC",
                            border: `1px solid ${isActive ? "#BEE3F8" : isDone ? "#C6F6D5" : "#E2E8F0"}`,
                            opacity: isPending ? 0.6 : 1,
                          }}
                        >
                          <div style={{
                            flexShrink: 0,
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            backgroundColor: isDone ? "#276749" : isActive ? "#2B6CB0" : "#CBD5E0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: isDone || isActive ? "#FFFFFF" : "#718096",
                            marginTop: "1px",
                          }}>
                            {isDone ? "✓" : idx + 1}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: "14px", fontWeight: 600, color: isActive ? "#2B6CB0" : isDone ? "#276749" : "#4A5568", margin: 0 }}>
                              {step.label}
                            </p>
                            <p style={{ fontSize: "12px", color: "#718096", margin: "2px 0 0 0", lineHeight: 1.5 }}>
                              {step.description}
                            </p>

                            {/* Outcome selection on last step */}
                            {isActive && step.key === "outcome" && (
                              <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                                {outcomeOptions.map((opt) => (
                                  <button
                                    key={opt.value}
                                    onClick={() => setSelectedOutcome(opt.value)}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      padding: "8px 12px",
                                      borderRadius: "8px",
                                      border: `2px solid ${selectedOutcome === opt.value ? opt.color : "#E2E8F0"}`,
                                      backgroundColor: selectedOutcome === opt.value ? opt.bg : "#FFFFFF",
                                      cursor: "pointer",
                                      fontSize: "13px",
                                      fontWeight: 600,
                                      color: selectedOutcome === opt.value ? opt.color : "#4A5568",
                                      textAlign: "left",
                                      fontFamily: "Inter, sans-serif",
                                      transition: "all 150ms",
                                    }}
                                  >
                                    <span style={{
                                      width: "10px",
                                      height: "10px",
                                      borderRadius: "50%",
                                      border: `2px solid ${selectedOutcome === opt.value ? opt.color : "#CBD5E0"}`,
                                      backgroundColor: selectedOutcome === opt.value ? opt.color : "transparent",
                                      flexShrink: 0,
                                    }} />
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Action Button */}
                {!callComplete && (
                  callStep < CALL_STEPS.length - 1 ? (
                    <button
                      onClick={nextStep}
                      style={{
                        width: "100%",
                        backgroundColor: "#2B6CB0",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "10px",
                        padding: "12px 24px",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                        minHeight: "44px",
                        fontFamily: "Inter, sans-serif",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1A4C8A"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2B6CB0"; }}
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      onClick={recordOutcome}
                      disabled={!selectedOutcome}
                      style={{
                        width: "100%",
                        backgroundColor: selectedOutcome ? "#276749" : "#CBD5E0",
                        color: selectedOutcome ? "#FFFFFF" : "#A0AEC0",
                        border: "none",
                        borderRadius: "10px",
                        padding: "12px 24px",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: selectedOutcome ? "pointer" : "not-allowed",
                        minHeight: "44px",
                        fontFamily: "Inter, sans-serif",
                      }}
                      onMouseEnter={(e) => { if (selectedOutcome) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1C4532"; }}
                      onMouseLeave={(e) => { if (selectedOutcome) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#276749"; }}
                    >
                      Record Outcome
                    </button>
                  )
                )}

                {callComplete && (
                  <button
                    onClick={closePanel}
                    style={{
                      width: "100%",
                      backgroundColor: "transparent",
                      color: "#2B6CB0",
                      border: "2px solid #2B6CB0",
                      borderRadius: "10px",
                      padding: "12px 24px",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      minHeight: "44px",
                      fontFamily: "Inter, sans-serif",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#EBF4FF"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                  >
                    Close Panel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
