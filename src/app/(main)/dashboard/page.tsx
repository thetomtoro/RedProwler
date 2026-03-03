"use client"

import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Target, MessageSquareText, TrendingUp, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { formatRelativeTime, truncate } from "@/lib/utils"

interface DashboardData {
    totalLeads: number
    totalEngagements: number
    engagementRate: number
    conversions: number
}

interface Lead {
    id: string
    title?: string
    body: string
    relevanceScore: number
    status: string
    createdAt: string
    subreddit: { name: string } | null
    product: { name: string }
}

export default function DashboardPage() {
    const { data: analytics } = useQuery({
        queryKey: ["analytics"],
        queryFn: async () => {
            const res = await fetch("/api/analytics")
            if (!res.ok) return null
            const json = await res.json()
            return (json.data as DashboardData) ?? null
        },
    })

    const { data: recentLeads } = useQuery({
        queryKey: ["leads", "recent"],
        queryFn: async () => {
            const res = await fetch("/api/leads?limit=5")
            if (!res.ok) return []
            const json = await res.json()
            return (json.data as Lead[]) ?? []
        },
    })

    const stats = [
        {
            label: "Leads Found",
            value: analytics?.totalLeads ?? 0,
            change: "+0 this week",
            icon: Target,
            color: "text-accent",
            bgColor: "bg-accent-muted",
        },
        {
            label: "Replies Generated",
            value: analytics?.totalEngagements ?? 0,
            change: "+0 this week",
            icon: MessageSquareText,
            color: "text-success",
            bgColor: "bg-success/10",
        },
        {
            label: "Engagement Rate",
            value: `${analytics?.engagementRate ?? 0}%`,
            change: "Based on all leads",
            icon: TrendingUp,
            color: "text-warning",
            bgColor: "bg-warning/10",
        },
        {
            label: "Conversions",
            value: analytics?.conversions ?? 0,
            change: "+0 this month",
            icon: Users,
            color: "text-accent-secondary",
            bgColor: "bg-accent-secondary/10",
        },
    ]

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-text-secondary mt-1">
                    Overview of your lead generation performance.
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-text-secondary">{stat.label}</p>
                                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                <p className="text-xs text-text-tertiary mt-1">{stat.change}</p>
                            </div>
                            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Recent leads + Quick actions */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Recent Leads</h2>
                            {recentLeads && recentLeads.length > 0 && (
                                <Link href="/leads">
                                    <Button variant="ghost" size="sm">
                                        View All <ArrowRight className="w-3.5 h-3.5" />
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {(!recentLeads || recentLeads.length === 0) ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-12 h-12 rounded-xl bg-bg-tertiary flex items-center justify-center mb-4">
                                    <Target className="w-6 h-6 text-text-tertiary" />
                                </div>
                                <p className="text-text-secondary font-medium">No leads yet</p>
                                <p className="text-text-tertiary text-sm mt-1">
                                    Add a product to start discovering leads from Reddit and Hacker News.
                                </p>
                                <Link href="/products/new" className="mt-3">
                                    <Button variant="primary" size="sm">Add Product</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentLeads.map((lead) => (
                                    <Link key={lead.id} href={`/leads/${lead.id}`}>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary hover:bg-bg-quaternary transition-colors">
                                            <div className="min-w-0 flex-1 mr-3">
                                                <p className="text-sm font-medium truncate">
                                                    {lead.title || truncate(lead.body, 60)}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-text-tertiary">{lead.subreddit ? `r/${lead.subreddit.name}` : "HN"}</span>
                                                    <Badge variant={lead.relevanceScore >= 0.7 ? "success" : lead.relevanceScore >= 0.4 ? "warning" : "default"}>
                                                        {Math.round(lead.relevanceScore * 100)}%
                                                    </Badge>
                                                </div>
                                            </div>
                                            <span className="text-xs text-text-tertiary whitespace-nowrap">
                                                {formatRelativeTime(new Date(lead.createdAt))}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                <div>
                    <Card>
                        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link
                                href="/products/new"
                                className="flex items-center gap-3 p-3 rounded-lg bg-bg-tertiary hover:bg-bg-quaternary transition-colors"
                            >
                                <div className="w-8 h-8 rounded-md bg-accent-muted flex items-center justify-center">
                                    <Target className="w-4 h-4 text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Add Product</p>
                                    <p className="text-xs text-text-tertiary">Start tracking leads</p>
                                </div>
                            </Link>
                            <Link
                                href="/templates"
                                className="flex items-center gap-3 p-3 rounded-lg bg-bg-tertiary hover:bg-bg-quaternary transition-colors"
                            >
                                <div className="w-8 h-8 rounded-md bg-success/10 flex items-center justify-center">
                                    <MessageSquareText className="w-4 h-4 text-success" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Browse Templates</p>
                                    <p className="text-xs text-text-tertiary">50+ viral templates</p>
                                </div>
                            </Link>
                            <Link
                                href="/analytics"
                                className="flex items-center gap-3 p-3 rounded-lg bg-bg-tertiary hover:bg-bg-quaternary transition-colors"
                            >
                                <div className="w-8 h-8 rounded-md bg-warning/10 flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-warning" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">View Analytics</p>
                                    <p className="text-xs text-text-tertiary">Track performance</p>
                                </div>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
