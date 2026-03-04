import { X, Check, Brain, Filter } from "lucide-react"

const noiseLeads = [
    { sub: "r/webdev", text: "Just deployed my first React app!", score: 8 },
    { sub: "r/SaaS", text: "What's everyone's tech stack?", score: 12 },
    { sub: "r/startups", text: "Sharing my weekend project", score: 5 },
    { sub: "r/marketing", text: "Best free design tools?", score: 34 },
    { sub: "r/Entrepreneur", text: "How I hit 10K followers", score: 15 },
    { sub: "r/smallbusiness", text: "Tax software recommendations?", score: 22 },
]

const qualifiedLeads = [
    {
        sub: "r/SaaS",
        text: "Looking for a tool to find leads on Reddit — any recommendations?",
        score: 95,
        intent: "Asking for recommendation",
    },
    {
        sub: "r/startups",
        text: "We need to monitor Reddit mentions of our competitors. What do you use?",
        score: 92,
        intent: "Comparing alternatives",
    },
    {
        sub: "r/Entrepreneur",
        text: "How do you find potential customers on Reddit without being spammy?",
        score: 87,
        intent: "Pain point",
    },
]

export function AIScoring() {
    return (
        <section className="py-24 px-4 sm:px-6 relative">
            <div className="section-divider absolute top-0 left-0 right-0" />

            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/15 bg-accent/[0.04] mb-6">
                        <Brain className="w-3 h-3 text-accent" />
                        <span className="text-xs font-mono text-accent uppercase tracking-widest">Two-Phase AI</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        500 Noisy Mentions.{" "}
                        <span className="gradient-text">10 That Actually Convert.</span>
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Other tools dump hundreds of barely-relevant posts on you.
                        RedProwler&apos;s two-phase AI filter does the work so you don&apos;t have to.
                    </p>
                </div>

                {/* Before / After columns */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Phase 1: The Noise */}
                    <div className="rounded-xl border border-border bg-bg-secondary p-6 animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-text-tertiary/10 flex items-center justify-center">
                                <Filter className="w-4 h-4 text-text-tertiary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-text-tertiary">Without RedProwler</h3>
                                <p className="text-xs text-text-tertiary/70">Raw Reddit firehose</p>
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            {noiseLeads.map((lead, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 rounded-lg bg-bg-tertiary/30 border border-border/50 px-4 py-3 opacity-50"
                                >
                                    <X className="w-4 h-4 text-red-400/60 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[10px] font-mono text-text-tertiary/60">{lead.sub}</span>
                                        <p className="text-sm text-text-tertiary truncate">{lead.text}</p>
                                    </div>
                                    <span className="text-xs font-mono text-text-tertiary/40 shrink-0">{lead.score}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Phase 2: Your Leads */}
                    <div className="rounded-xl border border-accent/20 bg-bg-secondary p-6 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/15 flex items-center justify-center">
                                <Brain className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-text-primary">With RedProwler</h3>
                                <p className="text-xs text-text-tertiary">AI-scored &amp; filtered</p>
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            {qualifiedLeads.map((lead, i) => (
                                <div
                                    key={i}
                                    className="group rounded-lg bg-bg-tertiary/50 border border-accent/10 px-4 py-3 transition-all hover:border-accent/25"
                                >
                                    <div className="flex items-start gap-3">
                                        <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-mono text-accent/70">{lead.sub}</span>
                                                <span className="text-[10px] font-mono text-accent bg-accent/[0.06] border border-accent/10 px-1.5 py-0.5 rounded">
                                                    {lead.intent}
                                                </span>
                                            </div>
                                            <p className="text-sm text-text-secondary leading-relaxed">{lead.text}</p>
                                        </div>
                                        <span className="text-sm font-bold font-mono text-accent shrink-0">{lead.score}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Explainer */}
                <div className="mt-10 text-center">
                    <p className="text-text-tertiary text-sm max-w-3xl mx-auto leading-relaxed">
                        <span className="text-text-secondary font-medium">Phase 1:</span> Keyword matching and intent signals filter thousands of posts down to candidates.{" "}
                        <span className="text-text-secondary font-medium">Phase 2:</span> Claude AI scores each candidate for relevance to your specific product. You only see what matters.
                    </p>
                </div>
            </div>
        </section>
    )
}
