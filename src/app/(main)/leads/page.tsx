"use client"

import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Target, ExternalLink, Bookmark, MessageSquareText } from "lucide-react"
import { formatRelativeTime, truncate } from "@/lib/utils"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"

interface Lead {
    id: string
    title?: string
    body: string
    author: string
    permalink: string
    redditScore: number
    commentCount: number
    relevanceScore: number
    relevanceReason?: string
    intentSignals: string[]
    sentiment: string
    status: string
    isBookmarked: boolean
    createdAt: string
    subreddit: { name: string; displayName: string }
    product: { name: string }
    _count: { engagements: number }
}

function ScoreBadge({ score }: { score: number }) {
    if (score >= 0.7) return <Badge variant="success">{Math.round(score * 100)}% match</Badge>
    if (score >= 0.4) return <Badge variant="warning">{Math.round(score * 100)}% match</Badge>
    return <Badge variant="default">{Math.round(score * 100)}% match</Badge>
}

function StatusBadge({ status }: { status: string }) {
    const variants: Record<string, "default" | "accent" | "success" | "warning"> = {
        NEW: "accent",
        VIEWED: "default",
        ENGAGED: "warning",
        CONVERTED: "success",
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
}

export default function LeadsPage() {
    const { data, isLoading } = useQuery({
        queryKey: ["leads"],
        queryFn: async () => {
            const res = await fetch("/api/leads?limit=20")
            const json = await res.json()
            return json.data as Lead[]
        },
    })

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Leads</h1>
                    <p className="text-text-secondary mt-1">
                        Discovered leads from your targeted subreddits.
                    </p>
                </div>
            </div>

            {isLoading && (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                            <div className="animate-shimmer h-24 rounded-lg" />
                        </Card>
                    ))}
                </div>
            )}

            {!isLoading && (!data || data.length === 0) && (
                <Card>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-14 h-14 rounded-xl bg-bg-tertiary flex items-center justify-center mb-4">
                            <Target className="w-7 h-7 text-text-tertiary" />
                        </div>
                        <p className="text-text-secondary font-medium text-lg">No leads yet</p>
                        <p className="text-text-tertiary text-sm mt-1 max-w-md">
                            Add a product and target subreddits. RedProwler will start finding relevant leads automatically.
                        </p>
                        <Link href="/products/new" className="mt-4">
                            <Button variant="primary" size="sm">Add Product</Button>
                        </Link>
                    </div>
                </Card>
            )}

            {data && data.length > 0 && (
                <div className="space-y-3">
                    {data.map((lead) => (
                        <Card key={lead.id} hover>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs text-text-tertiary">r/{lead.subreddit.name}</span>
                                        <ScoreBadge score={lead.relevanceScore} />
                                        <StatusBadge status={lead.status} />
                                    </div>
                                    <Link href={`/leads/${lead.id}`}>
                                        <h3 className="font-semibold text-text-primary hover:text-accent transition-colors">
                                            {lead.title || truncate(lead.body, 80)}
                                        </h3>
                                    </Link>
                                    <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                                        {truncate(lead.body, 200)}
                                    </p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-text-tertiary">
                                        <span>u/{lead.author}</span>
                                        <span>{lead.redditScore} points</span>
                                        <span>{lead.commentCount} comments</span>
                                        <span>{formatRelativeTime(new Date(lead.createdAt))}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    <a
                                        href={`https://reddit.com${lead.permalink}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button variant="ghost" size="sm">
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </Button>
                                    </a>
                                    <Button variant="ghost" size="sm">
                                        <Bookmark className="w-3.5 h-3.5" />
                                    </Button>
                                    <Link href={`/leads/${lead.id}`}>
                                        <Button variant="primary" size="sm">
                                            <MessageSquareText className="w-3.5 h-3.5" /> Engage
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
