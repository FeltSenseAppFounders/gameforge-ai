interface CalendarTimeGutterProps {
  startHour: number;
  endHour: number;
  hourHeight: number;
  /** The Monday of the currently displayed week */
  currentWeekStart: Date;
}

function formatHourLabel(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}

export function CalendarTimeGutter({
  startHour,
  endHour,
  hourHeight,
  currentWeekStart,
}: CalendarTimeGutterProps) {
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const totalHeight = (endHour - startHour) * hourHeight;

  // "Now" indicator — only show if current week contains today
  const now = new Date();
  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 5);
  const showNowLine =
    now >= currentWeekStart &&
    now <= new Date(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate(), 23, 59, 59);

  const nowOffset = showNowLine
    ? (now.getHours() + now.getMinutes() / 60 - startHour) * hourHeight
    : -1;
  const nowVisible = showNowLine && nowOffset >= 0 && nowOffset <= totalHeight;

  return (
    <div
      className="relative shrink-0 border-r border-neutral-200/60"
      style={{ width: "64px", height: `${totalHeight}px` }}
    >
      {hours.map((hour) => {
        const top = (hour - startHour) * hourHeight;
        return (
          <div
            key={hour}
            className="absolute right-0 pr-3 text-[11px] text-neutral-400 leading-none select-none"
            style={{ top: `${top}px`, transform: "translateY(-50%)" }}
          >
            {formatHourLabel(hour)}
          </div>
        );
      })}

      {/* Now indicator — current time label */}
      {nowVisible && (
        <div
          className="absolute right-0 pr-1.5 z-10"
          style={{ top: `${nowOffset}px`, transform: "translateY(-50%)" }}
        >
          <span className="text-[10px] font-semibold text-error bg-white px-1 rounded">
            {now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
          </span>
        </div>
      )}
    </div>
  );
}
