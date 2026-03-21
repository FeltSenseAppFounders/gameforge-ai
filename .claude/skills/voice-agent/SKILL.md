---
name: Voice Agent
description: Build the LiveKit-powered voice AI agent — Python backend (VoicePipelineAgent with Deepgram STT, Claude LLM, ElevenLabs TTS) and React frontend (@livekit/components-react). The core FeltSense Clinic product.
---

# Voice Agent

## Overview

Set up the LiveKit-powered voice AI agent — the core product. This covers the Python agent backend (STT → LLM → TTS pipeline) and the React frontend integration. The agent acts as an autonomous dental receptionist that handles calls via WebRTC in the browser.

## Key Files

### Python Agent Backend
- `agent/agent.py` — main agent entry point with `VoicePipelineAgent`
- `agent/prompts.py` — dental receptionist system prompts
- `agent/pyproject.toml` — Python dependencies
- `agent/.env` — API keys (ANTHROPIC_API_KEY, DEEPGRAM_API_KEY, ELEVEN_API_KEY, LIVEKIT_*)

### Next.js Frontend
- `src/app/api/livekit-token/route.ts` — token generation API route
- `src/features/voice-agent/VoiceAgent.tsx` — main voice UI component
- `src/features/voice-agent/AgentVisualizer.tsx` — audio waveform visualization
- `src/features/voice-agent/useVoiceAgent.ts` — custom hook for agent state

### Environment Variables
```
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
LIVEKIT_URL=wss://your-project.livekit.cloud
ANTHROPIC_API_KEY=
DEEPGRAM_API_KEY=
ELEVEN_API_KEY=
```

## 1. Python Agent Setup

```bash
mkdir agent && cd agent
uv init
uv add "livekit-agents[anthropic,deepgram,elevenlabs]~=1.4"
```

**Minimal agent (`agent/agent.py`):**

```python
import logging
from livekit.agents import cli, WorkerOptions, JobContext, VoicePipelineAgent, chat
from livekit.plugins import anthropic, deepgram, elevenlabs

logger = logging.getLogger("dental-agent")

SYSTEM_PROMPT = """You are a friendly, professional AI receptionist for a dental practice.
Your name is Sarah. You help patients with:
- Booking and rescheduling appointments
- Answering questions about services and hours
- Basic insurance questions
Keep responses concise and natural (1-2 sentences). Be warm but professional."""

async def entrypoint(ctx: JobContext):
    initial_ctx = chat.ChatContext(
        messages=[chat.SystemMessage(content=SYSTEM_PROMPT)]
    )

    agent = VoicePipelineAgent(
        stt=deepgram.STT(model="nova-3", language="en", interim_results=True, endpointing_ms=25),
        llm=anthropic.LLM(model="claude-sonnet-4-20250514", temperature=0.7),
        tts=elevenlabs.TTS(model="eleven_turbo_v2_5", auto_mode=True),
        chat_ctx=initial_ctx,
        allow_interruptions=True,
    )

    await agent.arun(ctx.room)

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
```

**Run:** `cd agent && uv run python agent.py dev`

## 2. Token Generation API Route

```typescript
// src/app/api/livekit-token/route.ts
import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { roomName, participantName } = await request.json();

  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    {
      identity: `user-${Date.now()}`,
      name: participantName || "Patient",
      ttl: 86400,
    }
  );

  token.addGrant({
    roomJoin: true,
    room: roomName || "dental-reception",
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  });

  return NextResponse.json({
    token: await token.toJwt(),
    serverUrl: process.env.LIVEKIT_URL,
  });
}
```

## 3. React Frontend Component

Install: `bun add @livekit/components-react livekit-client livekit-server-sdk`

```tsx
// src/features/voice-agent/VoiceAgent.tsx
"use client";

import { useState } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useAgent,
  BarVisualizer,
} from "@livekit/components-react";
import "@livekit/components-styles";

export function VoiceAgent() {
  const [connectionDetails, setConnectionDetails] = useState<{
    token: string;
    serverUrl: string;
  } | null>(null);

  const connect = async () => {
    const res = await fetch("/api/livekit-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName: "dental-reception" }),
    });
    const data = await res.json();
    setConnectionDetails({ token: data.token, serverUrl: data.serverUrl });
  };

  if (!connectionDetails) {
    return <button onClick={connect}>Talk to AI Receptionist</button>;
  }

  return (
    <LiveKitRoom
      token={connectionDetails.token}
      serverUrl={connectionDetails.serverUrl}
      connect={true}
      audio={true}
      video={false}
      onDisconnected={() => setConnectionDetails(null)}
    >
      <RoomAudioRenderer />
      <AgentVisualizer />
    </LiveKitRoom>
  );
}

function AgentVisualizer() {
  const agent = useAgent();

  return (
    <div>
      {agent?.audioTrack && (
        <BarVisualizer
          track={agent.audioTrack}
          state={agent.state}
          barCount={7}
        />
      )}
      <p>{agent?.state === "speaking" ? "Speaking..." : agent?.state === "thinking" ? "Thinking..." : "Listening..."}</p>
    </div>
  );
}
```

## 4. Running Locally

Terminal 1 — Python agent:
```bash
cd agent && uv run python agent.py dev
```

Terminal 2 — Next.js frontend:
```bash
bun dev
```

## 5. LiveKit Cloud Deployment

```bash
lk cloud auth
cd agent && lk agent deploy
```

## Acceptance Criteria

- [ ] Python agent runs locally with `uv run python agent.py dev`
- [ ] Token API route works at `/api/livekit-token`
- [ ] User can click a button, grant mic access, and talk to the AI
- [ ] Agent responds with natural voice (ElevenLabs TTS)
- [ ] Agent understands dental context (booking, FAQs, insurance basics)
- [ ] Interruptions work (user can cut off the agent mid-sentence)
- [ ] Audio visualizer shows agent state (listening/thinking/speaking)
- [ ] Clean disconnect when user ends the call

## References

- [LiveKit Agents Docs](https://docs.livekit.io/agents/)
- [VoicePipelineAgent Guide](https://docs.livekit.io/agents/voice-agent/voice-pipeline/)
- [Anthropic Plugin](https://docs.livekit.io/agents/integrations/llm/anthropic/)
- [@livekit/components-react](https://docs.livekit.io/reference/components/react/)
