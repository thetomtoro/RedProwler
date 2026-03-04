import { Eye, Bell, MessageSquareText, ArrowRight } from "lucide-react"

export function CompetitorMonitoring() {
    return (
        <section className="py-24 px-4 sm:px-6 relative">
            <div className="section-divider absolute top-0 left-0 right-0" />

            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Copy */}
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/15 bg-accent/[0.04] mb-6">
                            <Eye className="w-3 h-3 text-accent" />
                            <span className="text-xs font-mono text-accent uppercase tracking-widest">Competitor Intel</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Know When Someone Asks for an Alternative to{" "}
                            <span className="gradient-text">Your Competitor</span>
                        </h2>
                        <p className="text-text-secondary text-lg leading-relaxed mb-8">
                            Track competitor mentions across Reddit. When someone is frustrated
                            with a competitor or asking for alternatives, RedProwler alerts you
                            instantly — so you can be the first to respond with a genuine, helpful answer.
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: Eye, text: "Set up keyword tracking for any competitor" },
                                { icon: Bell, text: "Get Slack alerts for high-relevance mentions" },
                                { icon: MessageSquareText, text: "AI generates contextual responses that position your product naturally" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded bg-accent/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                                        <item.icon className="w-3.5 h-3.5 text-accent" />
                                    </div>
                                    <span className="text-text-secondary text-sm">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Mockup alert card */}
                    <div className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
                        <div className="rounded-xl border border-accent/15 bg-bg-secondary p-6 relative overflow-hidden">
                            {/* Subtle glow */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[radial-gradient(ellipse_at_top_right,rgba(230,57,70,0.06)_0%,transparent_70%)]" />

                            <div className="relative space-y-4">
                                {/* Alert header */}
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                                    </span>
                                    <span className="text-xs font-mono text-accent">New competitor mention</span>
                                </div>

                                {/* Alert card 1 */}
                                <div className="rounded-lg bg-bg-tertiary/50 border border-accent/10 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-mono text-accent/70">r/SaaS</span>
                                        <span className="text-[10px] text-text-tertiary">&middot; 2 min ago</span>
                                    </div>
                                    <p className="text-sm text-text-secondary leading-relaxed mb-3">
                                        &ldquo;We&apos;ve been using [Competitor] but it&apos;s too expensive for our
                                        team size. Any simpler alternatives?&rdquo;
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono font-bold text-accent">94% match</span>
                                        <span className="text-[10px] font-mono text-accent/60 bg-accent/[0.06] border border-accent/10 px-1.5 py-0.5 rounded">
                                            Comparing alternatives
                                        </span>
                                    </div>
                                </div>

                                {/* Alert card 2 (dimmer, stacked effect) */}
                                <div className="rounded-lg bg-bg-tertiary/30 border border-border/50 p-4 opacity-60">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-mono text-text-tertiary">r/startups</span>
                                        <span className="text-[10px] text-text-tertiary/60">&middot; 18 min ago</span>
                                    </div>
                                    <p className="text-sm text-text-tertiary leading-relaxed mb-3">
                                        &ldquo;Has anyone switched from [Competitor]? Their new pricing
                                        is ridiculous...&rdquo;
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono text-text-tertiary">87% match</span>
                                        <span className="text-[10px] font-mono text-text-tertiary/60 bg-bg-tertiary/50 border border-border/50 px-1.5 py-0.5 rounded">
                                            Pain point
                                        </span>
                                    </div>
                                </div>

                                {/* View all link (decorative mockup element) */}
                                <div aria-hidden="true" className="flex items-center gap-1.5 text-accent text-sm font-medium pt-2">
                                    <span>View all mentions</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
