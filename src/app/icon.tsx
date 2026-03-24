import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: 4,
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
            height: 2,
            background: "linear-gradient(90deg, #7CFC00 0%, #47761E 70%, transparent 100%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 2,
            background: "linear-gradient(180deg, #7CFC00 0%, #47761E 70%, transparent 100%)",
            display: "flex",
          }}
        />
        {/* Neon glow bloom effect */}
        <div
          style={{
            position: "absolute",
            top: -6,
            left: -6,
            width: 20,
            height: 20,
            borderRadius: 10,
            background: "radial-gradient(circle, rgba(124,252,0,0.3) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        {/* Caramel accent corner — bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 6,
            height: 6,
            background: "#FED985",
            display: "flex",
          }}
        />
        {/* Bold G lettermark with neon glow */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: "#7CFC00",
            lineHeight: 1,
            display: "flex",
            textShadow: "0 0 8px rgba(124,252,0,0.6)",
          }}
        >
          G
        </div>
      </div>
    ),
    { ...size }
  );
}
