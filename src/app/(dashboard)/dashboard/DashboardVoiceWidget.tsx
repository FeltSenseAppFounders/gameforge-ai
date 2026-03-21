"use client";

import dynamic from "next/dynamic";

const VoiceAgent = dynamic(
  () =>
    import("@/features/voice-agent/VoiceAgent").then((m) => ({
      default: m.VoiceAgent,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center gap-8">
        <div className="w-24 h-24 rounded-full bg-neutral-100 animate-pulse" />
        <div className="h-4 w-32 bg-neutral-100 rounded animate-pulse" />
      </div>
    ),
  }
);

interface DashboardVoiceWidgetProps {
  clinicId?: string;
}

export function DashboardVoiceWidget({ clinicId }: DashboardVoiceWidgetProps) {
  return (
    <div data-tour="voice-widget" className="mt-8 mb-6 bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-200 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-800">Talk to Sarah</h2>
            <p className="text-xs text-neutral-500">AI Dental Receptionist — can check availability and book appointments</p>
          </div>
        </div>
      </div>
      <div className="p-8 flex justify-center">
        <VoiceAgent clinicId={clinicId} />
      </div>
    </div>
  );
}
