"use client";

import { useState } from "react";

const STEPS = ["Practice Info", "PMS Selection", "AI Configuration", "Team Invite"];

const PMS_OPTIONS = [
  { id: "dentrix", name: "Dentrix", description: "Henry Schein's leading practice management solution" },
  { id: "opendental", name: "OpenDental", description: "Open source dental practice management software" },
  { id: "eaglesoft", name: "Eaglesoft", description: "Patterson Dental's comprehensive practice software" },
  { id: "none", name: "None / Other", description: "I use a different system or don't have one yet" },
];

interface PracticeInfo {
  practiceName: string;
  address: string;
  phone: string;
  numProviders: string;
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [practiceInfo, setPracticeInfo] = useState<PracticeInfo>({
    practiceName: "",
    address: "",
    phone: "",
    numProviders: "",
  });
  const [selectedPMS, setSelectedPMS] = useState<string | null>(null);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiVoice, setAiVoice] = useState("natural");
  const [teamEmails, setTeamEmails] = useState("");
  const [completed, setCompleted] = useState(false);

  const totalSteps = STEPS.length;

  function handleNext() {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  function handleFinish() {
    setCompleted(true);
  }

  if (completed) {
    return (
      <main style={{ minHeight: "100vh", backgroundColor: "#F7FAFC", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
        <div style={{ maxWidth: "560px", width: "100%", backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "48px", boxShadow: "0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)", border: "1px solid #E2E8F0", textAlign: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "9999px", backgroundColor: "#F0FFF4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#276749" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: "0 0 12px" }}>
            Setup Complete!
          </h2>
          <p style={{ fontSize: "16px", color: "#718096", marginBottom: "32px", lineHeight: 1.7 }}>
            Your practice is ready to go. Here&apos;s what happens next:
          </p>
          <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
            {[
              { icon: "📞", title: "AI Voice Agent Activated", desc: "Your AI is ready to handle inbound calls 24/7." },
              { icon: "🔗", title: "PMS Integration Pending", desc: "We'll sync your patient data within 24 hours." },
              { icon: "📧", title: "Team Invites Sent", desc: "Your team will receive setup instructions via email." },
              { icon: "📊", title: "Dashboard Ready", desc: "Start monitoring calls and bookings from your dashboard." },
            ].map((item) => (
              <div key={item.title} style={{ display: "flex", gap: "16px", alignItems: "flex-start", backgroundColor: "#F7FAFC", borderRadius: "10px", padding: "16px" }}>
                <span style={{ fontSize: "20px", lineHeight: 1 }}>{item.icon}</span>
                <div>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#2D3748" }}>{item.title}</p>
                  <p style={{ margin: "2px 0 0", fontSize: "14px", color: "#718096" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <a
            href="/"
            style={{
              display: "inline-block",
              backgroundColor: "#2B6CB0",
              color: "#FFFFFF",
              padding: "12px 32px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              minHeight: "44px",
              lineHeight: "20px",
            }}
          >
            Go to Dashboard
          </a>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#F7FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#2D3748", padding: "16px 32px", display: "flex", alignItems: "center" }}>
        <h1 style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: 600, fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0 }}>
          VoiceAI — Practice Setup
        </h1>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 32px" }}>
        {/* Step Progress Indicator */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#718096" }}>
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#2B6CB0" }}>
              {STEPS[currentStep]}
            </span>
          </div>
          {/* Progress bar */}
          <div style={{ height: "6px", backgroundColor: "#E2E8F0", borderRadius: "9999px", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                borderRadius: "9999px",
                backgroundColor: "#2B6CB0",
                width: `${((currentStep + 1) / totalSteps) * 100}%`,
                transition: "width 300ms ease",
              }}
            />
          </div>
          {/* Step labels */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
            {STEPS.map((step, idx) => (
              <span
                key={step}
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: idx <= currentStep ? "#2B6CB0" : "#A0AEC0",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "40px", boxShadow: "0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)", border: "1px solid #E2E8F0" }}>
          {currentStep === 0 && (
            <StepPracticeInfo data={practiceInfo} onChange={setPracticeInfo} />
          )}
          {currentStep === 1 && (
            <StepPMSSelection selected={selectedPMS} onSelect={setSelectedPMS} />
          )}
          {currentStep === 2 && (
            <StepAIConfiguration aiEnabled={aiEnabled} setAiEnabled={setAiEnabled} aiVoice={aiVoice} setAiVoice={setAiVoice} />
          )}
          {currentStep === 3 && (
            <StepTeamInvite emails={teamEmails} setEmails={setTeamEmails} onFinish={handleFinish} />
          )}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "40px", paddingTop: "32px", borderTop: "1px solid #E2E8F0" }}>
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #CBD5E0",
                color: currentStep === 0 ? "#A0AEC0" : "#2B6CB0",
                padding: "12px 24px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: currentStep === 0 ? "default" : "pointer",
                minHeight: "44px",
              }}
            >
              Back
            </button>
            {currentStep < totalSteps - 1 ? (
              <button
                onClick={handleNext}
                style={{
                  backgroundColor: "#2B6CB0",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "12px 32px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  minHeight: "44px",
                }}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleFinish}
                style={{
                  backgroundColor: "#276749",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "12px 32px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  minHeight: "44px",
                }}
              >
                Finish Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function StepPracticeInfo({ data, onChange }: { data: PracticeInfo; onChange: (d: PracticeInfo) => void }) {
  return (
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: "0 0 8px" }}>
        Practice Information
      </h2>
      <p style={{ fontSize: "14px", color: "#718096", marginBottom: "32px" }}>
        Tell us about your dental practice to personalize your setup.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <InputField
          label="Practice Name"
          value={data.practiceName}
          onChange={(v) => onChange({ ...data, practiceName: v })}
          placeholder="e.g. Sunshine Family Dentistry"
        />
        <InputField
          label="Address"
          value={data.address}
          onChange={(v) => onChange({ ...data, address: v })}
          placeholder="e.g. 123 Main St, Austin, TX 78701"
        />
        <InputField
          label="Phone Number"
          value={data.phone}
          onChange={(v) => onChange({ ...data, phone: v })}
          placeholder="e.g. (512) 555-0100"
          type="tel"
        />
        <InputField
          label="Number of Providers"
          value={data.numProviders}
          onChange={(v) => onChange({ ...data, numProviders: v })}
          placeholder="e.g. 3"
          type="number"
        />
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "14px", fontWeight: 600, color: "#2D3748" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #CBD5E0",
          borderRadius: "10px",
          padding: "10px 14px",
          fontSize: "16px",
          color: "#1A202C",
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function StepPMSSelection({ selected, onSelect }: { selected: string | null; onSelect: (id: string) => void }) {
  return (
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: "0 0 8px" }}>
        Practice Management Software
      </h2>
      <p style={{ fontSize: "14px", color: "#718096", marginBottom: "32px" }}>
        Select your current PMS so we can set up the integration.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {PMS_OPTIONS.map((pms) => {
          const isSelected = selected === pms.id;
          return (
            <div
              key={pms.id}
              onClick={() => onSelect(pms.id)}
              style={{
                border: `2px solid ${isSelected ? "#2B6CB0" : "#E2E8F0"}`,
                borderRadius: "10px",
                padding: "20px 24px",
                cursor: "pointer",
                backgroundColor: isSelected ? "#EBF8FF" : "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 200ms ease",
                boxShadow: isSelected ? "0 0 0 3px rgba(43,108,176,0.15)" : "none",
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#1A202C" }}>{pms.name}</p>
                <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#718096" }}>{pms.description}</p>
              </div>
              <div style={{
                width: "20px", height: "20px", borderRadius: "9999px",
                border: `2px solid ${isSelected ? "#2B6CB0" : "#CBD5E0"}`,
                backgroundColor: isSelected ? "#2B6CB0" : "#FFFFFF",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginLeft: "16px",
              }}>
                {isSelected && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepAIConfiguration({ aiEnabled, setAiEnabled, aiVoice, setAiVoice }: {
  aiEnabled: boolean;
  setAiEnabled: (v: boolean) => void;
  aiVoice: string;
  setAiVoice: (v: string) => void;
}) {
  return (
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: "0 0 8px" }}>
        AI Configuration
      </h2>
      <p style={{ fontSize: "14px", color: "#718096", marginBottom: "32px" }}>
        Configure how your AI voice agent will interact with patients.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", backgroundColor: "#F7FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
          <div>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#1A202C" }}>Enable AI Voice Agent</p>
            <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#718096" }}>Handle inbound calls automatically 24/7</p>
          </div>
          <button
            onClick={() => setAiEnabled(!aiEnabled)}
            style={{
              width: "48px", height: "26px", borderRadius: "9999px",
              backgroundColor: aiEnabled ? "#2B6CB0" : "#CBD5E0",
              border: "none", cursor: "pointer", position: "relative", transition: "background-color 200ms",
              flexShrink: 0,
            }}
          >
            <div style={{
              position: "absolute", top: "3px",
              left: aiEnabled ? "25px" : "3px",
              width: "20px", height: "20px",
              borderRadius: "9999px", backgroundColor: "#FFFFFF",
              transition: "left 200ms",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }} />
          </button>
        </div>

        {/* Voice style */}
        <div>
          <label style={{ fontSize: "14px", fontWeight: 600, color: "#2D3748", display: "block", marginBottom: "12px" }}>
            Voice Style
          </label>
          <div style={{ display: "flex", gap: "12px" }}>
            {["natural", "professional", "friendly"].map((v) => (
              <button
                key={v}
                onClick={() => setAiVoice(v)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "10px",
                  border: `2px solid ${aiVoice === v ? "#2B6CB0" : "#E2E8F0"}`,
                  backgroundColor: aiVoice === v ? "#EBF8FF" : "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: aiVoice === v ? "#2B6CB0" : "#4A5568",
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Info badge */}
        <div style={{ display: "flex", gap: "12px", backgroundColor: "#EBF8FF", borderRadius: "10px", padding: "16px", border: "1px solid #BEE3F8" }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#2B6CB0" strokeWidth={2} style={{ flexShrink: 0, marginTop: "1px" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p style={{ margin: 0, fontSize: "14px", color: "#2B6CB0", lineHeight: 1.6 }}>
            You can fine-tune these settings anytime from the AI Voice Settings page.
          </p>
        </div>
      </div>
    </div>
  );
}

function StepTeamInvite({ emails, setEmails, onFinish }: {
  emails: string;
  setEmails: (v: string) => void;
  onFinish: () => void;
}) {
  return (
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: "0 0 8px" }}>
        Invite Your Team
      </h2>
      <p style={{ fontSize: "14px", color: "#718096", marginBottom: "32px" }}>
        Add team members to your practice account. You can always do this later.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "24px" }}>
        <label style={{ fontSize: "14px", fontWeight: 600, color: "#2D3748" }}>Team Email Addresses</label>
        <textarea
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          placeholder="Enter email addresses, one per line&#10;e.g. sarah@yourpractice.com&#10;mike@yourpractice.com"
          rows={5}
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #CBD5E0",
            borderRadius: "10px",
            padding: "10px 14px",
            fontSize: "16px",
            color: "#1A202C",
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
            resize: "vertical",
            fontFamily: "Inter, sans-serif",
          }}
        />
        <p style={{ margin: 0, fontSize: "12px", color: "#A0AEC0" }}>
          Team members will receive an invite email with setup instructions.
        </p>
      </div>
      <div style={{ backgroundColor: "#F0FFF4", borderRadius: "10px", padding: "16px", border: "1px solid #C6F6D5" }}>
        <p style={{ margin: 0, fontSize: "14px", color: "#276749", fontWeight: 600, marginBottom: "8px" }}>
          Almost done!
        </p>
        <p style={{ margin: 0, fontSize: "14px", color: "#276749", lineHeight: 1.6 }}>
          Click &quot;Finish Setup&quot; below to complete your onboarding and go live.
        </p>
      </div>
    </div>
  );
}
