"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const faqs = [
    {
        question: "How does RedPulse find leads on Reddit?",
        answer: "RedPulse uses Reddit's official API to monitor your targeted subreddits 24/7. Our two-phase scoring system first filters posts using keyword matching and intent signals, then uses AI to score only the most promising leads for relevance. This means you only see high-quality prospects, not noise.",
    },
    {
        question: "Will using RedPulse get my Reddit account banned?",
        answer: "No. RedPulse is designed to work within Reddit's terms of service. We use the official Reddit API, never automate posting, and never use black-hat techniques. RedPulse generates reply suggestions that you review and post yourself — keeping you in full control.",
    },
    {
        question: "What subreddits can I target?",
        answer: "You can target any public subreddit. When you describe your product, our AI recommends the most relevant subreddits based on your target audience, industry, and product type. You can also add subreddits manually.",
    },
    {
        question: "How are the AI replies generated?",
        answer: "RedPulse uses Claude AI to analyze each lead's context — the post content, subreddit culture, and your product description — to generate natural, helpful conversation starters. The replies are designed to be authentic and value-adding, not promotional spam.",
    },
    {
        question: "Can I use RedPulse with a team?",
        answer: "Yes! Our Team plan ($79/month) supports up to 10 team members with role-based access. Everyone shares the same lead feed, templates, and analytics dashboard.",
    },
    {
        question: "What happens when I reach my lead limit?",
        answer: "On the free Starter plan, you'll see up to 50 leads per month. Once you hit the limit, monitoring pauses until the next billing cycle. You can upgrade to Pro (1,000 leads) or Team (5,000 leads) at any time — your existing leads and data are preserved.",
    },
    {
        question: "Do you offer refunds?",
        answer: "Yes. All paid plans come with a 7-day free trial. If you're not satisfied, cancel within the trial period and you won't be charged. After the trial, you can cancel anytime and retain access through the end of your billing cycle.",
    },
]

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section id="faq" className="py-24 px-4 sm:px-6 relative">
            <div className="section-divider absolute top-0 left-0 right-0" />

            <div className="max-w-3xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/15 bg-accent/[0.04] mb-6">
                        <span className="w-1 h-1 rounded-full bg-accent" />
                        <span className="text-xs font-mono text-accent uppercase tracking-widest">FAQ</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Frequently Asked Questions
                    </h2>
                </div>

                {/* FAQ items */}
                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={cn(
                                "rounded-xl border bg-bg-secondary overflow-hidden transition-all duration-200",
                                openIndex === index ? "border-accent/20" : "border-border"
                            )}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 text-left cursor-pointer group"
                            >
                                <span className="font-medium text-text-primary pr-4 group-hover:text-accent transition-colors">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={cn(
                                        "w-5 h-5 text-text-tertiary shrink-0 transition-all duration-200",
                                        openIndex === index && "rotate-180 text-accent"
                                    )}
                                />
                            </button>
                            <div
                                className={cn(
                                    "grid transition-all duration-200",
                                    openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                )}
                            >
                                <div className="overflow-hidden">
                                    <div className="px-5 pb-5">
                                        <div className="w-8 h-[2px] bg-gradient-to-r from-accent to-accent-secondary rounded-full mb-3" />
                                        <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
