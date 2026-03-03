"use client"

import { Button } from "@/components/ui/Button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const signalDots = [
    { x: "18%", y: "30%", delay: "0s", size: "w-2 h-2", score: 92 },
    { x: "72%", y: "25%", delay: "1.2s", size: "w-2.5 h-2.5", score: 87 },
    { x: "35%", y: "65%", delay: "0.6s", size: "w-1.5 h-1.5", score: 64 },
    { x: "80%", y: "55%", delay: "2s", size: "w-2 h-2", score: 95 },
    { x: "55%", y: "20%", delay: "0.3s", size: "w-1.5 h-1.5", score: 71 },
    { x: "25%", y: "50%", delay: "1.8s", size: "w-2 h-2", score: 88 },
    { x: "65%", y: "70%", delay: "0.9s", size: "w-2.5 h-2.5", score: 96 },
]

export function Hero() {
    return (
        <section className="relative pt-36 pb-24 px-4 sm:px-6 overflow-hidden">
            {/* Thermal gradient background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] opacity-30">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(230,57,70,0.15)_0%,rgba(255,109,0,0.06)_40%,transparent_70%)]" />
                </div>
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(230,57,70,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(230,57,70,0.3) 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            <div className="relative max-w-5xl mx-auto">
                {/* Top: Radar visualization + content side by side on desktop */}
                <div className="grid lg:grid-cols-[1fr,420px] gap-12 lg:gap-16 items-center">
                    {/* Left: Text content */}
                    <div className="text-center lg:text-left">
                        {/* Signal status pill */}
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/[0.04] mb-8 animate-fade-in">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                            </span>
                            <span className="text-sm text-text-secondary font-mono tracking-wide">
                                <span className="text-accent font-semibold">2,847</span> signals detected today
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight mb-6 animate-fade-in-up">
                            Your Customers Are{" "}
                            <br className="hidden sm:block" />
                            Asking for You{" "}
                            <br className="hidden sm:block" />
                            <span className="gradient-text">on Reddit</span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed animate-fade-in-up delay-200">
                            RedPulse scans thousands of Reddit conversations to find people
                            actively looking for what you sell — then arms you with AI-crafted
                            replies that convert.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 animate-fade-in-up delay-300">
                            <Link href="/sign-up">
                                <Button variant="cta" size="lg" className="min-w-[200px]">
                                    Start Free <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <a href="#how-it-works">
                                <Button variant="secondary" size="lg" className="min-w-[200px]">
                                    See How It Works
                                </Button>
                            </a>
                        </div>

                        {/* Trust bar */}
                        <div className="mt-10 flex items-center justify-center lg:justify-start gap-5 text-text-tertiary text-sm animate-fade-in delay-500">
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                                No credit card
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                                50 free leads/mo
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                                Cancel anytime
                            </span>
                        </div>
                    </div>

                    {/* Right: Radar visualization */}
                    <div className="relative hidden lg:block">
                        <div className="relative w-[420px] h-[420px]">
                            {/* Outer ring */}
                            <div className="absolute inset-0 rounded-full border border-accent/10" />
                            {/* Middle ring */}
                            <div className="absolute inset-[60px] rounded-full border border-accent/15" />
                            {/* Inner ring */}
                            <div className="absolute inset-[120px] rounded-full border border-accent/20" />
                            {/* Center ring */}
                            <div className="absolute inset-[170px] rounded-full border border-accent/25" />

                            {/* Sweep line */}
                            <div className="absolute inset-0 animate-radar-sweep" style={{ transformOrigin: "center center" }}>
                                <div
                                    className="absolute top-1/2 left-1/2 w-1/2 h-[2px] origin-left"
                                    style={{
                                        background: "linear-gradient(90deg, rgba(230,57,70,0.6) 0%, transparent 100%)",
                                    }}
                                />
                                {/* Sweep cone */}
                                <div
                                    className="absolute top-1/2 left-1/2 w-1/2 h-1/2 origin-top-left"
                                    style={{
                                        background: "conic-gradient(from -5deg, rgba(230,57,70,0.08) 0deg, transparent 30deg)",
                                        borderRadius: "0 100% 0 0",
                                    }}
                                />
                            </div>

                            {/* Ping rings */}
                            <div className="absolute inset-[40px] rounded-full border-2 border-accent/20 animate-radar-ping" />
                            <div className="absolute inset-[40px] rounded-full border-2 border-accent/20 animate-radar-ping" style={{ animationDelay: "1s" }} />
                            <div className="absolute inset-[40px] rounded-full border-2 border-accent/20 animate-radar-ping" style={{ animationDelay: "2s" }} />

                            {/* Signal dots */}
                            {signalDots.map((dot, i) => (
                                <div
                                    key={i}
                                    className="absolute animate-signal-appear"
                                    style={{ left: dot.x, top: dot.y, animationDelay: dot.delay }}
                                >
                                    <div className="relative group cursor-default">
                                        <div
                                            className={`${dot.size} rounded-full animate-signal-blink`}
                                            style={{
                                                backgroundColor: dot.score >= 85 ? "#e63946" : dot.score >= 70 ? "#ff6d00" : "#ffa726",
                                                boxShadow: `0 0 ${dot.score >= 85 ? 12 : 8}px ${dot.score >= 85 ? "rgba(230,57,70,0.5)" : "rgba(255,109,0,0.4)"}`,
                                                animationDelay: dot.delay,
                                            }}
                                        />
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <div className="bg-bg-tertiary border border-border rounded px-2 py-1 text-[10px] font-mono whitespace-nowrap">
                                                <span className="text-accent font-bold">{dot.score}%</span>
                                                <span className="text-text-tertiary"> match</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Center dot */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent shadow-[0_0_20px_rgba(230,57,70,0.5)]" />
                        </div>
                    </div>
                </div>

                {/* Live ticker */}
                <div className="mt-20 relative overflow-hidden rounded-lg border border-border/50 bg-bg-secondary/50 py-3 animate-fade-in delay-600">
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-bg-primary to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-bg-primary to-transparent z-10" />
                    <div className="flex animate-ticker whitespace-nowrap">
                        {[
                            "r/SaaS — \"Anyone know a good CRM for small teams?\"",
                            "r/startups — \"Looking for project management tools\"",
                            "r/Entrepreneur — \"What email marketing tool do you use?\"",
                            "r/smallbusiness — \"Need help with inventory management\"",
                            "r/webdev — \"Best hosting for Next.js apps?\"",
                            "r/marketing — \"Looking for SEO tools that actually work\"",
                            "r/SaaS — \"Anyone know a good CRM for small teams?\"",
                            "r/startups — \"Looking for project management tools\"",
                            "r/Entrepreneur — \"What email marketing tool do you use?\"",
                            "r/smallbusiness — \"Need help with inventory management\"",
                            "r/webdev — \"Best hosting for Next.js apps?\"",
                            "r/marketing — \"Looking for SEO tools that actually work\"",
                        ].map((text, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-3 mx-8 text-sm font-mono"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-breathing" style={{ animationDelay: `${i * 0.4}s` }} />
                                <span className="text-text-tertiary">{text}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
