/**
 * Pure date utility functions for the week calendar view.
 * No external dependencies — vanilla Date API only.
 */

/** Returns the Monday (start of week) for the week containing `date`. */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon, ...
  const diff = day === 0 ? -6 : 1 - day; // If Sunday, go back 6 days
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Returns Saturday (end of clinic week) for the week containing `date`. */
export function getWeekEnd(weekStart: Date): Date {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + 5); // Mon + 5 = Sat
  return d;
}

/** Returns 6 Date objects [Mon, Tue, Wed, Thu, Fri, Sat] for the given week start. */
export function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

/** Checks if two dates fall on the same calendar day. */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Checks if the given date is today. */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/** Formats a week range: "Mar 17 – 22, 2026" or "Mar 31 – Apr 5, 2026" if cross-month. */
export function formatWeekRange(weekStart: Date, weekEnd: Date): string {
  const startMonth = weekStart.toLocaleDateString("en-US", { month: "short" });
  const endMonth = weekEnd.toLocaleDateString("en-US", { month: "short" });
  const year = weekEnd.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${weekStart.getDate()} – ${weekEnd.getDate()}, ${year}`;
  }
  return `${startMonth} ${weekStart.getDate()} – ${endMonth} ${weekEnd.getDate()}, ${year}`;
}

/** Formats a day column header: "Mon 17". */
export function formatDayHeader(date: Date): { dayName: string; dayNum: number } {
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  return { dayName, dayNum: date.getDate() };
}

/** Converts an ISO timestamp to a pixel offset from the top of the time grid. */
export function timeToPixelOffset(
  isoStr: string,
  hourHeight: number,
  gridStartHour: number,
): number {
  const d = new Date(isoStr);
  const hours = d.getHours() + d.getMinutes() / 60;
  return (hours - gridStartHour) * hourHeight;
}

/** Returns the height in pixels for an appointment block based on its duration. */
export function durationToPixelHeight(
  startIso: string,
  endIso: string,
  hourHeight: number,
): number {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return Math.max(durationHours * hourHeight, hourHeight / 2); // minimum half-hour height
}
