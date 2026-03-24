import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: 24,
          background: "#0F0F0F",
          overflow: "hidden",
        }}
      >
        {/* Neon green border glow — top & left */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #7CFC00 0%, #47761E 60%, transparent 100%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 4,
            background: "linear-gradient(180deg, #7CFC00 0%, #47761E 60%, transparent 100%)",
            display: "flex",
          }}
        />
        {/* Large neon bloom — top-left */}
        <div
          style={{
            position: "absolute",
            top: -30,
            left: -30,
            width: 100,
            height: 100,
            borderRadius: 50,
            background: "radial-gradient(circle, rgba(124,252,0,0.2) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        {/* Caramel accent block — bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 28,
            height: 28,
            background: "#FED985",
            display: "flex",
          }}
        />
        {/* Subtle scan line effect */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            right: 0,
            height: 1,
            background: "rgba(124,252,0,0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 120,
            left: 0,
            right: 0,
            height: 1,
            background: "rgba(124,252,0,0.1)",
            display: "flex",
          }}
        />
        {/* Bold G lettermark with neon glow */}
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: "#7CFC00",
            lineHeight: 1,
            display: "flex",
            textShadow: "0 0 20px rgba(124,252,0,0.5), 0 0 40px rgba(124,252,0,0.2)",
          }}
        >
          G
        </div>
      </div>
    ),
    { ...size }
  );
}
