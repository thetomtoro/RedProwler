"use client"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"
import { Eye, Plus, Lock, Trash2, X } from "lucide-react"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { formatRelativeTime } from "@/lib/utils"

interface Competitor {
    id: string
    name: string
    keywords: string[]
    product: { name: string }
    _count: { redditMentions: number }
    createdAt: string
}

export default function CompetitorsPage() {
    const queryClient = useQueryClient()
    const [adding, setAdding] = useState(false)
    const [name, setName] = useState("")
    const [keywords, setKeywords] = useState("")

    const { data: competitors, isLoading, error } = useQuery({
        queryKey: ["competitors"],
        queryFn: async () => {
            const res = await fetch("/api/competitors")
            if (res.status === 403) return null // Free plan
            if (!res.ok) throw new Error("Failed to load")
            const json = await res.json()
            return json.data as Competitor[]
        },
    })

    const addCompetitor = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/competitors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
                }),
            })
            if (!res.ok) throw new Error("Failed to add")
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["competitors"] })
            setAdding(false)
            setName("")
            setKeywords("")
        },
    })

    const deleteCompetitor = useMutation({
        mutationFn: async (id: string) => {
            await fetch(`/api/competitors/${id}`, { method: "DELETE" })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["competitors"] })
        },
    })

    // Free plan gate
    if (competitors === null) {
        return (
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Competitor Monitoring</h1>
                        <p className="text-text-secondary mt-1">
                            Track when competitors are mentioned on Reddit and find opportunities.
                        </p>
                    </div>
                </div>

                <Card>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-14 h-14 rounded-xl bg-accent-muted flex items-center justify-center mb-4">
                            <Lock className="w-7 h-7 text-accent" />
                        </div>
                        <p className="text-text-secondary font-medium text-lg">Pro Feature</p>
                        <p className="text-text-tertiary text-sm mt-1 max-w-md">
                            Competitor monitoring is available on the Pro plan and above.
                            Track competitor mentions, sentiment, and find opportunities to position your product.
                        </p>
                        <Link href="/settings" className="mt-4">
                            <Button variant="primary" size="sm">
                                <Eye className="w-4 h-4" /> Upgrade to Pro
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Competitor Monitoring</h1>
                    <p className="text-text-secondary mt-1">
                        Track when competitors are mentioned on Reddit and find opportunities.
                    </p>
                </div>
                <Button variant="primary" size="sm" onClick={() => setAdding(true)}>
                    <Plus className="w-4 h-4" /> Add Competitor
                </Button>
            </div>

            {adding && (
                <Card>
                    <div className="space-y-4">
                        <h3 className="font-semibold">Add Competitor</h3>
                        <Input
                            label="Competitor Name"
                            placeholder="e.g., Acme Corp"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            label="Keywords (comma-separated)"
                            placeholder="e.g., acme, acmecorp, acme.com"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>
                                <X className="w-3.5 h-3.5" /> Cancel
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => addCompetitor.mutate()}
                                disabled={!name || !keywords || addCompetitor.isPending}
                            >
                                Add Competitor
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {isLoading && (
                <div className="space-y-3">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <Card key={i}><div className="animate-shimmer h-20 rounded-lg" /></Card>
                    ))}
                </div>
            )}

            {competitors && competitors.length === 0 && !adding && (
                <Card>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Eye className="w-10 h-10 text-text-tertiary mb-3" />
                        <p className="text-text-secondary font-medium">No competitors tracked yet</p>
                        <p className="text-text-tertiary text-sm mt-1">
                            Add competitors to monitor their Reddit mentions and find positioning opportunities.
                        </p>
                    </div>
                </Card>
            )}

            {competitors && competitors.length > 0 && (
                <div className="space-y-3">
                    {competitors.map((comp) => (
                        <Card key={comp.id} hover>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold">{comp.name}</h3>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex gap-1.5">
                                            {comp.keywords.slice(0, 3).map((kw) => (
                                                <Badge key={kw} variant="default">{kw}</Badge>
                                            ))}
                                        </div>
                                        <span className="text-xs text-text-tertiary">
                                            {comp._count.redditMentions} mentions
                                        </span>
                                        <span className="text-xs text-text-tertiary">
                                            Product: {comp.product.name}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteCompetitor.mutate(comp.id)}
                                >
                                    <Trash2 className="w-3.5 h-3.5 text-text-tertiary hover:text-error" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
