import type { AppointmentRow } from "./AppointmentsList";

// ─── Provider color palette (all dark enough for white text) ────
export const PROVIDER_COLORS = [
  { bg: "bg-primary", bgHover: "hover:bg-primary-dark", dot: "bg-primary" },
  { bg: "bg-secondary-dark", bgHover: "hover:bg-secondary-dark/90", dot: "bg-secondary-dark" },
  { bg: "bg-success", bgHover: "hover:bg-success/90", dot: "bg-success" },
  { bg: "bg-warning", bgHover: "hover:bg-warning/90", dot: "bg-warning" },
  { bg: "bg-primary-dark", bgHover: "hover:bg-primary-dark/90", dot: "bg-primary-dark" },
  { bg: "bg-error", bgHover: "hover:bg-error/90", dot: "bg-error" },
] as const;

export type ProviderColor = (typeof PROVIDER_COLORS)[number];

// ─── Helpers ────────────────────────────────────────────────────

function formatBlockTime(isoStr: string): string {
  const d = new Date(isoStr);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function getPatientShort(row: AppointmentRow): string {
  return `${row.patients.first_name.charAt(0)}. ${row.patients.last_name}`;
}

function getPatientFull(row: AppointmentRow): string {
  return `${row.patients.first_name} ${row.patients.last_name}`;
}

function getProviderName(row: AppointmentRow): string {
  if (!row.providers) return "";
  const { title, first_name, last_name } = row.providers;
  return title ? `${title} ${first_name} ${last_name}` : `${first_name} ${last_name}`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── Component ──────────────────────────────────────────────────

interface CalendarAppointmentBlockProps {
  appointment: AppointmentRow;
  top: number;
  height: number;
  left: string;
  width: string;
  color: ProviderColor;
}

export function CalendarAppointmentBlock({
  appointment,
  top,
  height,
  left,
  width,
  color,
}: CalendarAppointmentBlockProps) {
  const isFaded = appointment.status === "cancelled" || appointment.status === "no_show";
  const timeRange = `${formatBlockTime(appointment.start_time)} – ${formatBlockTime(appointment.end_time)}`;

  // Tooltip
  const tooltipLines = [
    getPatientFull(appointment),
    appointment.patients.phone ?? "",
    capitalize(appointment.appointment_type),
    getProviderName(appointment),
    timeRange,
    capitalize(appointment.status.replace("_", " ")),
  ].filter(Boolean);

  // Adaptive content based on block height
  const isCompact = height < 38;
  const isMedium = height >= 38 && height < 60;

  return (
    <div
      className={`absolute rounded-md overflow-hidden cursor-default
        shadow-sm transition-all duration-150 hover:shadow-lg hover:z-10 hover:brightness-110
        ${color.bg} ${color.bgHover}
        ${isFaded ? "opacity-40 grayscale-[40%]" : ""}`}
      style={{
        top: `${top}px`,
        height: `${Math.max(height, 22)}px`,
        left,
        width,
      }}
      title={tooltipLines.join("\n")}
    >
      <div className="px-2.5 py-1.5 h-full overflow-hidden">
        {isCompact ? (
          /* ── Short: single line ── */
          <div className="flex items-center gap-1.5 h-full">
            <p className="text-[11px] font-semibold text-white truncate leading-none">
              <span className={isFaded ? "line-through" : ""}>{getPatientShort(appointment)}</span>
            </p>
            <span className="text-[10px] text-white truncate leading-none">
              {capitalize(appointment.appointment_type)}
            </span>
          </div>
        ) : isMedium ? (
          /* ── Medium: two lines ── */
          <div className="flex flex-col justify-center gap-0.5 h-full">
            <p className={`text-xs font-bold text-white truncate leading-tight ${isFaded ? "line-through" : ""}`}>
              {getPatientFull(appointment)}
            </p>
            <p className="text-[11px] text-white truncate leading-tight">
              {capitalize(appointment.appointment_type)} · {formatBlockTime(appointment.start_time)}
            </p>
          </div>
        ) : (
          /* ── Large: three lines ── */
          <div className="flex flex-col gap-0.5">
            <p className={`text-xs font-bold text-white truncate leading-tight ${isFaded ? "line-through" : ""}`}>
              {getPatientFull(appointment)}
            </p>
            <p className="text-[11px] text-white truncate leading-tight">
              {capitalize(appointment.appointment_type)}
              {getProviderName(appointment) ? ` · ${getProviderName(appointment)}` : ""}
            </p>
            <p className="text-[11px] text-white/95 truncate leading-tight">{timeRange}</p>
          </div>
        )}
      </div>
    </div>
  );
}
