"use client"

import { Target, Brain, FileText, BarChart3, Eye, Bell } from "lucide-react"

const features = [
    {
        icon: Target,
        title: "AI Lead Discovery",
        description:
            "24/7 Reddit monitoring across your targeted subreddits. Two-phase scoring finds high-intent prospects while filtering noise.",
        stat: "1,000+",
        statLabel: "leads/mo",
    },
    {
        icon: Brain,
        title: "AI Reply Generation",
        description:
            "Get contextual conversation starters, reply suggestions, and DM templates powered by Claude. Authentic, never spammy.",
        stat: "500+",
        statLabel: "AI gens/mo",
    },
    {
        icon: FileText,
        title: "50+ Viral Templates",
        description:
            "Battle-tested post templates across 10 categories — stories, questions, comparisons, case studies. AI-personalized for your product.",
        stat: "50+",
        statLabel: "templates",
    },
    {
        icon: BarChart3,
        title: "Analytics Dashboard",
        description:
            "Track leads found, engagement rates, conversion funnels, and ROI by subreddit. Know exactly what's working.",
        stat: "Real-time",
        statLabel: "insights",
    },
    {
        icon: Eye,
        title: "Competitor Monitoring",
        description:
            "Track competitor mentions across Reddit. Get alerted when someone asks about alternatives — then swoop in.",
        stat: "24/7",
        statLabel: "tracking",
    },
    {
        icon: Bell,
        title: "Slack & Webhook Alerts",
        description:
            "Get instant Slack notifications for high-relevance leads. Connect custom webhooks to your existing workflow.",
        stat: "Instant",
        statLabel: "alerts",
    },
]

export function Features() {
    return (
        <section id="features" className="py-24 px-4 sm:px-6 relative">
            {/* Section divider */}
            <div className="section-divider absolute top-0 left-0 right-0" />

            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/15 bg-accent/[0.04] mb-6">
                        <span className="w-1 h-1 rounded-full bg-accent" />
                        <span className="text-xs font-mono text-accent uppercase tracking-widest">Signal Suite</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Everything You Need to Win on Reddit
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        More than just a monitoring tool. RedProwler is your complete Reddit growth engine.
                    </p>
                </div>

                {/* Feature grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((feature, i) => (
                        <div
                            key={feature.title}
                            className="group relative rounded-xl bg-bg-secondary border border-border p-6 transition-all duration-300 hover:border-accent/20 hover:bg-bg-secondary/80 animate-fade-in-up"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            {/* Hover glow */}
                            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(ellipse_at_top_left,rgba(230,57,70,0.04)_0%,transparent_60%)]" />

                            <div className="relative">
                                {/* Icon + stat row */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-accent/[0.08] border border-accent/10 flex items-center justify-center group-hover:bg-accent/15 group-hover:border-accent/20 transition-colors">
                                        <feature.icon className="w-5 h-5 text-accent" />
                                    </div>
                                    <div className="text-right">
                                        <span className="text-lg font-bold font-mono text-accent">{feature.stat}</span>
                                        <p className="text-[10px] text-text-tertiary uppercase tracking-wider">{feature.statLabel}</p>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
