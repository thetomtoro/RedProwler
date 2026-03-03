"use client"

import { UserButton } from "@clerk/nextjs"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { NotificationBell } from "@/components/layout/NotificationBell"

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
                <NotificationBell />

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
