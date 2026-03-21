import type { AppointmentRow } from "./AppointmentsList";
import { timeToPixelOffset, durationToPixelHeight, isToday } from "./calendar-utils";
import { CalendarAppointmentBlock, type ProviderColor } from "./CalendarAppointmentBlock";

// ─── Overlap detection ──────────────────────────────────────────

interface PositionedAppointment {
  appointment: AppointmentRow;
  column: number;
  totalColumns: number;
}

/**
 * Assigns column positions to overlapping appointments.
 * Appointments that overlap in time get placed side-by-side.
 */
function layoutAppointments(appointments: AppointmentRow[]): PositionedAppointment[] {
  if (appointments.length === 0) return [];

  // Sort by start time, then by end time (longer first)
  const sorted = [...appointments].sort((a, b) => {
    const startDiff = new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    if (startDiff !== 0) return startDiff;
    return new Date(b.end_time).getTime() - new Date(a.end_time).getTime();
  });

  // Track column assignments
  const columns: { end: number; items: AppointmentRow[] }[] = [];
  const columnMap = new Map<string, number>(); // appointment id → column index

  for (const appt of sorted) {
    const start = new Date(appt.start_time).getTime();
    const end = new Date(appt.end_time).getTime();

    // Find the first column where this appointment doesn't overlap
    let placed = false;
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].end <= start) {
        columns[i].end = end;
        columns[i].items.push(appt);
        columnMap.set(appt.id, i);
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push({ end, items: [appt] });
      columnMap.set(appt.id, columns.length - 1);
    }
  }

  // Now determine totalColumns for each overlap group
  // Simple approach: for each appointment, count how many columns are active at its start time
  const result: PositionedAppointment[] = [];

  for (const appt of sorted) {
    const start = new Date(appt.start_time).getTime();
    const end = new Date(appt.end_time).getTime();

    // Count overlapping appointments at this time
    let maxConcurrent = 1;
    for (const other of sorted) {
      if (other.id === appt.id) continue;
      const otherStart = new Date(other.start_time).getTime();
      const otherEnd = new Date(other.end_time).getTime();
      if (otherStart < end && otherEnd > start) {
        maxConcurrent++;
      }
    }

    result.push({
      appointment: appt,
      column: columnMap.get(appt.id) ?? 0,
      totalColumns: Math.max(maxConcurrent, columns.length),
    });
  }

  return result;
}

// ─── Component ──────────────────────────────────────────────────

interface CalendarDayColumnProps {
  date: Date;
  appointments: AppointmentRow[];
  hourHeight: number;
  startHour: number;
  endHour: number;
  providerColorMap: Map<string, ProviderColor>;
  defaultColor: ProviderColor;
}

export function CalendarDayColumn({
  date,
  appointments,
  hourHeight,
  startHour,
  endHour,
  providerColorMap,
  defaultColor,
}: CalendarDayColumnProps) {
  const totalHours = endHour - startHour;
  const totalHeight = totalHours * hourHeight;
  const today = isToday(date);
  const positioned = layoutAppointments(appointments);

  // "Now" line for today
  const now = new Date();
  const nowOffset = today
    ? (now.getHours() + now.getMinutes() / 60 - startHour) * hourHeight
    : -1;
  const showNowLine = today && nowOffset >= 0 && nowOffset <= totalHeight;

  return (
    <div
      className={`relative flex-1 min-w-0 ${today ? "bg-primary/[0.03]" : ""}`}
      style={{ height: `${totalHeight}px` }}
    >
      {/* Hour grid lines */}
      {Array.from({ length: totalHours }, (_, i) => (
        <div key={`hour-${i}`}>
          {/* Full hour line */}
          <div
            className="absolute left-0 right-0 border-t border-neutral-200/60"
            style={{ top: `${i * hourHeight}px` }}
          />
          {/* Half hour line */}
          <div
            className="absolute left-0 right-0 border-t border-neutral-100/80 border-dashed"
            style={{ top: `${i * hourHeight + hourHeight / 2}px` }}
          />
        </div>
      ))}

      {/* Bottom line */}
      <div
        className="absolute left-0 right-0 border-t border-neutral-200/60"
        style={{ top: `${totalHeight}px` }}
      />

      {/* "Now" indicator line */}
      {showNowLine && (
        <>
          <div
            className="absolute left-0 w-2.5 h-2.5 rounded-full bg-error z-20 pointer-events-none"
            style={{ top: `${nowOffset}px`, transform: "translateY(-50%) translateX(-50%)" }}
          />
          <div
            className="absolute left-0 right-0 h-[2px] bg-error/80 z-20 pointer-events-none"
            style={{ top: `${nowOffset}px`, transform: "translateY(-50%)" }}
          />
        </>
      )}

      {/* Appointment blocks */}
      <div className="absolute inset-0 px-0.5">
        {positioned.map(({ appointment, column, totalColumns }) => {
          const top = timeToPixelOffset(appointment.start_time, hourHeight, startHour);
          const height = durationToPixelHeight(appointment.start_time, appointment.end_time, hourHeight);
          const color = providerColorMap.get(appointment.provider_ref ?? "") ?? defaultColor;

          const gap = 3;
          const colWidth = 100 / totalColumns;
          const leftPct = column * colWidth;

          return (
            <CalendarAppointmentBlock
              key={appointment.id}
              appointment={appointment}
              top={top}
              height={height}
              left={`calc(${leftPct}% + ${gap / 2}px)`}
              width={`calc(${colWidth}% - ${gap}px)`}
              color={color}
            />
          );
        })}
      </div>
    </div>
  );
}
