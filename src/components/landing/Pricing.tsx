import { Button } from "@/components/ui/Button"
import { Check, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface PlanFeature {
    text: string
    included: boolean
}

interface Plan {
    name: string
    price: number
    description: string
    features: PlanFeature[]
    cta: string
    popular?: boolean
}

const plans: Plan[] = [
    {
        name: "Starter",
        price: 0,
        description: "Get started for free",
        cta: "Start Free",
        features: [
            { text: "1 product", included: true },
            { text: "3 subreddits per product", included: true },
            { text: "50 leads per month", included: true },
            { text: "20 AI generations per month", included: true },
            { text: "50+ viral templates", included: true },
            { text: "Competitor monitoring", included: false },
            { text: "Slack & webhook alerts", included: false },
            { text: "CSV export", included: false },
        ],
    },
    {
        name: "Pro",
        price: 29,
        description: "For serious founders",
        cta: "Start 7-Day Trial",
        popular: true,
        features: [
            { text: "5 products", included: true },
            { text: "20 subreddits per product", included: true },
            { text: "1,000 leads per month", included: true },
            { text: "500 AI generations per month", included: true },
            { text: "50+ viral templates", included: true },
            { text: "Competitor monitoring", included: true },
            { text: "Slack & webhook alerts", included: true },
            { text: "CSV export", included: true },
        ],
    },
    {
        name: "Team",
        price: 79,
        description: "For growing teams",
        cta: "Start 7-Day Trial",
        features: [
            { text: "20 products", included: true },
            { text: "50 subreddits per product", included: true },
            { text: "5,000 leads per month", included: true },
            { text: "2,000 AI generations per month", included: true },
            { text: "50+ viral templates", included: true },
            { text: "Competitor monitoring", included: true },
            { text: "Slack & webhook alerts", included: true },
            { text: "Up to 10 team members", included: true },
        ],
    },
]

export function Pricing() {
    return (
        <section id="pricing" className="py-24 px-4 sm:px-6 relative">
            <div className="section-divider absolute top-0 left-0 right-0" />

            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/15 bg-accent/[0.04] mb-6">
                        <span className="w-1 h-1 rounded-full bg-accent" />
                        <span className="text-xs font-mono text-accent uppercase tracking-widest">Pricing</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Start free, upgrade when you&apos;re ready. No hidden fees, cancel anytime.
                    </p>
                </div>

                {/* Plans */}
                <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
                    {plans.map((plan, i) => (
                        <div
                            key={plan.name}
                            className={cn(
                                "relative rounded-xl border p-8 flex flex-col transition-all duration-300 animate-fade-in-up",
                                plan.popular
                                    ? "bg-bg-secondary border-accent/30 shadow-[0_0_40px_rgba(230,57,70,0.08),inset_0_1px_0_rgba(255,255,255,0.03)]"
                                    : "bg-bg-secondary border-border hover:border-border-hover"
                            )}
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="px-4 py-1 rounded-full bg-gradient-to-r from-accent to-accent-secondary text-white text-xs font-semibold shadow-[0_4px_12px_rgba(230,57,70,0.3)]">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                                <p className="text-text-tertiary text-sm">{plan.description}</p>
                            </div>

                            <div className="mb-6">
                                <span className="text-4xl font-bold font-mono">
                                    ${plan.price}
                                </span>
                                <span className="text-text-tertiary text-sm">/month</span>
                            </div>

                            <Link href="/sign-up" className="mb-6">
                                <Button
                                    variant={plan.popular ? "cta" : "secondary"}
                                    size="md"
                                    className="w-full"
                                >
                                    {plan.cta}
                                </Button>
                            </Link>

                            <div className="flex-1 space-y-3">
                                {plan.features.map((feature) => (
                                    <div key={feature.text} className="flex items-center gap-3">
                                        {feature.included ? (
                                            <div className="w-4 h-4 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                                                <Check className="w-2.5 h-2.5 text-success" />
                                            </div>
                                        ) : (
                                            <X className="w-4 h-4 text-text-tertiary/50 shrink-0" />
                                        )}
                                        <span
                                            className={cn(
                                                "text-sm",
                                                feature.included ? "text-text-secondary" : "text-text-tertiary/60"
                                            )}
                                        >
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
