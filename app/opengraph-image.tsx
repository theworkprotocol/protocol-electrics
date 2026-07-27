import { ImageResponse } from "next/og";

export const alt = "Protocol Electrics — Precision Electrical Work, Sunshine Coast QLD";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0A0A0A",
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 80% 10%, rgba(13,27,42,0.9) 0%, rgba(10,10,10,0) 70%), radial-gradient(circle at 85% 75%, rgba(245,166,35,0.12) 0%, rgba(10,10,10,0) 45%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "42px" }}>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background: "#F5A623",
              boxShadow: "0 0 24px rgba(245,166,35,0.8)",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: "26px",
              fontWeight: 700,
              letterSpacing: "6px",
              color: "#F0EDE8",
            }}
          >
            PROTOCOL <span style={{ color: "#F5A623", marginLeft: "10px" }}>ELECTRICS</span>
          </div>
        </div>

        <div
          style={{
            fontSize: "88px",
            fontWeight: 800,
            lineHeight: 1.02,
            color: "#F0EDE8",
            letterSpacing: "-3px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Precision</span>
          <span style={{ color: "#F5A623" }}>Electrical Work.</span>
        </div>

        <div
          style={{
            marginTop: "42px",
            fontSize: "28px",
            color: "#8A8A8A",
            display: "flex",
          }}
        >
          Electrical · EV Chargers · Air Conditioning · Maintenance — Sunshine Coast, QLD
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "56px",
            left: "80px",
            fontSize: "24px",
            color: "#F5A623",
            display: "flex",
          }}
        >
          protocolelectrics.com.au
        </div>
      </div>
    ),
    { ...size }
  );
}
