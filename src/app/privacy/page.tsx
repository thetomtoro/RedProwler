import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { LandingFooter } from "@/components/landing/LandingFooter"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Privacy Policy — RedProwler",
    description: "Privacy Policy for RedProwler. Learn how we collect, use, and protect your data.",
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-bg-primary grain">
            <LandingNavbar />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-20">
                <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-display)] tracking-tight mb-2">
                    Privacy Policy
                </h1>
                <p className="text-text-tertiary text-sm mb-12">Last updated: March 2, 2026</p>

                <div className="space-y-8 text-text-secondary text-[15px] leading-relaxed">
                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">1. Information We Collect</h2>
                        <p className="mb-3">We collect the following types of information:</p>
                        <ul className="list-disc pl-6 space-y-1.5">
                            <li><strong className="text-text-primary">Account data:</strong> Name, email address, and profile image provided through Clerk authentication</li>
                            <li><strong className="text-text-primary">Product data:</strong> Product descriptions, keywords, and target subreddits you configure</li>
                            <li><strong className="text-text-primary">Usage data:</strong> Lead counts, AI generation usage, and feature interactions</li>
                            <li><strong className="text-text-primary">Payment data:</strong> Processed securely by Stripe — we never store card numbers</li>
                            <li><strong className="text-text-primary">Reddit data:</strong> Public posts and comments from subreddits you target (publicly available data)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">2. How We Use Your Data</h2>
                        <ul className="list-disc pl-6 space-y-1.5">
                            <li>Providing the lead discovery and AI generation service</li>
                            <li>Scoring Reddit posts for relevance to your products</li>
                            <li>Sending notifications about high-relevance leads</li>
                            <li>Processing payments and managing subscriptions</li>
                            <li>Improving our AI scoring and recommendation algorithms</li>
                            <li>Sending service-related communications (digest, usage alerts)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">3. Third-Party Services</h2>
                        <p className="mb-3">We use the following third-party services that process your data:</p>
                        <ul className="list-disc pl-6 space-y-1.5">
                            <li><strong className="text-text-primary">Clerk</strong> — Authentication and user management</li>
                            <li><strong className="text-text-primary">Stripe</strong> — Payment processing</li>
                            <li><strong className="text-text-primary">Anthropic (Claude)</strong> — AI-powered lead scoring and reply generation</li>
                            <li><strong className="text-text-primary">Neon</strong> — PostgreSQL database hosting</li>
                            <li><strong className="text-text-primary">Vercel</strong> — Application hosting and deployment</li>
                            <li><strong className="text-text-primary">Reddit API</strong> — Accessing public Reddit content</li>
                        </ul>
                        <p className="mt-3">
                            Each service has its own privacy policy. We only share the minimum data necessary for each service to function.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">4. Data Retention</h2>
                        <p>
                            Your account data is retained while your account is active. Leads and engagement data are
                            stored for the lifetime of your account. If you delete your account, all associated data
                            is permanently deleted within 30 days. Usage counters reset monthly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">5. Data Security</h2>
                        <p>
                            We implement industry-standard security measures including encrypted connections (HTTPS),
                            secure authentication via Clerk, encrypted database connections, and HMAC-signed webhook
                            payloads. API keys and secrets are stored as encrypted environment variables.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">6. Your Rights</h2>
                        <p className="mb-3">You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-1.5">
                            <li>Access your personal data through your account settings</li>
                            <li>Export your leads via CSV (available on Pro and Team plans)</li>
                            <li>Delete your account and all associated data</li>
                            <li>Opt out of non-essential communications</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">7. Cookies</h2>
                        <p>
                            We use essential cookies for authentication (via Clerk) and session management. We do not
                            use tracking cookies or sell data to advertisers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">8. Contact</h2>
                        <p>
                            For privacy-related questions or requests, contact us at{" "}
                            <a href="mailto:privacy@redprowler.com" className="text-accent hover:underline">
                                privacy@redprowler.com
                            </a>.
                        </p>
                    </section>
                </div>
            </main>

            <LandingFooter />
        </div>
    )
}
