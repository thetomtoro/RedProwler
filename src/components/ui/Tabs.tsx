"use client"

import { cn } from "@/lib/utils"

interface Tab {
    id: string
    label: string
}

interface TabsProps {
    tabs: Tab[]
    activeTab: string
    onChange: (id: string) => void
    className?: string
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
    return (
        <div className={cn("flex gap-1 p-1 rounded-lg bg-bg-tertiary", className)}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={cn(
                        "px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 cursor-pointer",
                        activeTab === tab.id
                            ? "bg-bg-quaternary text-text-primary shadow-sm"
                            : "text-text-secondary hover:text-text-primary"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
}
