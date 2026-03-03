import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { Target, Zap, Shield, Users } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "About — RedProwler",
    description: "Learn how RedProwler helps founders and marketers find customers on Reddit with AI-powered lead generation.",
}

const values = [
    {
        icon: Target,
        title: "Precision over volume",
        description: "We don't blast generic replies. RedProwler finds genuinely relevant conversations where your product is a natural fit.",
    },
    {
        icon: Zap,
        title: "Automation that respects",
        description: "Our AI generates helpful, human replies — not spam. We believe marketing works best when it actually helps people.",
    },
    {
        icon: Shield,
        title: "Transparent and honest",
        description: "No hidden fees, no dark patterns. Free tier is real, pricing is clear, and you own your data.",
    },
    {
        icon: Users,
        title: "Built for founders",
        description: "We're founders too. RedProwler is the tool we wished existed when we were trying to find our first 100 customers.",
    },
]

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-bg-primary grain">
            <LandingNavbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold font-[var(--font-display)] tracking-tight mb-6">
                        Reddit is where your customers <span className="text-accent">already are</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
                        Every day, thousands of people ask Reddit for product recommendations, share their pain points,
                        and look for solutions. RedProwler helps you find those conversations and join them authentically.
                    </p>
                </div>

                <div className="prose-invert max-w-none space-y-6 text-text-secondary leading-relaxed mb-20">
                    <p>
                        Most founders know Reddit is a goldmine for finding early customers. The problem? Manually
                        scrolling through dozens of subreddits, reading hundreds of posts, and figuring out which
                        ones are actually relevant takes hours every day.
                    </p>
                    <p>
                        RedProwler automates the discovery part. We monitor your target subreddits 24/7, use AI
                        to score each post for relevance to your product, and surface only the high-intent conversations
                        worth your time. Then our AI helps you craft replies that are genuinely helpful — because
                        the best marketing on Reddit doesn't feel like marketing at all.
                    </p>
                    <p>
                        We built RedProwler because we were tired of the spray-and-pray approach. The two-phase
                        scoring system (keyword pre-filter + AI analysis) means you get fewer, better leads instead
                        of a firehose of noise. And with competitor monitoring, you'll know the moment someone
                        mentions your competitors — so you can join the conversation.
                    </p>
                </div>

                <div className="mb-20">
                    <h2 className="text-2xl font-bold font-[var(--font-display)] tracking-tight mb-8 text-center">
                        What we believe
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {values.map((value) => (
                            <div key={value.title} className="p-6 rounded-xl border border-border bg-bg-secondary/50">
                                <value.icon className="w-6 h-6 text-accent mb-3" />
                                <h3 className="font-semibold text-text-primary mb-2">{value.title}</h3>
                                <p className="text-sm text-text-secondary leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center p-8 rounded-xl border border-border bg-bg-secondary/50">
                    <h2 className="text-xl font-bold font-[var(--font-display)] mb-3">
                        Ready to find your customers on Reddit?
                    </h2>
                    <p className="text-text-secondary text-sm mb-5">Start free — no credit card required.</p>
                    <a
                        href="/sign-up"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors"
                    >
                        Get Started
                    </a>
                </div>
            </main>

            <LandingFooter />
        </div>
    )
}
