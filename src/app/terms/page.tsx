import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { LandingFooter } from "@/components/landing/LandingFooter"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Terms of Service — RedProwler",
    description: "Terms of Service for RedProwler, the AI-powered Reddit lead generation platform.",
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-bg-primary grain">
            <LandingNavbar />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-20">
                <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-display)] tracking-tight mb-2">
                    Terms of Service
                </h1>
                <p className="text-text-tertiary text-sm mb-12">Last updated: March 2, 2026</p>

                <div className="space-y-8 text-text-secondary text-[15px] leading-relaxed">
                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using RedProwler (&quot;the Service&quot;), you agree to be bound by these Terms
                            of Service. If you do not agree, do not use the Service. We may update these terms from
                            time to time, and continued use constitutes acceptance of changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">2. Description of Service</h2>
                        <p>
                            RedProwler is an AI-powered platform that monitors Reddit for lead generation opportunities.
                            We scan public subreddits, score posts for relevance to your products, and help generate
                            reply suggestions. The Service is provided &quot;as is&quot; and we make no guarantees about
                            specific results or lead conversion rates.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">3. Account Registration</h2>
                        <p>
                            You must provide accurate information when creating an account. You are responsible for
                            maintaining the security of your account credentials. You must be at least 18 years old
                            to use the Service. One person or entity may not maintain more than one free account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">4. Acceptable Use</h2>
                        <p className="mb-3">You agree not to:</p>
                        <ul className="list-disc pl-6 space-y-1.5">
                            <li>Use the Service to spam, harass, or deceive Reddit users</li>
                            <li>Violate Reddit&apos;s Terms of Service or Content Policy</li>
                            <li>Use automated tools to post AI-generated replies without review</li>
                            <li>Impersonate other users or misrepresent your affiliation</li>
                            <li>Attempt to circumvent plan limits or usage restrictions</li>
                            <li>Reverse engineer, decompile, or attempt to extract source code</li>
                            <li>Use the Service for any illegal purpose</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">5. Billing and Subscriptions</h2>
                        <p>
                            Paid plans are billed monthly via Stripe. You can cancel at any time through the billing
                            portal. Cancellation takes effect at the end of the current billing period. We do not
                            offer prorated refunds for partial months. Plan limits reset on the first of each calendar
                            month (UTC).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">6. Intellectual Property</h2>
                        <p>
                            The Service, its design, code, and branding are owned by RedProwler. AI-generated reply
                            suggestions are provided as starting points — you own the final content you choose to post.
                            Reddit content accessed through the Service is subject to Reddit&apos;s own terms and licenses.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">7. Limitation of Liability</h2>
                        <p>
                            RedProwler is not liable for any indirect, incidental, or consequential damages arising
                            from your use of the Service. Our total liability is limited to the amount you paid in
                            the 12 months preceding the claim. We are not responsible for actions taken by Reddit
                            against your account based on your use of generated replies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">8. Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate accounts that violate these terms. You may
                            delete your account at any time. Upon termination, your data will be deleted within 30 days.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">9. Contact</h2>
                        <p>
                            Questions about these terms? Contact us at{" "}
                            <a href="mailto:support@redprowler.com" className="text-accent hover:underline">
                                support@redprowler.com
                            </a>.
                        </p>
                    </section>
                </div>
            </main>

            <LandingFooter />
        </div>
    )
}
