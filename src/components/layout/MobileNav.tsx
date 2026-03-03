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

const mobileItems = NAV_ITEMS.slice(0, 5)

export function MobileNav() {
    const pathname = usePathname()

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border">
            <div className="flex items-center justify-around h-16">
                {mobileItems.map((item) => {
                    const Icon = iconMap[item.icon]
                    const isActive = pathname.startsWith(item.href)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 px-3 py-1.5",
                                isActive ? "text-accent" : "text-text-tertiary"
                            )}
                        >
                            {Icon && <Icon className="w-5 h-5" />}
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
