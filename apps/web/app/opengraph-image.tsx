import { ImageResponse } from "next/og";

// The share card for every page: the W and the wordmark on the night scene, in the tokens' colours
// (scene-night, accent-night, glass-ink), with the landing page's own headline.
export const alt = "Whiteflow. One invoice. Clear settlement.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const W =
  "M0.00 0.00L59.82 0.00L75.41 53.56L49.02 94.29A12.52 12.52 0 0 1 26.49 90.98ZM99.56 5.76A12.63 12.63 0 0 1 122.29 9.10L148.76 100.00L88.94 100.00L73.30 46.29ZM148.48 0.00L208.60 0.00L182.16 90.81A12.76 12.76 0 0 1 159.21 94.18L132.89 53.56Z";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 96,
        background: "#12131c",
        color: "#ededf3",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <svg viewBox="0 0 208.61 100" width={230} height={110} fill="#8796ff">
          <path d={W} />
        </svg>
        <div style={{ display: "flex", fontSize: 120, fontWeight: 600 }}>
          <span>White</span>
          {/* the OG renderer leaves a gap between the two halves; -16px joins them into one word */}
          <span style={{ color: "#8796ff", marginLeft: -16 }}>flow</span>
        </div>
      </div>
      <div
        style={{ display: "flex", marginTop: 56, fontSize: 48, opacity: 0.85 }}
      >
        One invoice. Clear settlement.
      </div>
    </div>,
    size,
  );
}
