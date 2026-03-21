"use client";

import { useState, useMemo } from "react";

// ─── Mock data generators ──────────────────────────────────────────────────────

function generateDailyCallVolume(days: number) {
  const data: { date: string; calls: number }[] = [];
  const base = new Date(2026, 2, 18); // March 18, 2026
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    // Weekdays higher, weekends lower
    const dow = d.getDay();
    const weekend = dow === 0 || dow === 6;
    const calls = weekend
      ? Math.round(20 + Math.random() * 15)
      : Math.round(55 + Math.random() * 40);
    data.push({ date: label, calls });
  }
  return data;
}

const appointmentsByDay = [
  { day: "Mon", bookings: 18 },
  { day: "Tue", bookings: 24 },
  { day: "Wed", bookings: 21 },
  { day: "Thu", bookings: 27 },
  { day: "Fri", bookings: 22 },
  { day: "Sat", bookings: 9 },
  { day: "Sun", bookings: 4 },
];

const callOutcomes = [
  { label: "Resolved", value: 58, color: "#276749" },
  { label: "Transferred", value: 27, color: "#2B6CB0" },
  { label: "Voicemail", value: 15, color: "#B7791F" },
];

// ─── SVG Line Chart ────────────────────────────────────────────────────────────

function LineChart({ data }: { data: { date: string; calls: number }[] }) {
  const W = 680, H = 200, PAD = { top: 16, right: 16, bottom: 32, left: 40 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const maxVal = Math.max(...data.map((d) => d.calls));
  const minVal = 0;

  const xScale = (i: number) => PAD.left + (i / (data.length - 1)) * chartW;
  const yScale = (v: number) => PAD.top + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;

  const polyline = data
    .map((d, i) => `${xScale(i)},${yScale(d.calls)}`)
    .join(" ");

  const area = [
    `${xScale(0)},${PAD.top + chartH}`,
    ...data.map((d, i) => `${xScale(i)},${yScale(d.calls)}`),
    `${xScale(data.length - 1)},${PAD.top + chartH}`,
  ].join(" ");

  // Show ~6 x-axis labels spaced evenly
  const step = Math.max(1, Math.floor(data.length / 6));
  const xLabels = data.filter((_, i) => i % step === 0 || i === data.length - 1);

  // Y-axis grid lines
  const yTicks = [0, 25, 50, 75, 100].filter((t) => t <= maxVal + 10);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2B6CB0" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#2B6CB0" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map((t) => (
        <g key={t}>
          <line
            x1={PAD.left} y1={yScale(t)}
            x2={W - PAD.right} y2={yScale(t)}
            stroke="#E2E8F0" strokeWidth="1"
          />
          <text x={PAD.left - 6} y={yScale(t) + 4} textAnchor="end"
            fontSize="10" fill="#A0AEC0" fontFamily="Inter, sans-serif">
            {t}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <polygon points={area} fill="url(#lineGrad)" />

      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke="#2B6CB0"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Data dots (only show a few) */}
      {data
        .filter((_, i) => i % step === 0 || i === data.length - 1)
        .map((d, idx) => {
          const origIdx = data.indexOf(d);
          return (
            <circle
              key={idx}
              cx={xScale(origIdx)}
              cy={yScale(d.calls)}
              r="4"
              fill="#2B6CB0"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          );
        })}

      {/* X axis labels */}
      {xLabels.map((d) => {
        const i = data.indexOf(d);
        return (
          <text
            key={i}
            x={xScale(i)}
            y={H - 4}
            textAnchor="middle"
            fontSize="10"
            fill="#718096"
            fontFamily="Inter, sans-serif"
          >
            {d.date}
          </text>
        );
      })}
    </svg>
  );
}

// ─── SVG Bar Chart ─────────────────────────────────────────────────────────────

function BarChart({ data }: { data: { day: string; bookings: number }[] }) {
  const W = 420, H = 200, PAD = { top: 16, right: 16, bottom: 32, left: 36 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const maxVal = Math.max(...data.map((d) => d.bookings));
  const barW = chartW / data.length - 8;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      {/* Grid lines */}
      {[0, 10, 20, 30].filter((t) => t <= maxVal + 5).map((t) => {
        const y = PAD.top + chartH - (t / maxVal) * chartH;
        return (
          <g key={t}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#E2E8F0" strokeWidth="1" />
            <text x={PAD.left - 4} y={y + 4} textAnchor="end" fontSize="10" fill="#A0AEC0" fontFamily="Inter, sans-serif">{t}</text>
          </g>
        );
      })}

      {data.map((d, i) => {
        const barH = (d.bookings / maxVal) * chartH;
        const x = PAD.left + i * (chartW / data.length) + 4;
        const y = PAD.top + chartH - barH;
        const isWeekend = d.day === "Sat" || d.day === "Sun";
        return (
          <g key={d.day}>
            <rect
              x={x} y={y}
              width={barW} height={barH}
              fill={isWeekend ? "#CBD5E0" : "#2B6CB0"}
              rx="4"
            />
            <text
              x={x + barW / 2} y={PAD.top + chartH + 14}
              textAnchor="middle" fontSize="11"
              fill="#718096" fontFamily="Inter, sans-serif"
            >
              {d.day}
            </text>
            <text
              x={x + barW / 2} y={y - 4}
              textAnchor="middle" fontSize="10"
              fill="#4A5568" fontFamily="Inter, sans-serif" fontWeight="600"
            >
              {d.bookings}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── SVG Donut Chart ──────────────────────────────────────────────────────────

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const cx = 100, cy = 100, r = 72, innerR = 44;
  const total = data.reduce((s, d) => s + d.value, 0);

  let cumAngle = -Math.PI / 2;

  const slices = data.map((d) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const ix1 = cx + innerR * Math.cos(endAngle);
    const iy1 = cy + innerR * Math.sin(endAngle);
    const ix2 = cx + innerR * Math.cos(startAngle);
    const iy2 = cy + innerR * Math.sin(startAngle);
    const largeArc = angle > Math.PI ? 1 : 0;

    const path = [
      `M ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix1} ${iy1}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2}`,
      "Z",
    ].join(" ");

    return { ...d, path };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
      <svg viewBox="0 0 200 200" style={{ width: "160px", height: "160px", flexShrink: 0 }}>
        {slices.map((s) => (
          <path key={s.label} d={s.path} fill={s.color} />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="700" fill="#1A202C" fontFamily="Plus Jakarta Sans, sans-serif">
          {total}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#718096" fontFamily="Inter, sans-serif">
          TOTAL CALLS
        </text>
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {data.map((d) => (
          <div key={d.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: d.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#2D3748", fontFamily: "Inter, sans-serif" }}>{d.label}</div>
              <div style={{ fontSize: "12px", color: "#718096", fontFamily: "Inter, sans-serif" }}>{d.value}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Range = "7" | "30" | "90";

export default function ReportsPage() {
  const [range, setRange] = useState<Range>("30");

  const callVolumeData = useMemo(() => generateDailyCallVolume(Number(range)), [range]);

  const rangeOptions: { label: string; value: Range }[] = [
    { label: "Last 7 days", value: "7" },
    { label: "Last 30 days", value: "30" },
    { label: "Last 90 days", value: "90" },
  ];

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
        {/* Page title + date range picker */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0, lineHeight: 1.25 }}>
              Performance Reports
            </h2>
            <p style={{ fontSize: "14px", color: "#718096", marginTop: "8px", marginBottom: 0 }}>
              Call performance analytics — mock/demo data
            </p>
          </div>

          {/* Date range selector */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#718096", textTransform: "uppercase", letterSpacing: "0.05em" }}>Period:</span>
            <div style={{ display: "flex", backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "10px", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
              {rangeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRange(opt.value)}
                  style={{
                    padding: "8px 16px",
                    fontSize: "13px",
                    fontWeight: 600,
                    fontFamily: "Inter, sans-serif",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: range === opt.value ? "#2B6CB0" : "transparent",
                    color: range === opt.value ? "#FFFFFF" : "#4A5568",
                    transition: "background-color 150ms, color 150ms",
                    borderRight: opt.value !== "90" ? "1px solid #E2E8F0" : "none",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Charts grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>

          {/* Line Chart — Daily Call Volume */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "24px 32px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)",
            border: "1px solid #E2E8F0",
            borderTop: "3px solid #2B6CB0",
          }}>
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0 }}>
                Daily Call Volume
              </h3>
              <p style={{ fontSize: "13px", color: "#718096", margin: "4px 0 0" }}>
                Number of calls handled per day over the selected period
              </p>
            </div>
            <LineChart data={callVolumeData} />
          </div>

          {/* Bottom row: Bar + Donut */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>

            {/* Bar Chart — Appointments by Day of Week */}
            <div style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              padding: "24px 32px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)",
              border: "1px solid #E2E8F0",
              borderTop: "3px solid #2C7A7B",
            }}>
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0 }}>
                  Appointments by Day of Week
                </h3>
                <p style={{ fontSize: "13px", color: "#718096", margin: "4px 0 0" }}>
                  Booking volume split by weekday
                </p>
              </div>
              <BarChart data={appointmentsByDay} />
              <div style={{ marginTop: "12px", display: "flex", gap: "16px", fontSize: "12px", color: "#718096" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", backgroundColor: "#2B6CB0" }} />
                  Weekday
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", backgroundColor: "#CBD5E0" }} />
                  Weekend
                </span>
              </div>
            </div>

            {/* Donut Chart — Call Outcome Distribution */}
            <div style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              padding: "24px 32px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)",
              border: "1px solid #E2E8F0",
              borderTop: "3px solid #276749",
            }}>
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1A202C", fontFamily: "Plus Jakarta Sans, sans-serif", margin: 0 }}>
                  Call Outcome Distribution
                </h3>
                <p style={{ fontSize: "13px", color: "#718096", margin: "4px 0 0" }}>
                  Breakdown of call resolutions
                </p>
              </div>
              <DonutChart data={callOutcomes} />
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
