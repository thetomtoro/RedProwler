"use client"

import { cn } from "@/lib/utils"
import { NAV_ITEMS } from "@/constants"
import {
    LayoutDashboard,
    Package,
    Target,
    FileText,
    BarChart3,
    Eye,
    Settings,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
    LayoutDashboard,
    Package,
    Target,
    FileText,
    BarChart3,
    Eye,
    Settings,
}

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden lg:flex flex-col w-60 h-screen border-r border-border bg-bg-secondary shrink-0">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-6 h-16 border-b border-border">
                <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5 text-accent">
                    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                    <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                    <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                    <line x1="16" y1="16" x2="28" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                    <circle cx="16" cy="16" r="2" fill="currentColor" />
                </svg>
                <span className="font-bold font-[var(--font-display)] tracking-tight text-text-primary">
                    Red<span className="text-accent">Pulse</span>
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const Icon = iconMap[item.icon]
                    const isActive = pathname.startsWith(item.href)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative",
                                isActive
                                    ? "bg-accent/[0.08] text-accent"
                                    : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                            )}
                        >
                            {/* Active indicator bar */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-accent to-accent-secondary" />
                            )}
                            {Icon && <Icon className="w-4.5 h-4.5" />}
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom upgrade CTA */}
            <div className="p-4 border-t border-border">
                <div className="rounded-lg bg-gradient-to-br from-accent/[0.06] to-accent-secondary/[0.04] border border-accent/10 p-4">
                    <p className="text-sm font-semibold text-accent mb-1">Upgrade to Pro</p>
                    <p className="text-xs text-text-tertiary mb-3">
                        Get 1,000 leads/month and competitor monitoring.
                    </p>
                    <Link
                        href="/settings"
                        className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
                    >
                        View Plans →
                    </Link>
                </div>
            </div>
        </aside>
    )
}
