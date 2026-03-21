import type { Metadata } from "next";
import { VoiceTestClient } from "./VoiceTestClient";

export const metadata: Metadata = {
  title: "Schedule an Appointment — FeltSense Clinic",
  description: "Schedule your dental appointment with our AI receptionist",
};

export default function VoiceTestPage() {
  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          AI Receptionist
        </div>
        <h1 className="text-3xl font-bold font-heading text-neutral-800 mb-2">
          Schedule an Appointment
        </h1>
        <p className="text-base text-neutral-500 max-w-md">
          Speak with Sarah, our AI dental receptionist, to book your next
          appointment in seconds.
        </p>
      </div>

      {/* Voice agent card */}
      <div className="w-full max-w-md bg-white rounded-lg border border-neutral-200 shadow-md p-8">
        <VoiceTestClient />
      </div>

      {/* Instructions */}
      <div className="mt-8 max-w-md w-full">
        <h4 className="text-sm font-semibold text-neutral-700 mb-3">
          How it works
        </h4>
        <ol className="space-y-2 text-sm text-neutral-500">
          <li className="flex gap-2">
            <span className="text-primary font-semibold">1.</span>
            Click &ldquo;Start Conversation&rdquo; and allow microphone access
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-semibold">2.</span>
            Tell Sarah what you need — a cleaning, checkup, or consultation
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-semibold">3.</span>
            She&rsquo;ll find an available time and book it for you
          </li>
        </ol>
      </div>
    </main>
  );
}
