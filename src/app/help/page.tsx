import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { helpCategories } from "@/data/help-articles"
import { Search } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Help Center — RedProwler",
    description: "Get help with RedProwler. Guides for getting started, lead discovery, AI engagement, billing, and more.",
}

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-bg-primary grain">
            <LandingNavbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold font-[var(--font-display)] tracking-tight mb-4">
                        Help Center
                    </h1>
                    <p className="text-lg text-text-secondary mb-8">
                        Everything you need to get the most out of RedProwler.
                    </p>

                    <div className="max-w-md mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                        <input
                            type="text"
                            placeholder="Search help articles..."
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-secondary border border-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50 transition-colors"
                        />
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {helpCategories.map((category) => (
                        <div
                            key={category.title}
                            className="p-6 rounded-xl border border-border bg-bg-secondary/50 hover:border-border-hover transition-colors"
                        >
                            <category.icon className="w-6 h-6 text-accent mb-3" />
                            <h2 className="font-semibold text-text-primary mb-4">{category.title}</h2>
                            <ul className="space-y-2.5">
                                {category.articles.map((article) => (
                                    <li key={article.slug}>
                                        <Link
                                            href={`/help/${article.slug}`}
                                            className="text-sm text-text-secondary hover:text-accent transition-colors"
                                        >
                                            {article.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center p-8 rounded-xl border border-border bg-bg-secondary/50">
                    <h2 className="text-xl font-bold font-[var(--font-display)] mb-3">
                        Can&apos;t find what you need?
                    </h2>
                    <p className="text-text-secondary text-sm mb-5">
                        Reach out and we&apos;ll get back to you within 24 hours.
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors"
                    >
                        Contact Support
                    </a>
                </div>
            </main>

            <LandingFooter />
        </div>
    )
}
