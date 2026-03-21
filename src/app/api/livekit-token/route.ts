import { AccessToken, AgentDispatchClient } from "livekit-server-sdk";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { roomName, participantName, clinicId } = await request.json();

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !livekitUrl) {
    return NextResponse.json(
      { error: "LiveKit environment variables not configured" },
      { status: 500 }
    );
  }

  const room = roomName || `dental-reception-${Date.now()}`;

  const token = new AccessToken(apiKey, apiSecret, {
    identity: `patient-${Date.now()}`,
    name: participantName || "Patient",
    ttl: "1h",
  });

  token.addGrant({
    roomJoin: true,
    room,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  });

  // Dispatch the voice agent to join the room, passing clinic context as metadata
  const dispatchClient = new AgentDispatchClient(livekitUrl, apiKey, apiSecret);
  await dispatchClient.createDispatch(room, "dental-receptionist", {
    metadata: JSON.stringify({ clinic_id: clinicId }),
  });

  return NextResponse.json({
    token: await token.toJwt(),
    serverUrl: livekitUrl,
  });
}
