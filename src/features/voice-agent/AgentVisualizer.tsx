"use client";

import {
  BarVisualizer,
  useVoiceAssistant,
} from "@livekit/components-react";

const stateLabels: Record<string, string> = {
  disconnected: "Disconnected",
  connecting: "Connecting...",
  initializing: "Starting up...",
  listening: "Listening",
  thinking: "Thinking...",
  speaking: "Speaking",
};

export function AgentVisualizer() {
  const { state, audioTrack } = useVoiceAssistant();

  const isActive = state === "listening" || state === "thinking" || state === "speaking";
  const label = stateLabels[state] ?? state;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Visualizer orb container */}
      <div
        className={`relative flex items-center justify-center w-48 h-48 rounded-full transition-all duration-500 ${
          isActive
            ? "bg-gradient-to-br from-primary/10 to-accent/10 ring-2 ring-primary/20"
            : "bg-neutral-100 ring-1 ring-neutral-200"
        }`}
      >
        {/* Inner glow when active */}
        {isActive && (
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/5 to-accent/5 animate-pulse" />
        )}

        {/* Bar visualizer */}
        <div className="relative z-10 w-32 h-24 flex items-center justify-center">
          <BarVisualizer
            state={state}
            track={audioTrack}
            barCount={7}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* State indicator */}
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
            state === "speaking"
              ? "bg-primary animate-pulse"
              : state === "thinking"
                ? "bg-warning animate-pulse"
                : state === "listening"
                  ? "bg-success"
                  : "bg-neutral-300"
          }`}
        />
        <span className="text-sm font-semibold text-neutral-600">{label}</span>
      </div>
    </div>
  );
}
