"use client"

import { Card } from "@/components/ui/Card"
import { Target, MessageSquareText, TrendingUp, Users, BarChart3 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts"

interface AnalyticsData {
    totalLeads: number
    totalEngagements: number
    engagementRate: number
    conversions: number
    leadsOverTime: Array<{ date: string; count: number }>
    statusBreakdown: Array<{ status: string; count: number }>
    subredditBreakdown: Array<{ subreddit: string; count: number }>
}

const STATUS_LABELS: Record<string, string> = {
    NEW: "New Leads",
    VIEWED: "Viewed",
    ENGAGED: "Engaged",
    CONVERTED: "Converted",
    DISMISSED: "Dismissed",
}

export default function AnalyticsPage() {
    const { data, isLoading } = useQuery({
        queryKey: ["analytics"],
        queryFn: async () => {
            const res = await fetch("/api/analytics")
            const json = await res.json()
            return json.data as AnalyticsData
        },
    })

    const stats = [
        {
            label: "Total Leads",
            value: data?.totalLeads ?? 0,
            icon: Target,
            color: "text-accent",
            bgColor: "bg-accent-muted",
        },
        {
            label: "Replies Generated",
            value: data?.totalEngagements ?? 0,
            icon: MessageSquareText,
            color: "text-success",
            bgColor: "bg-success/10",
        },
        {
            label: "Engagement Rate",
            value: `${data?.engagementRate ?? 0}%`,
            icon: TrendingUp,
            color: "text-warning",
            bgColor: "bg-warning/10",
        },
        {
            label: "Conversions",
            value: data?.conversions ?? 0,
            icon: Users,
            color: "text-accent-secondary",
            bgColor: "bg-accent-secondary/10",
        },
    ]

    const funnelData = data?.statusBreakdown ?? []
    const funnelOrder = ["NEW", "VIEWED", "ENGAGED", "CONVERTED"]
    const sortedFunnel = funnelOrder
        .map((status) => ({
            label: STATUS_LABELS[status] || status,
            count: funnelData.find((f) => f.status === status)?.count ?? 0,
        }))

    const maxFunnelCount = Math.max(...sortedFunnel.map((f) => f.count), 1)

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Analytics</h1>
                <p className="text-text-secondary mt-1">
                    Track your Reddit lead generation performance and ROI.
                </p>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-text-secondary">{stat.label}</p>
                                {isLoading ? (
                                    <div className="animate-shimmer h-8 w-16 rounded mt-1" />
                                ) : (
                                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                )}
                            </div>
                            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Leads Over Time */}
                <Card>
                    <h2 className="text-lg font-semibold mb-4">Leads Over Time</h2>
                    {!data?.leadsOverTime?.length ? (
                        <div className="flex items-center justify-center h-64 rounded-lg bg-bg-tertiary">
                            <div className="text-center">
                                <BarChart3 className="w-10 h-10 text-text-tertiary mx-auto mb-2" />
                                <p className="text-sm text-text-tertiary">Charts will appear once you have data</p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.leadsOverTime}>
                                    <defs>
                                        <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6c5ce7" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6c5ce7" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                        stroke="#6b7280"
                                        fontSize={12}
                                    />
                                    <YAxis stroke="#6b7280" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1a1a2e",
                                            border: "1px solid #2a2a3e",
                                            borderRadius: "8px",
                                            color: "#eaeaf0",
                                        }}
                                        labelFormatter={(v) => new Date(v).toLocaleDateString()}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#6c5ce7"
                                        strokeWidth={2}
                                        fill="url(#leadGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </Card>

                {/* Conversion Funnel */}
                <Card>
                    <h2 className="text-lg font-semibold mb-4">Conversion Funnel</h2>
                    <div className="space-y-3">
                        {sortedFunnel.map((stage) => (
                            <div key={stage.label} className="flex items-center gap-3">
                                <div
                                    className="h-8 rounded bg-accent/20 transition-all"
                                    style={{ width: `${Math.max((stage.count / maxFunnelCount) * 100, 5)}%` }}
                                />
                                <span className="text-sm text-text-secondary whitespace-nowrap">
                                    {stage.label}: {stage.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Subreddit breakdown */}
            <Card>
                <h2 className="text-lg font-semibold mb-4">Top Subreddits by Leads</h2>
                {!data?.subredditBreakdown?.length ? (
                    <div className="flex items-center justify-center py-12">
                        <p className="text-sm text-text-tertiary">No subreddit data yet.</p>
                    </div>
                ) : (
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.subredditBreakdown} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                                <YAxis
                                    type="category"
                                    dataKey="subreddit"
                                    stroke="#6b7280"
                                    fontSize={12}
                                    tickFormatter={(v) => `r/${v}`}
                                    width={120}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1a1a2e",
                                        border: "1px solid #2a2a3e",
                                        borderRadius: "8px",
                                        color: "#eaeaf0",
                                    }}
                                />
                                <Bar dataKey="count" fill="#6c5ce7" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </Card>
        </div>
    )
}
