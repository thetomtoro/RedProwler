import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { Hero } from "@/components/landing/Hero"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { AIScoring } from "@/components/landing/AIScoring"
import { CompetitorMonitoring } from "@/components/landing/CompetitorMonitoring"
import { Features } from "@/components/landing/Features"
import { Pricing } from "@/components/landing/Pricing"
import { FAQ } from "@/components/landing/FAQ"
import { CTASection } from "@/components/landing/CTASection"
import { LandingFooter } from "@/components/landing/LandingFooter"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-bg-primary grain">
            <LandingNavbar />
            <Hero />
            <HowItWorks />
            <AIScoring />
            <CompetitorMonitoring />
            <Features />
            <Pricing />
            <FAQ />
            <CTASection />
            <LandingFooter />
        </div>
    )
}
