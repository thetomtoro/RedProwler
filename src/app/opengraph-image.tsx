import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "RedProwler — AI Reddit Lead Generation"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
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
                    background: "linear-gradient(135deg, #0f0f17 0%, #1a1a2e 50%, #0f0f17 100%)",
                    fontFamily: "system-ui, sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        marginBottom: "24px",
                    }}
                >
                    <div
                        style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            background: "#e63946",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "24px",
                            fontWeight: 700,
                            color: "white",
                        }}
                    >
                        R
                    </div>
                    <span
                        style={{
                            fontSize: "28px",
                            color: "#e63946",
                            fontWeight: 700,
                            letterSpacing: "-0.5px",
                        }}
                    >
                        RedProwler
                    </span>
                </div>
                <div
                    style={{
                        fontSize: "56px",
                        fontWeight: 700,
                        color: "#f0ece8",
                        lineHeight: 1.15,
                        letterSpacing: "-1.5px",
                        marginBottom: "24px",
                    }}
                >
                    AI Reddit Lead Generation
                </div>
                <div
                    style={{
                        fontSize: "24px",
                        color: "#8a8a9a",
                        lineHeight: 1.5,
                    }}
                >
                    Monitor Reddit 24/7. Find ideal customers. Generate AI-powered replies.
                </div>
            </div>
        ),
        { ...size }
    )
}
