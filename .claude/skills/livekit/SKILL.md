---
name: LiveKit
description: LiveKit technical reference — livekit-agents Python SDK, @livekit/components-react, VoicePipelineAgent config, STT/TTS plugin setup, room tokens, WebRTC lifecycle, and LiveKit Cloud deployment.
---

# LiveKit

## Overview

Technical reference for LiveKit in this project. Covers the Python `livekit-agents` SDK (backend), `@livekit/components-react` (frontend), room/token management, WebRTC connection lifecycle, `VoicePipelineAgent` configuration, STT/TTS plugin setup, and LiveKit Cloud deployment.

## Architecture

```
Browser (Next.js)                    LiveKit Cloud                    Agent Server (Python)
┌─────────────────┐                 ┌──────────────┐                ┌──────────────────┐
│ @livekit/        │  WebRTC audio  │              │   WebRTC audio │ livekit-agents    │
│ components-react │ ◄────────────► │  LiveKit SFU │ ◄────────────► │ VoicePipelineAgent│
│                  │                │              │                │  STT → LLM → TTS │
└─────────────────┘                 └──────────────┘                └──────────────────┘
        │                                                                    │
        │ POST /api/livekit-token                                           │
        └───────────────────────────────────────────────────────────────────┘
```

## Python Agent SDK

### Installation

```bash
uv add "livekit-agents[anthropic,deepgram,elevenlabs]~=1.4"
```

### VoicePipelineAgent

```python
from livekit.agents import VoicePipelineAgent, chat

agent = VoicePipelineAgent(
    stt=...,
    llm=...,
    tts=...,
    chat_ctx=initial_ctx,
    allow_interruptions=True,
    transcription_options=chat.TranscriptionOptions(
        user_transcript=True,
        assistant_transcript=True,
    ),
)

await agent.arun(ctx.room)
```

### STT — Deepgram

```python
from livekit.plugins import deepgram

stt = deepgram.STT(
    model="nova-3",
    language="en",
    interim_results=True,
    endpointing_ms=25,
    punctuate=True,
)
```

### LLM — Claude (Anthropic)

```python
from livekit.plugins import anthropic

llm = anthropic.LLM(
    model="claude-sonnet-4-20250514",
    temperature=0.7,
    max_tokens=512,
)
```

### TTS — ElevenLabs

```python
from livekit.plugins import elevenlabs

tts = elevenlabs.TTS(
    model="eleven_turbo_v2_5",
    voice="Xb7hH8MSUJpSbSDYk0k2",
    auto_mode=True,
    streaming_latency=0,
)
```

### Agent Entry Point

```python
from livekit.agents import cli, WorkerOptions, JobContext

async def entrypoint(ctx: JobContext):
    agent = VoicePipelineAgent(...)
    await agent.arun(ctx.room)

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
```

### Run Modes

```bash
python agent.py dev       # Development mode with web playground
python agent.py console   # Terminal interaction (no browser)
python agent.py start     # Production mode
```

## React Frontend SDK

### Installation

```bash
bun add @livekit/components-react livekit-client livekit-server-sdk
```

### Core Components

```tsx
import {
  LiveKitRoom,
  RoomAudioRenderer,
  BarVisualizer,
  ControlBar,
  useAgent,
} from "@livekit/components-react";
import "@livekit/components-styles";
```

### LiveKitRoom Props

```tsx
<LiveKitRoom
  token={string}
  serverUrl={string}
  connect={boolean}
  audio={true}
  video={false}
  onConnected={() => {}}
  onDisconnected={() => {}}
  onError={(error) => {}}
/>
```

### useAgent Hook

```tsx
const agent = useAgent();
agent.state        // "listening" | "thinking" | "speaking" | "idle"
agent.audioTrack   // Agent's audio track (for visualization)
```

### Token Generation

```tsx
// src/app/api/livekit-token/route.ts
import { AccessToken } from "livekit-server-sdk";

export async function POST(request: Request) {
  const { roomName, participantName } = await request.json();

  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    { identity: `user-${Date.now()}`, name: participantName, ttl: 86400 }
  );

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });

  return Response.json({
    token: await token.toJwt(),
    serverUrl: process.env.LIVEKIT_URL,
  });
}
```

## Environment Variables

```bash
LIVEKIT_API_KEY=APxxxxxx
LIVEKIT_API_SECRET=xxxxxx
LIVEKIT_URL=wss://your-project.livekit.cloud
ANTHROPIC_API_KEY=sk-ant-xxxxx
DEEPGRAM_API_KEY=xxxxx
ELEVEN_API_KEY=xxxxx
```

## Deployment

```bash
lk cloud auth
cd agent && lk agent deploy
lk cloud logs --follow
```

## Latency Optimization

- `endpointing_ms=25` on Deepgram (fast turn detection)
- `auto_mode=True` on ElevenLabs (sentence-level streaming)
- `streaming_latency=0` on ElevenLabs
- Keep Claude `max_tokens` low (256-512)
- Target: sub-500ms voice-to-voice latency

## References

- [LiveKit Agents Docs](https://docs.livekit.io/agents/)
- [VoicePipelineAgent](https://docs.livekit.io/agents/voice-agent/voice-pipeline/)
- [Anthropic Plugin](https://docs.livekit.io/agents/integrations/llm/anthropic/)
- [Deepgram Plugin](https://docs.livekit.io/agents/models/stt/plugins/deepgram/)
- [ElevenLabs Plugin](https://docs.livekit.io/agents/models/tts/plugins/elevenlabs/)
- [@livekit/components-react](https://docs.livekit.io/reference/components/react/)
- [Cloud Deployment](https://docs.livekit.io/agents/ops/deployment/)
