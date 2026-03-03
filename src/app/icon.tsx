import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: 32,
                    height: 32,
                    background: "#0f0f17",
                    borderRadius: 7,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <svg
                    viewBox="0 0 32 32"
                    width="32"
                    height="32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="16" cy="16" r="12" stroke="#e63946" strokeWidth="1.5" opacity="0.3" />
                    <circle cx="16" cy="16" r="8" stroke="#e63946" strokeWidth="1.5" opacity="0.5" />
                    <circle cx="16" cy="16" r="4" stroke="#e63946" strokeWidth="1.5" opacity="0.7" />
                    <line x1="16" y1="16" x2="26" y2="9" stroke="#e63946" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="16" cy="16" r="2" fill="#e63946" />
                </svg>
            </div>
        ),
        { ...size }
    )
}
