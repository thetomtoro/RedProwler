"use client"

import { UserButton } from "@clerk/nextjs"
import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/Input"

export function Navbar() {
    return (
        <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-bg-secondary/80 backdrop-blur-sm">
            {/* Search */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <Input
                        placeholder="Search leads, templates..."
                        className="pl-9 bg-bg-tertiary border-border/50"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors cursor-pointer">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full shadow-[0_0_6px_rgba(230,57,70,0.4)]" />
                </button>

                {/* User */}
                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: "w-8 h-8",
                        },
                    }}
                />
            </div>
        </header>
    )
}
