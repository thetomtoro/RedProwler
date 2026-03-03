import { Globe, Radar, MessageSquareText } from "lucide-react"

const steps = [
    {
        number: "01",
        icon: Globe,
        title: "Describe Your Product",
        description:
            "Enter your product URL or describe it manually. Our AI auto-generates your product profile and recommends the best subreddits to target.",
        detail: "Takes 60 seconds",
    },
    {
        number: "02",
        icon: Radar,
        title: "We Find Your Leads",
        description:
            "RedProwler monitors Reddit 24/7, scanning thousands of posts and comments. Our two-phase AI scoring surfaces only the most relevant, high-intent prospects.",
        detail: "Always scanning",
    },
    {
        number: "03",
        icon: MessageSquareText,
        title: "Engage & Convert",
        description:
            "Get AI-generated conversation starters, reply suggestions, and DM templates. Craft authentic responses that convert readers into customers.",
        detail: "AI-powered replies",
    },
]

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 px-4 sm:px-6 relative">
            <div className="section-divider absolute top-0 left-0 right-0" />

            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/15 bg-accent/[0.04] mb-6">
                        <span className="w-1 h-1 rounded-full bg-accent" />
                        <span className="text-xs font-mono text-accent uppercase tracking-widest">Process</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Three Steps to Reddit Growth
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Set up once, get leads forever. No manual monitoring, no spammy outreach.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative grid md:grid-cols-3 gap-8">
                    {/* Connecting line (desktop) */}
                    <div className="hidden md:block absolute top-[72px] left-[16.67%] right-[16.67%] h-[1px]">
                        <div className="w-full h-full bg-gradient-to-r from-accent/30 via-accent-secondary/20 to-accent/30" />
                    </div>

                    {steps.map((step, i) => (
                        <div key={step.number} className="relative group animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                            <div className="rounded-xl bg-bg-secondary border border-border p-8 h-full transition-all duration-300 hover:border-accent/20 relative overflow-hidden">
                                {/* Background number */}
                                <span className="absolute -right-3 -top-4 text-[7rem] font-extrabold text-bg-tertiary/50 leading-none select-none pointer-events-none transition-colors group-hover:text-accent/[0.04]">
                                    {step.number}
                                </span>

                                <div className="relative">
                                    {/* Icon with numbered badge */}
                                    <div className="relative w-14 h-14 mb-6">
                                        <div className="w-14 h-14 rounded-xl bg-accent/[0.08] border border-accent/10 flex items-center justify-center group-hover:bg-accent/15 transition-colors">
                                            <step.icon className="w-6 h-6 text-accent" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_12px_rgba(230,57,70,0.3)]">
                                            {step.number}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                    <p className="text-text-secondary leading-relaxed mb-4">{step.description}</p>

                                    {/* Detail tag */}
                                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-accent/70">
                                        <span className="w-1 h-1 rounded-full bg-accent/50" />
                                        {step.detail}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
