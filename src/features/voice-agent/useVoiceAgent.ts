"use client";

import { useState, useCallback, useRef } from "react";

interface ConnectionDetails {
  token: string;
  serverUrl: string;
}

type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

interface UseVoiceAgentReturn {
  connectionDetails: ConnectionDetails | null;
  connectionState: ConnectionState;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

interface UseVoiceAgentOptions {
  clinicId?: string;
}

export function useVoiceAgentConnection(options?: UseVoiceAgentOptions): UseVoiceAgentReturn {
  const [connectionDetails, setConnectionDetails] =
    useState<ConnectionDetails | null>(null);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const [error, setError] = useState<string | null>(null);
  const wasConnectedRef = useRef(false);

  const connect = useCallback(async () => {
    setConnectionState("connecting");
    setError(null);

    try {
      const res = await fetch("/api/livekit-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName: `dental-reception-${Date.now()}`,
          participantName: "Patient",
          clinicId: options?.clinicId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to get connection token");
      }

      const data = await res.json();
      setConnectionDetails({
        token: data.token,
        serverUrl: data.serverUrl,
      });
      setConnectionState("connected");
      wasConnectedRef.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
      setConnectionState("error");
    }
  }, [options?.clinicId]);

  const disconnect = useCallback(() => {
    if (wasConnectedRef.current) {
      window.dispatchEvent(new CustomEvent("feltsense:call-ended"));
      wasConnectedRef.current = false;
    }
    setConnectionDetails(null);
    setConnectionState("disconnected");
    setError(null);
  }, []);

  return { connectionDetails, connectionState, error, connect, disconnect };
}
