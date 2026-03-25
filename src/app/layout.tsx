import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import "./globals.css"

export const metadata: Metadata = {
    title: "RedProwler — AI Reddit Lead Generation for Founders",
    description:
        "Get hundreds of customers from Reddit on autopilot. RedProwler monitors Reddit 24/7, finds your ideal customers, and generates AI-powered replies to convert them.",
    openGraph: {
        title: "RedProwler — AI Reddit Lead Generation",
        description: "Get hundreds of customers from Reddit on autopilot.",
        type: "website",
        url: "https://redprowler.com",
    },
    twitter: {
        card: "summary_large_image",
        title: "RedProwler — AI Reddit Lead Generation",
        description: "Get hundreds of customers from Reddit on autopilot.",
    },
}

export const dynamic = "force-dynamic"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark,
                variables: {
                    colorPrimary: "#e63946",
                    colorBackground: "#0f0f17",
                    colorInputBackground: "#17171f",
                    colorInputText: "#f0ece8",
                },
            }}
        >
            <html lang="en" className="dark">
                <body className="antialiased">
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}
