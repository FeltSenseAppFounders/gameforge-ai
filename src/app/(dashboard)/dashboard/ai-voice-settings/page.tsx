"use client";

import { useState } from "react";

const LANGUAGE_CONTENT = {
  en: {
    flag: "🇺🇸",
    label: "English",
    greeting: "Thank you for calling Bright Smile Dental. I'm your AI receptionist. How can I help you today?",
    examples: [
      {
        title: "Booking Confirmation",
        text: "Your appointment has been confirmed for Thursday, March 20th at 2:00 PM with Dr. Johnson. You'll receive a reminder 24 hours before.",
      },
      {
        title: "Insurance Question",
        text: "We accept most major insurance plans including Delta Dental, MetLife, and Cigna. Would you like me to verify your specific coverage?",
      },
      {
        title: "Emergency",
        text: "I understand this is an emergency. I'm connecting you with our on-call staff right now. Please stay on the line.",
      },
      {
        title: "Hold Message",
        text: "Thank you for your patience. All of our team members are currently assisting other patients. Your call is very important to us.",
      },
    ],
  },
  es: {
    flag: "🇪🇸",
    label: "Español",
    greeting: "Gracias por llamar a Bright Smile Dental. Soy su recepcionista de IA. ¿En qué puedo ayudarle hoy?",
    examples: [
      {
        title: "Confirmación de Cita",
        text: "Su cita ha sido confirmada para el jueves 20 de marzo a las 2:00 PM con el Dr. Johnson. Recibirá un recordatorio 24 horas antes.",
      },
      {
        title: "Pregunta de Seguro",
        text: "Aceptamos la mayoría de los principales planes de seguro, incluyendo Delta Dental, MetLife y Cigna. ¿Le gustaría que verifique su cobertura específica?",
      },
      {
        title: "Emergencia",
        text: "Entiendo que esto es una emergencia. Le estoy conectando con nuestro personal de guardia ahora mismo. Por favor, permanezca en la línea.",
      },
      {
        title: "Mensaje de Espera",
        text: "Gracias por su paciencia. Todos nuestros miembros del equipo están atendiendo a otros pacientes en este momento. Su llamada es muy importante para nosotros.",
      },
    ],
  },
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const TIME_OPTIONS = [
  "Closed",
  "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "8:00 PM", "9:00 PM",
];

const DEFAULT_HOURS: Record<string, { open: string; close: string; enabled: boolean }> = {
  Monday:    { open: "9:00 AM", close: "5:00 PM", enabled: true },
  Tuesday:   { open: "9:00 AM", close: "5:00 PM", enabled: true },
  Wednesday: { open: "9:00 AM", close: "5:00 PM", enabled: true },
  Thursday:  { open: "9:00 AM", close: "5:00 PM", enabled: true },
  Friday:    { open: "9:00 AM", close: "5:00 PM", enabled: true },
  Saturday:  { open: "Closed", close: "Closed",   enabled: false },
  Sunday:    { open: "Closed", close: "Closed",   enabled: false },
};

export default function AIVoiceSettingsPage() {
  const [practiceName, setPracticeName] = useState("Bright Smile Dental");
  const [greetingMessage, setGreetingMessage] = useState(
    "Thank you for calling Bright Smile Dental. I'm your AI receptionist. How can I help you today?"
  );
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [escalationKeywords, setEscalationKeywords] = useState("emergency, chest pain, can't breathe, urgent");
  const [businessHours, setBusinessHours] = useState(DEFAULT_HOURS);
  const [showToast, setShowToast] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  }

  function updateHours(day: string, field: "open" | "close" | "enabled", value: string | boolean) {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#F7FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#2D3748", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: 600, fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0 }}>
          VoiceAI Dashboard
        </h1>
        <span style={{ backgroundColor: "#2B6CB0", color: "#FFFFFF", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", padding: "4px 10px", borderRadius: "6px" }}>
          AI Voice Settings
        </span>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 32px" }}>
        {/* Page title */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0, lineHeight: 1.25 }}>
            AI Voice Settings
          </h2>
          <p style={{ fontSize: "14px", color: "#718096", marginTop: "8px" }}>
            Configure your AI receptionist behavior, business hours, and escalation rules.
          </p>
        </div>

        <form onSubmit={handleSave}>
          {/* General Settings Card */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h3 style={cardTitleStyle}>General Settings</h3>
            </div>
            <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Practice Name */}
              <div>
                <label style={labelStyle} htmlFor="practiceName">Practice Name</label>
                <input
                  id="practiceName"
                  type="text"
                  value={practiceName}
                  onChange={(e) => setPracticeName(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#2B6CB0"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(43,108,176,0.35)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#CBD5E0"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>

              {/* AI Greeting Message */}
              <div>
                <label style={labelStyle} htmlFor="greetingMessage">AI Greeting Message</label>
                <textarea
                  id="greetingMessage"
                  value={greetingMessage}
                  onChange={(e) => setGreetingMessage(e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: "1.7" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#2B6CB0"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(43,108,176,0.35)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#CBD5E0"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#A0AEC0" }}>
                  This message is spoken when a patient calls in.
                </p>
              </div>

              {/* Language Toggle */}
              <div>
                <span style={labelStyle}>AI Response Language</span>
                <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    style={language === "en" ? toggleActiveStyle : toggleInactiveStyle}
                  >
                    🇺🇸 English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("es")}
                    style={language === "es" ? toggleActiveStyle : toggleInactiveStyle}
                  >
                    🇪🇸 Español
                  </button>
                </div>
                <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#A0AEC0" }}>
                  The AI will respond to patients in the selected language.
                </p>
              </div>
            </div>
          </div>

          {/* Language Preview Card */}
          {(() => {
            const content = LANGUAGE_CONTENT[language];
            return (
              <div style={{ ...cardStyle, marginTop: "24px" }}>
                <div style={{ ...cardHeaderStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h3 style={cardTitleStyle}>Language Preview</h3>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    backgroundColor: language === "en" ? "#EBF8FF" : "#FFF5F5",
                    border: `1px solid ${language === "en" ? "#BEE3F8" : "#FED7D7"}`,
                    borderRadius: "6px", padding: "4px 12px",
                    fontSize: "12px", fontWeight: 600,
                    color: language === "en" ? "#2B6CB0" : "#C53030",
                    textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>
                    <span style={{ fontSize: "16px" }}>{content.flag}</span>
                    {content.label}
                  </div>
                </div>
                <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* Greeting preview */}
                  <div>
                    <span style={{ ...labelStyle, marginBottom: "8px" }}>AI Greeting</span>
                    <div style={{
                      backgroundColor: "#F7FAFC", border: "1px solid #E2E8F0",
                      borderLeft: "4px solid #2B6CB0", borderRadius: "10px",
                      padding: "16px", fontSize: "16px", color: "#2D3748", lineHeight: 1.7,
                    }}>
                      <span style={{ fontSize: "14px", color: "#A0AEC0", display: "block", marginBottom: "4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {content.flag} {content.label}
                      </span>
                      &ldquo;{content.greeting}&rdquo;
                    </div>
                  </div>

                  {/* Common response examples */}
                  <div>
                    <span style={{ ...labelStyle, marginBottom: "12px" }}>Common Response Examples</span>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
                      {content.examples.map((ex) => (
                        <div key={ex.title} style={{
                          backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0",
                          borderRadius: "10px", padding: "16px",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                        }}>
                          <div style={{
                            fontSize: "11px", fontWeight: 600, textTransform: "uppercase",
                            letterSpacing: "0.06em", color: "#2B6CB0", marginBottom: "8px",
                            display: "flex", alignItems: "center", gap: "6px",
                          }}>
                            <span>{content.flag}</span>
                            {ex.title}
                          </div>
                          <p style={{ margin: 0, fontSize: "14px", color: "#4A5568", lineHeight: 1.6 }}>
                            &ldquo;{ex.text}&rdquo;
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Business Hours Card */}
          <div style={{ ...cardStyle, marginTop: "24px" }}>
            <div style={cardHeaderStyle}>
              <h3 style={cardTitleStyle}>Business Hours</h3>
            </div>
            <div style={{ padding: "24px 32px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {DAYS.map((day) => {
                  const hours = businessHours[day];
                  return (
                    <div key={day} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      {/* Toggle */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "140px", flexShrink: 0 }}>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={hours.enabled}
                          onClick={() => updateHours(day, "enabled", !hours.enabled)}
                          style={{
                            width: "40px", height: "22px", borderRadius: "9999px", border: "none", cursor: "pointer",
                            backgroundColor: hours.enabled ? "#2B6CB0" : "#CBD5E0",
                            position: "relative", transition: "background-color 150ms",
                          }}
                        >
                          <span style={{
                            position: "absolute", top: "3px",
                            left: hours.enabled ? "21px" : "3px",
                            width: "16px", height: "16px", borderRadius: "9999px",
                            backgroundColor: "#FFFFFF", transition: "left 150ms",
                          }} />
                        </button>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: hours.enabled ? "#2D3748" : "#A0AEC0" }}>
                          {day}
                        </span>
                      </div>

                      {hours.enabled ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                          <select
                            value={hours.open}
                            onChange={(e) => updateHours(day, "open", e.target.value)}
                            style={selectStyle}
                          >
                            {TIME_OPTIONS.filter((t) => t !== "Closed").map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <span style={{ fontSize: "14px", color: "#718096" }}>to</span>
                          <select
                            value={hours.close}
                            onChange={(e) => updateHours(day, "close", e.target.value)}
                            style={selectStyle}
                          >
                            {TIME_OPTIONS.filter((t) => t !== "Closed").map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span style={{ fontSize: "14px", color: "#A0AEC0", fontStyle: "italic" }}>Closed</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Emergency Escalation Card */}
          <div style={{ ...cardStyle, marginTop: "24px" }}>
            <div style={cardHeaderStyle}>
              <h3 style={cardTitleStyle}>Emergency Escalation</h3>
            </div>
            <div style={{ padding: "24px 32px" }}>
              <label style={labelStyle} htmlFor="escalationKeywords">Escalation Trigger Keywords</label>
              <input
                id="escalationKeywords"
                type="text"
                value={escalationKeywords}
                onChange={(e) => setEscalationKeywords(e.target.value)}
                style={{ ...inputStyle, marginTop: "6px" }}
                placeholder="e.g. emergency, chest pain, urgent"
                onFocus={(e) => { e.currentTarget.style.borderColor = "#2B6CB0"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(43,108,176,0.35)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#CBD5E0"; e.currentTarget.style.boxShadow = "none"; }}
              />
              <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#A0AEC0" }}>
                Comma-separated keywords. When detected, the call is immediately escalated to on-call staff.
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" style={saveButtonStyle}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1A4C8A"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#2B6CB0"; }}
            >
              Save Settings
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
          animation: "slideIn 0.2s ease",
        }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Settings saved successfully!
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

const selectStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF", border: "1px solid #CBD5E0",
  borderRadius: "10px", padding: "8px 12px",
  fontSize: "14px", color: "#2D3748", outline: "none",
  cursor: "pointer", fontFamily: "Inter, sans-serif",
};

const toggleActiveStyle: React.CSSProperties = {
  padding: "8px 20px", borderRadius: "10px", border: "2px solid #2B6CB0",
  backgroundColor: "#2B6CB0", color: "#FFFFFF",
  fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 150ms",
};

const toggleInactiveStyle: React.CSSProperties = {
  padding: "8px 20px", borderRadius: "10px", border: "2px solid #CBD5E0",
  backgroundColor: "#FFFFFF", color: "#4A5568",
  fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 150ms",
};

const saveButtonStyle: React.CSSProperties = {
  backgroundColor: "#2B6CB0", color: "#FFFFFF",
  padding: "12px 32px", borderRadius: "10px", border: "none",
  fontSize: "14px", fontWeight: 600, cursor: "pointer",
  minHeight: "44px", transition: "background-color 150ms",
  fontFamily: "Inter, sans-serif",
};
