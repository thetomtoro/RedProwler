"use client"

import { useState, useRef, useEffect } from "react"
import { Bell } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface Notification {
    id: string
    type: string
    title: string
    body: string | null
    read: boolean
    createdAt: string
}

interface NotificationsResponse {
    data: Notification[]
    meta: {
        unreadCount: number
        nextCursor: string | null
    }
}

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const queryClient = useQueryClient()

    const { data } = useQuery<NotificationsResponse>({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await fetch("/api/notifications?limit=10")
            if (!res.ok) throw new Error("Failed to fetch")
            return res.json()
        },
        refetchInterval: 60_000,
    })

    const markReadMutation = useMutation({
        mutationFn: async (ids: string[]) => {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids }),
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
        },
    })

    const markAllReadMutation = useMutation({
        mutationFn: async () => {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ all: true }),
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
        },
    })

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const unreadCount = data?.meta?.unreadCount ?? 0
    const notifications = data?.data ?? []

    const handleOpen = () => {
        const willOpen = !isOpen
        setIsOpen(willOpen)
        if (willOpen && notifications.length > 0) {
            const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id)
            if (unreadIds.length > 0) {
                markReadMutation.mutate(unreadIds)
            }
        }
    }

    const formatTime = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const minutes = Math.floor(diff / 60000)
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        return `${Math.floor(hours / 24)}d ago`
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleOpen}
                className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors cursor-pointer"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full shadow-[0_0_6px_rgba(230,57,70,0.4)]" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-bg-secondary border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="flex items-center justify-between p-3 border-b border-border">
                        <span className="text-sm font-medium text-text-primary">Notifications</span>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllReadMutation.mutate()}
                                className="text-xs text-text-tertiary hover:text-text-secondary cursor-pointer"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-text-tertiary">
                            No notifications yet
                        </div>
                    ) : (
                        <div>
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`p-3 border-b border-border/50 hover:bg-bg-tertiary/50 transition-colors ${
                                        !n.read ? "bg-bg-tertiary/30" : ""
                                    }`}
                                >
                                    <p className="text-sm font-medium text-text-primary">{n.title}</p>
                                    {n.body && (
                                        <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{n.body}</p>
                                    )}
                                    <p className="text-xs text-text-tertiary mt-1">{formatTime(n.createdAt)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
