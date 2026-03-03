import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: 180,
                    height: 180,
                    background: "#0f0f17",
                    borderRadius: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <svg
                    viewBox="0 0 180 180"
                    width="180"
                    height="180"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="90" cy="90" r="68" stroke="#e63946" strokeWidth="4" opacity="0.3" />
                    <circle cx="90" cy="90" r="45" stroke="#e63946" strokeWidth="4" opacity="0.5" />
                    <circle cx="90" cy="90" r="22" stroke="#e63946" strokeWidth="4" opacity="0.7" />
                    <line x1="90" y1="90" x2="148" y2="50" stroke="#e63946" strokeWidth="6" strokeLinecap="round" />
                    <circle cx="90" cy="90" r="8" fill="#e63946" />
                </svg>
            </div>
        ),
        { ...size }
    )
}
