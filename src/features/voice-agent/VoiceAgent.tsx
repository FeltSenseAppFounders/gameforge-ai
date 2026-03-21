"use client";

import { useState, useCallback } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useVoiceAssistant,
  DisconnectButton,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { AgentVisualizer } from "./AgentVisualizer";
import { useVoiceAgentConnection } from "./useVoiceAgent";

function ActiveCall({ onDisconnect }: { onDisconnect: () => void }) {
  const { state, agentTranscriptions } = useVoiceAssistant();
  const [elapsed, setElapsed] = useState(0);

  // Timer for call duration
  useState(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  });

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Get the latest transcription text
  const latestTranscription = agentTranscriptions.at(-1);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Agent info header */}
      <div className="flex flex-col items-center gap-1">
        <h3 className="text-xl font-semibold font-heading text-neutral-800">
          Sarah
        </h3>
        <p className="text-sm text-neutral-500">AI Dental Receptionist</p>
        <p className="text-xs font-mono text-neutral-400 mt-1">
          {formatTime(elapsed)}
        </p>
      </div>

      {/* Audio visualizer */}
      <AgentVisualizer />

      {/* Live transcription preview */}
      {latestTranscription && (
        <div className="max-w-sm w-full px-4 py-3 bg-neutral-50 rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-600 text-center line-clamp-2">
            &ldquo;{latestTranscription.text}&rdquo;
          </p>
        </div>
      )}

      {/* End call button */}
      <button
        onClick={onDisconnect}
        className="bg-error hover:bg-error/90 text-white rounded-full px-8 py-3 text-sm font-semibold
          shadow-sm hover:shadow-md transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-error/35 focus:ring-offset-2
          min-h-[44px] flex items-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
          />
        </svg>
        End Call
      </button>

      {/* Hidden audio renderer — plays agent audio */}
      <RoomAudioRenderer />
    </div>
  );
}

interface VoiceAgentProps {
  clinicId?: string;
}

export function VoiceAgent({ clinicId }: VoiceAgentProps = {}) {
  const { connectionDetails, connectionState, error, connect, disconnect } =
    useVoiceAgentConnection({ clinicId });

  // Pre-connect state
  if (!connectionDetails) {
    return (
      <div className="flex flex-col items-center gap-8">
        {/* Agent avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
              />
            </svg>
          </div>
          {/* Online indicator */}
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-success rounded-full border-2 border-white shadow-sm" />
        </div>

        {/* Agent info */}
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-semibold font-heading text-neutral-800">
            Talk to Sarah
          </h3>
          <p className="text-sm text-neutral-500 text-center max-w-xs">
            Our AI dental receptionist can help with appointments, insurance
            questions, and more.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="w-full max-w-sm px-4 py-3 bg-error/10 border-l-4 border-l-error rounded-r-md">
            <p className="text-sm text-error font-semibold">{error}</p>
          </div>
        )}

        {/* Connect button */}
        <button
          onClick={connect}
          disabled={connectionState === "connecting"}
          className={`rounded-full px-8 py-3 text-sm font-semibold min-h-[44px]
            transition-all duration-200 flex items-center gap-2
            focus:outline-none focus:ring-2 focus:ring-primary/35 focus:ring-offset-2
            ${
              connectionState === "connecting"
                ? "bg-neutral-300 text-neutral-400 cursor-not-allowed"
                : "bg-gradient-to-br from-primary to-accent text-white shadow-md hover:shadow-lg hover:brightness-110"
            }`}
        >
          {connectionState === "connecting" ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Connecting...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
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
              Start Conversation
            </>
          )}
        </button>

        {/* Mic permission hint */}
        <p className="text-xs text-neutral-400">
          Microphone access required
        </p>
      </div>
    );
  }

  // Connected — show LiveKit room
  return (
    <LiveKitRoom
      token={connectionDetails.token}
      serverUrl={connectionDetails.serverUrl}
      connect={true}
      audio={true}
      video={false}
      onDisconnected={disconnect}
      onError={(err) => {
        console.error("LiveKit error:", err);
        disconnect();
      }}
    >
      <ActiveCall onDisconnect={disconnect} />
    </LiveKitRoom>
  );
}
