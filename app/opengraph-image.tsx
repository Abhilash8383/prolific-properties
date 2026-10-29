import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Prolific Properties — Find your property in Bhubaneswar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/brand/prolific-logo.png"));
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 74, background: "#f5fbff", color: "#142b43", fontFamily: "Arial, sans-serif" }}>
      <img src={`data:image/png;base64,${logo.toString("base64")}`} alt="Prolific Properties" width={340} height={95} style={{ objectFit: "contain", objectPosition: "left", marginBottom: 42 }} />
      <div style={{ display: "flex", flexDirection: "column", fontSize: 70, lineHeight: 1.1, fontWeight: 800, letterSpacing: -2 }}>
        <span>Find your property</span>
        <span style={{ color: "#0f75bc" }}>in Bhubaneswar.</span>
      </div>
      <span style={{ marginTop: 30, fontSize: 25, color: "#526779" }}>Local listings. Clear guidance. Better choices.</span>
      <div style={{ display: "flex", position: "absolute", left: 0, bottom: 0, width: "100%", height: 18, background: "#0f75bc" }} />
    </div>,
    size,
  );
}
