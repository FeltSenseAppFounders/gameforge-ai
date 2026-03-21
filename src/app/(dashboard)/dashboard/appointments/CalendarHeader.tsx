import { formatWeekRange, getWeekEnd, getWeekStart, isSameDay } from "./calendar-utils";

interface CalendarHeaderProps {
  weekStart: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  weekStart,
  onPrevWeek,
  onNextWeek,
  onToday,
}: CalendarHeaderProps) {
  const weekEnd = getWeekEnd(weekStart);
  const todayWeekStart = getWeekStart(new Date());
  const isCurrentWeek = isSameDay(weekStart, todayWeekStart);

  return (
    <div className="flex items-center justify-between mb-4">
      {/* Left: week range label */}
      <h2 className="text-lg font-semibold font-heading text-neutral-800 tracking-tight">
        {formatWeekRange(weekStart, weekEnd)}
      </h2>

      {/* Right: navigation */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onToday}
          className={`px-3.5 py-1.5 rounded-md text-sm font-semibold transition-all duration-150
            ${
              isCurrentWeek
                ? "border border-neutral-200 text-neutral-300 cursor-default"
                : "border border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 active:bg-neutral-100"
            }`}
          disabled={isCurrentWeek}
        >
          Today
        </button>

        <div className="flex items-center bg-neutral-50 rounded-md border border-neutral-200">
          <button
            onClick={onPrevWeek}
            className="p-1.5 rounded-l-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors duration-150"
            aria-label="Previous week"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="w-px h-5 bg-neutral-200" />
          <button
            onClick={onNextWeek}
            className="p-1.5 rounded-r-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors duration-150"
            aria-label="Next week"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
