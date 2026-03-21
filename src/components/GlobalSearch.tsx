"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const mockData = {
  patients: [
    { id: "p1", name: "Jane Smith", phone: "(555) 234-5678", dob: "1985-03-12" },
    { id: "p2", name: "Robert Chen", phone: "(555) 876-5432", dob: "1972-07-24" },
    { id: "p3", name: "Maria Garcia", phone: "(555) 345-6789", dob: "1990-11-05" },
    { id: "p4", name: "David Kim", phone: "(555) 456-7890", dob: "1968-02-19" },
    { id: "p5", name: "Susan Lee", phone: "(555) 567-8901", dob: "1995-09-30" },
    { id: "p6", name: "James Wilson", phone: "(555) 678-9012", dob: "1980-06-14" },
  ],
  calls: [
    { id: "c1", patient: "Jane Smith", date: "Mar 18, 2026", outcome: "Appointment booked", duration: "4m 12s" },
    { id: "c2", patient: "Robert Chen", date: "Mar 18, 2026", outcome: "Insurance verified", duration: "6m 45s" },
    { id: "c3", patient: "David Kim", date: "Mar 17, 2026", outcome: "Transferred to billing", duration: "3m 20s" },
    { id: "c4", patient: "Maria Garcia", date: "Mar 17, 2026", outcome: "Voicemail left", duration: "1m 05s" },
    { id: "c5", patient: "Susan Lee", date: "Mar 16, 2026", outcome: "Reminder confirmed", duration: "2m 30s" },
  ],
  appointments: [
    { id: "a1", patient: "Jane Smith", date: "Mar 20, 2026", time: "10:00 AM", type: "General Checkup" },
    { id: "a2", patient: "Susan Lee", date: "Mar 19, 2026", time: "10:00 AM", type: "Follow-up" },
    { id: "a3", patient: "James Wilson", date: "Mar 21, 2026", time: "2:30 PM", type: "Dental Cleaning" },
    { id: "a4", patient: "Maria Garcia", date: "Mar 22, 2026", time: "11:15 AM", type: "Consultation" },
    { id: "a5", patient: "Robert Chen", date: "Mar 25, 2026", time: "9:00 AM", type: "Insurance Review" },
  ],
  campaigns: [
    { id: "camp1", name: "Spring Recall Campaign", status: "Active", reach: 240 },
    { id: "camp2", name: "Flu Shot Reminder", status: "Active", reach: 180 },
    { id: "camp3", name: "New Patient Outreach", status: "Paused", reach: 95 },
    { id: "camp4", name: "Insurance Renewal Alerts", status: "Completed", reach: 320 },
  ],
};

type SearchResult = {
  category: "Patients" | "Calls" | "Appointments" | "Campaigns";
  id: string;
  primary: string;
  secondary: string;
};

function search(query: string): SearchResult[] {
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  mockData.patients.forEach((p) => {
    if (p.name.toLowerCase().includes(q) || p.phone.includes(q)) {
      results.push({ category: "Patients", id: p.id, primary: p.name, secondary: p.phone });
    }
  });

  mockData.calls.forEach((c) => {
    if (c.patient.toLowerCase().includes(q) || c.outcome.toLowerCase().includes(q) || c.date.toLowerCase().includes(q)) {
      results.push({ category: "Calls", id: c.id, primary: `${c.patient} — ${c.date}`, secondary: c.outcome });
    }
  });

  mockData.appointments.forEach((a) => {
    if (a.patient.toLowerCase().includes(q) || a.type.toLowerCase().includes(q) || a.date.toLowerCase().includes(q)) {
      results.push({ category: "Appointments", id: a.id, primary: `${a.patient} — ${a.date} ${a.time}`, secondary: a.type });
    }
  });

  mockData.campaigns.forEach((camp) => {
    if (camp.name.toLowerCase().includes(q) || camp.status.toLowerCase().includes(q)) {
      results.push({ category: "Campaigns", id: camp.id, primary: camp.name, secondary: `${camp.status} · ${camp.reach} contacts` });
    }
  });

  return results;
}

const categoryIcons: Record<string, string> = {
  Patients: "👤",
  Calls: "📞",
  Appointments: "📅",
  Campaigns: "📣",
};

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.length >= 2 ? search(query) : [];

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  const openSearch = useCallback(() => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          closeSearch();
        } else {
          openSearch();
        }
      }
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, openSearch, closeSearch]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, closeSearch]);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {/* Search trigger button */}
      <button
        onClick={openSearch}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "10px",
          padding: "8px 14px",
          color: "#A0AEC0",
          fontSize: "14px",
          cursor: "pointer",
          minWidth: "220px",
          transition: "background-color 150ms",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span style={{ flex: 1, textAlign: "left" }}>Search…</span>
        <span style={{ fontSize: "11px", backgroundColor: "rgba(255,255,255,0.15)", padding: "2px 6px", borderRadius: "4px", letterSpacing: "0.02em" }}>
          ⌘K
        </span>
      </button>

      {/* Search overlay */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            backgroundColor: "rgba(26,32,44,0.6)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "80px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeSearch(); }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.10), 0 32px 64px rgba(0,0,0,0.07)",
              width: "100%",
              maxWidth: "560px",
              overflow: "hidden",
              margin: "0 16px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px", borderBottom: "1px solid #E2E8F0" }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#A0AEC0" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search patients, calls, appointments, campaigns…"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: "16px",
                  color: "#1A202C",
                  backgroundColor: "transparent",
                  fontFamily: "Inter, sans-serif",
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#A0AEC0", padding: "2px", lineHeight: 1 }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Results */}
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {query.length < 2 && (
                <div style={{ padding: "32px 20px", textAlign: "center", color: "#A0AEC0", fontSize: "14px" }}>
                  Type at least 2 characters to search
                </div>
              )}

              {query.length >= 2 && results.length === 0 && (
                <div style={{ padding: "32px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔍</div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#2D3748", margin: "0 0 4px" }}>No results found</p>
                  <p style={{ fontSize: "14px", color: "#A0AEC0", margin: 0 }}>
                    No matches for &quot;{query}&quot;
                  </p>
                </div>
              )}

              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <div style={{ padding: "8px 20px 4px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#718096", backgroundColor: "#F7FAFC" }}>
                    {categoryIcons[category]} {category}
                  </div>
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={closeSearch}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        width: "100%",
                        padding: "10px 20px",
                        background: "none",
                        border: "none",
                        borderBottom: "1px solid #E2E8F0",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background-color 100ms",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#EDF2F7")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#2D3748" }}>{item.primary}</span>
                      <span style={{ fontSize: "12px", color: "#718096", marginTop: "2px" }}>{item.secondary}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Footer hint */}
            {query.length >= 2 && results.length > 0 && (
              <div style={{ padding: "10px 20px", borderTop: "1px solid #E2E8F0", display: "flex", gap: "16px", fontSize: "12px", color: "#A0AEC0", backgroundColor: "#F7FAFC" }}>
                <span>↵ to select</span>
                <span>ESC to close</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
