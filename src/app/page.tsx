import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { Hero } from "@/components/landing/Hero"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { Features } from "@/components/landing/Features"
import { Pricing } from "@/components/landing/Pricing"
import { Testimonials } from "@/components/landing/Testimonials"
import { FAQ } from "@/components/landing/FAQ"
import { CTASection } from "@/components/landing/CTASection"
import { LandingFooter } from "@/components/landing/LandingFooter"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-bg-primary grain">
            <LandingNavbar />
            <Hero />
            <HowItWorks />
            <Features />
            <Testimonials />
            <Pricing />
            <FAQ />
            <CTASection />
            <LandingFooter />
        </div>
    )
}
