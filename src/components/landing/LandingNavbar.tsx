"use client"

import { Button } from "@/components/ui/Button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@clerk/nextjs"

const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
]

function RadarLogo({ className = "w-7 h-7" }: { className?: string }) {
    return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
            {/* Outer ring */}
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            {/* Middle ring */}
            <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            {/* Inner ring */}
            <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
            {/* Sweep line */}
            <line x1="16" y1="16" x2="28" y2="10" stroke="url(#sweep-grad)" strokeWidth="2" strokeLinecap="round" />
            {/* Center dot */}
            <circle cx="16" cy="16" r="2" fill="currentColor" />
            {/* Signal dot */}
            <circle cx="23" cy="10" r="2.5" fill="#ff6d00" opacity="0.9" />
            <defs>
                <linearGradient id="sweep-grad" x1="16" y1="16" x2="28" y2="10">
                    <stop stopColor="currentColor" stopOpacity="0.8" />
                    <stop offset="1" stopColor="currentColor" stopOpacity="0.2" />
                </linearGradient>
            </defs>
        </svg>
    )
}

export function LandingNavbar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const { isSignedIn } = useAuth()

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <span className="text-accent transition-transform duration-200 group-hover:scale-110">
                            <RadarLogo />
                        </span>
                        <span className="text-lg font-bold font-[var(--font-display)] tracking-tight text-text-primary">
                            Red<span className="text-accent">Pulse</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-sm text-text-secondary hover:text-text-primary transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-accent/50 after:transition-all hover:after:w-full"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        {isSignedIn ? (
                            <Link href="/dashboard">
                                <Button variant="primary" size="sm">Dashboard</Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/sign-in">
                                    <Button variant="ghost" size="sm">Log In</Button>
                                </Link>
                                <Link href="/sign-up">
                                    <Button variant="primary" size="sm">Start Free</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden text-text-secondary hover:text-text-primary p-2"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile nav */}
            {mobileOpen && (
                <div className="md:hidden border-t border-border bg-bg-secondary animate-fade-in">
                    <div className="px-4 py-4 flex flex-col gap-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="text-sm text-text-secondary hover:text-text-primary py-2"
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="flex gap-3 pt-3 border-t border-border">
                            {isSignedIn ? (
                                <Link href="/dashboard" className="flex-1">
                                    <Button variant="primary" size="sm" className="w-full">Dashboard</Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/sign-in" className="flex-1">
                                        <Button variant="secondary" size="sm" className="w-full">Log In</Button>
                                    </Link>
                                    <Link href="/sign-up" className="flex-1">
                                        <Button variant="primary" size="sm" className="w-full">Start Free</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
