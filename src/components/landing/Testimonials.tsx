import { Star, TrendingUp } from "lucide-react"

const testimonials = [
    {
        name: "Alex Chen",
        role: "SaaS Founder",
        metric: "3x Site Traffic",
        quote: "RedPulse found leads I would have never discovered manually. Within one month, my site traffic tripled and I closed $2,400 in new MRR directly from Reddit conversations.",
        stars: 5,
    },
    {
        name: "Sarah Mitchell",
        role: "Indie Hacker",
        metric: "5x Engagement",
        quote: "The AI-generated replies are incredibly natural. No one can tell they're AI-assisted. My engagement rate on Reddit went up 5x and I'm building genuine relationships.",
        stars: 5,
    },
    {
        name: "James Park",
        role: "Growth Marketer",
        metric: "50% Lower CAC",
        quote: "We switched from paid ads to RedPulse-powered Reddit marketing. Our customer acquisition cost dropped by half and the leads are way higher quality.",
        stars: 5,
    },
    {
        name: "Priya Sharma",
        role: "Content Creator",
        metric: "10K Karma in 3mo",
        quote: "The viral templates are gold. I went from zero Reddit presence to 10K karma in three months. The competitor monitoring also helped me find untapped niches.",
        stars: 5,
    },
]

export function Testimonials() {
    return (
        <section className="py-24 px-4 sm:px-6 relative">
            <div className="section-divider absolute top-0 left-0 right-0" />

            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/15 bg-accent/[0.04] mb-6">
                        <TrendingUp className="w-3 h-3 text-accent" />
                        <span className="text-xs font-mono text-accent uppercase tracking-widest">Results</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Founders Love RedPulse
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        See how founders and marketers are using RedPulse to grow their businesses.
                    </p>
                </div>

                {/* Testimonial grid */}
                <div className="grid sm:grid-cols-2 gap-5">
                    {testimonials.map((testimonial, i) => (
                        <div
                            key={testimonial.name}
                            className="group rounded-xl bg-bg-secondary border border-border p-6 transition-all duration-300 hover:border-accent/15 relative overflow-hidden animate-fade-in-up"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            {/* Accent bar */}
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent/40 via-accent-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Stars + metric */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex gap-0.5">
                                    {Array.from({ length: testimonial.stars }).map((_, j) => (
                                        <Star key={j} className="w-3.5 h-3.5 text-accent-secondary fill-accent-secondary" />
                                    ))}
                                </div>
                                <span className="text-xs font-mono font-bold text-accent bg-accent/[0.06] border border-accent/10 px-2.5 py-1 rounded">
                                    {testimonial.metric}
                                </span>
                            </div>

                            {/* Quote */}
                            <p className="text-text-secondary leading-relaxed mb-6 text-[15px]">
                                &ldquo;{testimonial.quote}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                {/* Avatar placeholder */}
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/20 to-accent-secondary/20 flex items-center justify-center text-xs font-bold text-accent">
                                    {testimonial.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div>
                                    <p className="font-semibold text-text-primary text-sm">{testimonial.name}</p>
                                    <p className="text-text-tertiary text-xs">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
