"use client";

import { useState, useMemo, useCallback } from "react";
import type { AppointmentRow } from "./AppointmentsList";
import {
  getWeekStart,
  getWeekDays,
  isSameDay,
  isToday,
  formatDayHeader,
} from "./calendar-utils";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarTimeGutter } from "./CalendarTimeGutter";
import { CalendarDayColumn } from "./CalendarDayColumn";
import { PROVIDER_COLORS, type ProviderColor } from "./CalendarAppointmentBlock";

// ─── Constants ──────────────────────────────────────────────────

const HOUR_HEIGHT = 64; // px per hour
const DEFAULT_START_HOUR = 8;   // 8 AM
const DEFAULT_END_HOUR = 18;    // 6 PM

// ─── Component ──────────────────────────────────────────────────

interface CalendarWeekViewProps {
  appointments: AppointmentRow[];
}

export function CalendarWeekView({ appointments }: CalendarWeekViewProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart(new Date()));

  const weekDays = useMemo(() => getWeekDays(currentWeekStart), [currentWeekStart]);

  // Navigation
  const goToPrevWeek = useCallback(() => {
    setCurrentWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  }, []);

  const goToNextWeek = useCallback(() => {
    setCurrentWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  }, []);

  const goToToday = useCallback(() => {
    setCurrentWeekStart(getWeekStart(new Date()));
  }, []);

  // Group appointments by day
  const appointmentsByDay = useMemo(() => {
    const map = new Map<number, AppointmentRow[]>();
    for (let i = 0; i < weekDays.length; i++) {
      map.set(i, []);
    }
    for (const appt of appointments) {
      const apptDate = new Date(appt.start_time);
      for (let i = 0; i < weekDays.length; i++) {
        if (isSameDay(apptDate, weekDays[i])) {
          map.get(i)!.push(appt);
          break;
        }
      }
    }
    return map;
  }, [appointments, weekDays]);

  // Compute dynamic grid range from this week's appointments
  const { startHour, endHour } = useMemo(() => {
    let earliest = DEFAULT_START_HOUR;
    let latest = DEFAULT_END_HOUR;
    for (const [, dayAppts] of appointmentsByDay) {
      for (const appt of dayAppts) {
        const s = new Date(appt.start_time);
        const e = new Date(appt.end_time);
        const sHour = s.getHours();
        const eHour = e.getHours() + (e.getMinutes() > 0 ? 1 : 0);
        if (sHour < earliest) earliest = sHour;
        if (eHour > latest) latest = eHour;
      }
    }
    return { startHour: earliest, endHour: latest };
  }, [appointmentsByDay]);

  // Build stable provider → color mapping
  const providerColorMap = useMemo(() => {
    const map = new Map<string, ProviderColor>();
    const seen = new Set<string>();
    for (const appt of appointments) {
      const ref = appt.provider_ref ?? "";
      if (ref && !seen.has(ref)) {
        seen.add(ref);
        map.set(ref, PROVIDER_COLORS[seen.size - 1] ?? PROVIDER_COLORS[0]);
      }
    }
    return map;
  }, [appointments]);

  // Provider legend (only providers with appointments this week)
  const weekProviders = useMemo(() => {
    const seen = new Map<string, { name: string; color: ProviderColor }>();
    for (const [, dayAppts] of appointmentsByDay) {
      for (const appt of dayAppts) {
        const ref = appt.provider_ref ?? "";
        if (ref && !seen.has(ref) && appt.providers) {
          const { title, first_name, last_name } = appt.providers;
          const name = title ? `${title} ${first_name} ${last_name}` : `${first_name} ${last_name}`;
          seen.set(ref, { name, color: providerColorMap.get(ref) ?? PROVIDER_COLORS[0] });
        }
      }
    }
    return Array.from(seen.values());
  }, [appointmentsByDay, providerColorMap]);

  // Count appointments this week
  const weekAppointmentCount = useMemo(() => {
    let count = 0;
    for (const [, dayAppts] of appointmentsByDay) {
      count += dayAppts.length;
    }
    return count;
  }, [appointmentsByDay]);

  const totalHeight = (endHour - startHour) * HOUR_HEIGHT;

  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
      {/* Header: navigation + week range */}
      <div className="px-5 pt-5 pb-1">
        <CalendarHeader
          weekStart={currentWeekStart}
          onPrevWeek={goToPrevWeek}
          onNextWeek={goToNextWeek}
          onToday={goToToday}
        />
      </div>

      {/* Provider legend + week stats */}
      <div className="flex items-center justify-between px-5 pb-4 flex-wrap gap-2">
        {weekProviders.length > 0 ? (
          <div className="flex items-center gap-4 flex-wrap">
            {weekProviders.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${p.color.dot}`} />
                <span className="text-xs text-neutral-500 font-medium">{p.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div />
        )}
        <span className="text-xs text-neutral-400">
          {weekAppointmentCount} appointment{weekAppointmentCount !== 1 ? "s" : ""} this week
        </span>
      </div>

      {/* Day column headers */}
      <div className="flex border-t border-b border-neutral-200 bg-neutral-50/50">
        {/* Gutter spacer */}
        <div className="shrink-0 border-r border-neutral-200/60" style={{ width: "64px" }} />

        {/* Day headers */}
        {weekDays.map((day, i) => {
          const { dayName, dayNum } = formatDayHeader(day);
          const today = isToday(day);
          const dayAppts = appointmentsByDay.get(i) ?? [];
          return (
            <div
              key={i}
              className={`flex-1 min-w-0 text-center py-3 border-l border-neutral-200/60
                ${today ? "bg-primary/[0.03]" : ""}`}
            >
              <p className={`text-[11px] font-semibold uppercase tracking-wider ${today ? "text-primary" : "text-neutral-400"}`}>
                {dayName}
              </p>
              <div className="flex items-center justify-center mt-1 gap-1.5">
                <span
                  className={`inline-flex items-center justify-center text-sm font-semibold leading-none
                    ${
                      today
                        ? "bg-primary text-white w-7 h-7 rounded-full"
                        : "text-neutral-700"
                    }`}
                >
                  {dayNum}
                </span>
                {dayAppts.length > 0 && (
                  <span className={`text-[10px] font-medium ${today ? "text-primary/60" : "text-neutral-300"}`}>
                    · {dayAppts.length}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scrollable grid area */}
      <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 360px)" }}>
        <div className="flex" style={{ height: `${totalHeight}px` }}>
          {/* Time gutter */}
          <CalendarTimeGutter
            startHour={startHour}
            endHour={endHour}
            hourHeight={HOUR_HEIGHT}
            currentWeekStart={currentWeekStart}
          />

          {/* Day columns */}
          {weekDays.map((day, i) => (
            <div key={i} className="flex-1 min-w-0 border-l border-neutral-200/60">
              <CalendarDayColumn
                date={day}
                appointments={appointmentsByDay.get(i) ?? []}
                hourHeight={HOUR_HEIGHT}
                startHour={startHour}
                endHour={endHour}
                providerColorMap={providerColorMap}
                defaultColor={PROVIDER_COLORS[0]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
