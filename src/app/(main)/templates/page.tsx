"use client"

import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Heart, Copy, Search, Check, FileText } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const CATEGORIES = [
    "All",
    "Question",
    "Story",
    "Opinion",
    "Recommendation",
    "Problem & Solution",
    "Comparison",
    "Case Study",
    "AMA",
    "Discussion",
    "Tutorial",
]

const CATEGORY_MAP: Record<string, string> = {
    "All": "ALL",
    "Question": "QUESTION",
    "Story": "STORY",
    "Opinion": "OPINION",
    "Recommendation": "RECOMMENDATION",
    "Problem & Solution": "PROBLEM_SOLUTION",
    "Comparison": "COMPARISON",
    "Case Study": "CASE_STUDY",
    "AMA": "AMA",
    "Discussion": "DISCUSSION",
    "Tutorial": "TUTORIAL",
}

interface Template {
    id: string
    title: string
    body: string
    category: string
    tags: string[]
    useCase?: string
    usageCount: number
    avgEngagement?: number
    isFavorited: boolean
}

export default function TemplatesPage() {
    const queryClient = useQueryClient()
    const [activeCategory, setActiveCategory] = useState("All")
    const [search, setSearch] = useState("")
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const { data: templates, isLoading } = useQuery({
        queryKey: ["templates", activeCategory, search],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (activeCategory !== "All") params.set("category", CATEGORY_MAP[activeCategory])
            if (search) params.set("search", search)
            const res = await fetch(`/api/templates?${params}`)
            const json = await res.json()
            return json.data as Template[]
        },
    })

    const toggleFavorite = useMutation({
        mutationFn: async (templateId: string) => {
            await fetch(`/api/templates/${templateId}/favorite`, { method: "POST" })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["templates"] })
        },
    })

    function handleCopy(template: Template) {
        navigator.clipboard.writeText(template.body)
        setCopiedId(template.id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Viral Templates</h1>
                <p className="text-text-secondary mt-1">
                    50+ battle-tested post templates optimized for engagement and karma growth.
                </p>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input
                        placeholder="Search templates..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-10 pl-9 pr-3 rounded-lg bg-bg-tertiary border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                </div>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer",
                            activeCategory === cat
                                ? "bg-accent-muted text-accent"
                                : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i}>
                            <div className="animate-shimmer h-48 rounded-lg" />
                        </Card>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!isLoading && (!templates || templates.length === 0) && (
                <Card>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <FileText className="w-10 h-10 text-text-tertiary mb-3" />
                        <p className="text-text-secondary font-medium">No templates found</p>
                        <p className="text-text-tertiary text-sm mt-1">
                            Try adjusting your search or category filter.
                        </p>
                    </div>
                </Card>
            )}

            {/* Template grid */}
            {templates && templates.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map((template) => (
                        <Card key={template.id} hover>
                            <div className="flex flex-col h-full">
                                <div className="flex items-start justify-between mb-3">
                                    <Badge variant="accent">
                                        {template.category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </Badge>
                                    <button
                                        onClick={() => toggleFavorite.mutate(template.id)}
                                        className={cn(
                                            "transition-colors cursor-pointer",
                                            template.isFavorited
                                                ? "text-accent-secondary"
                                                : "text-text-tertiary hover:text-accent-secondary"
                                        )}
                                    >
                                        <Heart className={cn("w-4 h-4", template.isFavorited && "fill-current")} />
                                    </button>
                                </div>

                                <h3 className="font-semibold mb-2">{template.title}</h3>

                                <p className="text-sm text-text-secondary leading-relaxed flex-1 line-clamp-4 mb-4">
                                    {template.body}
                                </p>

                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                    <div className="flex gap-1.5">
                                        {template.tags.slice(0, 2).map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[10px] text-text-tertiary bg-bg-tertiary px-2 py-0.5 rounded"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-text-tertiary">{template.usageCount} uses</span>
                                        <Button variant="ghost" size="sm" onClick={() => handleCopy(template)}>
                                            {copiedId === template.id ? (
                                                <Check className="w-3.5 h-3.5 text-success" />
                                            ) : (
                                                <Copy className="w-3.5 h-3.5" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
