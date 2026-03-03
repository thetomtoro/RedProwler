import Link from "next/link"

const footerLinks = {
    Product: [
        { label: "Features", href: "/#features" },
        { label: "Pricing", href: "/#pricing" },
        { label: "Templates", href: "/templates" },
    ],
    Company: [
        { label: "About", href: "/about" },
        { label: "Terms", href: "/terms" },
        { label: "Privacy", href: "/privacy" },
    ],
    Resources: [
        { label: "Blog", href: "/blog" },
        { label: "Help Center", href: "/help" },
        { label: "Contact", href: "/contact" },
    ],
}

export function LandingFooter() {
    return (
        <footer className="border-t border-border py-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            {/* Inline mini radar */}
                            <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5 text-accent">
                                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                                <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                                <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                                <line x1="16" y1="16" x2="28" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                                <circle cx="16" cy="16" r="2" fill="currentColor" />
                            </svg>
                            <span className="font-bold font-[var(--font-display)] tracking-tight text-text-primary">
                                Red<span className="text-accent">Prowler</span>
                            </span>
                        </Link>
                        <p className="text-text-tertiary text-sm leading-relaxed">
                            AI-powered Reddit lead generation for founders, indie hackers, and marketers.
                        </p>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="font-semibold text-text-secondary text-sm mb-4 uppercase tracking-wider text-[11px]">{category}</h4>
                            <ul className="space-y-2.5">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-text-tertiary hover:text-text-primary transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-text-tertiary text-sm">
                        &copy; {new Date().getFullYear()} RedProwler. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://x.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-tertiary hover:text-text-primary text-sm transition-colors"
                        >
                            Twitter / X
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
