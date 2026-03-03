import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { ArrowRight } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Blog — RedProwler",
    description: "Tips, strategies, and insights on Reddit marketing, lead generation, and growing your startup.",
}

const posts = [
    {
        title: "How to Find Your First 100 Customers on Reddit",
        excerpt: "A step-by-step guide to identifying high-intent subreddits, crafting authentic replies, and converting Reddit users into paying customers without getting banned.",
        date: "Mar 2, 2026",
        readTime: "8 min read",
        category: "Strategy",
    },
    {
        title: "The Two-Phase Lead Scoring System Explained",
        excerpt: "How RedProwler's hybrid keyword + AI scoring pipeline saves 70% on costs while finding better leads than pure AI approaches.",
        date: "Feb 28, 2026",
        readTime: "5 min read",
        category: "Product",
    },
    {
        title: "Reddit Marketing in 2026: What's Changed",
        excerpt: "Reddit's algorithm updates, new community guidelines, and what they mean for founders using the platform for growth. Plus the tactics that still work.",
        date: "Feb 25, 2026",
        readTime: "6 min read",
        category: "Insights",
    },
    {
        title: "50 Reddit Reply Templates That Actually Convert",
        excerpt: "We analyzed thousands of high-performing Reddit replies to build our template library. Here's what makes a reply go from ignored to upvoted.",
        date: "Feb 20, 2026",
        readTime: "10 min read",
        category: "Templates",
    },
    {
        title: "Competitor Monitoring on Reddit: A Complete Guide",
        excerpt: "How to track competitor mentions, analyze sentiment, and use competitive intelligence to position your product in Reddit conversations.",
        date: "Feb 15, 2026",
        readTime: "7 min read",
        category: "Strategy",
    },
]

const categoryColors: Record<string, string> = {
    Strategy: "text-accent",
    Product: "text-emerald-400",
    Insights: "text-amber-400",
    Templates: "text-violet-400",
}

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-bg-primary grain">
            <LandingNavbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold font-[var(--font-display)] tracking-tight mb-4">
                        Blog
                    </h1>
                    <p className="text-lg text-text-secondary">
                        Reddit marketing strategies, product updates, and growth insights.
                    </p>
                </div>

                <div className="space-y-6">
                    {posts.map((post) => (
                        <article
                            key={post.title}
                            className="group p-6 rounded-xl border border-border bg-bg-secondary/50 hover:border-border-hover transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`text-xs font-medium ${categoryColors[post.category] || "text-text-tertiary"}`}>
                                    {post.category}
                                </span>
                                <span className="text-text-tertiary text-xs">{post.date}</span>
                                <span className="text-text-tertiary text-xs">{post.readTime}</span>
                            </div>
                            <h2 className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors mb-2">
                                {post.title}
                            </h2>
                            <p className="text-sm text-text-secondary leading-relaxed mb-3">
                                {post.excerpt}
                            </p>
                            <span className="inline-flex items-center gap-1 text-sm text-accent font-medium">
                                Read more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                        </article>
                    ))}
                </div>
            </main>

            <LandingFooter />
        </div>
    )
}
