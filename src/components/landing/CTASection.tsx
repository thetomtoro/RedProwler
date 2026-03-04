import { Button } from "@/components/ui/Button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
    return (
        <section className="py-24 px-4 sm:px-6 relative">
            <div className="section-divider absolute top-0 left-0 right-0" />

            <div className="max-w-4xl mx-auto relative">
                {/* Background thermal glow */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(230,57,70,0.08)_0%,rgba(255,109,0,0.04)_40%,transparent_70%)]" />
                </div>

                <div className="text-center rounded-2xl border border-accent/10 bg-bg-secondary/60 backdrop-blur-sm p-12 sm:p-16 relative overflow-hidden">
                    {/* Scan lines */}
                    <div className="scan-lines absolute inset-0 pointer-events-none" />

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-8 h-[2px] bg-accent/40" />
                    <div className="absolute top-0 left-0 w-[2px] h-8 bg-accent/40" />
                    <div className="absolute top-0 right-0 w-8 h-[2px] bg-accent/40" />
                    <div className="absolute top-0 right-0 w-[2px] h-8 bg-accent/40" />
                    <div className="absolute bottom-0 left-0 w-8 h-[2px] bg-accent/40" />
                    <div className="absolute bottom-0 left-0 w-[2px] h-8 bg-accent/40" />
                    <div className="absolute bottom-0 right-0 w-8 h-[2px] bg-accent/40" />
                    <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-accent/40" />

                    <div className="relative">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Start Finding Leads on{" "}
                            <span className="gradient-text">Reddit Today</span>
                        </h2>
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">
                            Your future customers are posting on Reddit right now.
                            RedProwler finds them, scores them, and helps you respond
                            — starting with a free plan.
                        </p>
                        <Link href="/sign-up">
                            <Button variant="cta" size="lg" className="min-w-[220px]">
                                Start Growing Today <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>

                        {/* Trust signals */}
                        <div className="mt-10 flex items-center justify-center gap-5 text-text-tertiary text-sm">
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                                No credit card required
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                                Free plan available
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                                Cancel anytime
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
