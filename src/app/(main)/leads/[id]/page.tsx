"use client"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import {
    ArrowLeft,
    ExternalLink,
    Bookmark,
    BookmarkCheck,
    MessageSquareText,
    Sparkles,
    Copy,
    Check,
    ThumbsUp,
    MessageCircle,
    Clock,
    Loader2,
} from "lucide-react"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useState, useRef, useCallback } from "react"
import { formatRelativeTime } from "@/lib/utils"

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
    redditType: string
    redditCreatedAt: string
    createdAt: string
    subreddit: { name: string; displayName: string }
    product: { name: string }
    engagements: Array<{
        id: string
        type: string
        generatedContent: string
        editedContent?: string
        wasPosted: boolean
        createdAt: string
    }>
}

const ENGAGEMENT_TYPES = [
    { value: "reply", label: "Reply", icon: MessageSquareText },
    { value: "conversation_starter", label: "Conversation Starter", icon: MessageCircle },
    { value: "dm_template", label: "DM Template", icon: MessageSquareText },
]

export default function LeadDetailPage() {
    const params = useParams()
    const queryClient = useQueryClient()
    const leadId = params.id as string

    const [selectedType, setSelectedType] = useState("reply")
    const [tone, setTone] = useState("helpful")
    const [generatedText, setGeneratedText] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [copied, setCopied] = useState(false)
    const abortRef = useRef<AbortController | null>(null)

    const { data: lead, isLoading } = useQuery({
        queryKey: ["lead", leadId],
        queryFn: async () => {
            const res = await fetch(`/api/leads/${leadId}`)
            if (!res.ok) throw new Error("Lead not found")
            const json = await res.json()
            return json.data as Lead
        },
    })

    const toggleBookmark = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/leads/${leadId}/bookmark`, { method: "POST" })
            if (!res.ok) throw new Error("Failed to bookmark")
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lead", leadId] })
        },
    })

    const handleGenerate = useCallback(async () => {
        setIsGenerating(true)
        setGeneratedText("")

        abortRef.current = new AbortController()

        try {
            const res = await fetch(`/api/leads/${leadId}/engage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: selectedType, tone }),
                signal: abortRef.current.signal,
            })

            if (!res.ok) throw new Error("Generation failed")

            const reader = res.body?.getReader()
            if (!reader) throw new Error("No stream")

            const decoder = new TextDecoder()
            let text = ""

            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                text += decoder.decode(value, { stream: true })
                setGeneratedText(text)
            }

            queryClient.invalidateQueries({ queryKey: ["lead", leadId] })
        } catch (err) {
            if ((err as Error).name !== "AbortError") {
                console.error("Generation error:", err)
            }
        } finally {
            setIsGenerating(false)
        }
    }, [leadId, selectedType, tone, queryClient])

    function handleCopy() {
        navigator.clipboard.writeText(generatedText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    function scoreBadge(score: number) {
        if (score >= 0.7) return <Badge variant="success">{Math.round(score * 100)}% match</Badge>
        if (score >= 0.4) return <Badge variant="warning">{Math.round(score * 100)}% match</Badge>
        return <Badge variant="default">{Math.round(score * 100)}% match</Badge>
    }

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <Card><div className="animate-shimmer h-64 rounded-lg" /></Card>
            </div>
        )
    }

    if (!lead) {
        return (
            <div className="max-w-4xl mx-auto">
                <Card>
                    <div className="text-center py-12">
                        <p className="text-text-secondary">Lead not found</p>
                        <Link href="/leads" className="mt-4 inline-block">
                            <Button variant="primary" size="sm">Back to Leads</Button>
                        </Link>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/leads">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-text-tertiary">r/{lead.subreddit.name}</span>
                        {scoreBadge(lead.relevanceScore)}
                        <Badge variant="default">{lead.status}</Badge>
                    </div>
                    <h1 className="text-xl font-bold">
                        {lead.title || lead.body.slice(0, 80)}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark.mutate()}
                    >
                        {lead.isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-accent" />
                        ) : (
                            <Bookmark className="w-4 h-4" />
                        )}
                    </Button>
                    <a
                        href={`https://reddit.com${lead.permalink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button variant="secondary" size="sm">
                            <ExternalLink className="w-3.5 h-3.5" /> View on Reddit
                        </Button>
                    </a>
                </div>
            </div>

            {/* Original content */}
            <Card>
                <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-text-tertiary">
                        <span>u/{lead.author}</span>
                        <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3.5 h-3.5" /> {lead.redditScore}
                        </span>
                        <span className="flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5" /> {lead.commentCount}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {formatRelativeTime(new Date(lead.redditCreatedAt))}
                        </span>
                    </div>
                    <div className="text-text-primary whitespace-pre-wrap leading-relaxed">
                        {lead.body}
                    </div>
                    {lead.relevanceReason && (
                        <div className="pt-3 border-t border-border">
                            <p className="text-xs text-text-secondary">
                                <Sparkles className="w-3 h-3 inline mr-1" />
                                <strong>AI Analysis:</strong> {lead.relevanceReason}
                            </p>
                        </div>
                    )}
                    {lead.intentSignals.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {lead.intentSignals.map((signal) => (
                                <Badge key={signal} variant="accent">{signal}</Badge>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            {/* AI Engagement Generator */}
            <Card>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" /> AI Reply Generator
                </h2>

                <div className="space-y-4">
                    {/* Type selection */}
                    <div className="flex gap-2">
                        {ENGAGEMENT_TYPES.map((t) => (
                            <button
                                key={t.value}
                                onClick={() => setSelectedType(t.value)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                    selectedType === t.value
                                        ? "bg-accent-muted text-accent"
                                        : "bg-bg-tertiary text-text-secondary hover:text-text-primary"
                                }`}
                            >
                                <t.icon className="w-4 h-4" /> {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Tone selection */}
                    <div>
                        <label className="text-sm text-text-secondary mb-1.5 block">Tone</label>
                        <div className="flex gap-2">
                            {["helpful", "casual", "professional", "witty", "empathetic"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTone(t)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize cursor-pointer ${
                                        tone === t
                                            ? "bg-accent-muted text-accent"
                                            : "bg-bg-tertiary text-text-secondary hover:text-text-primary"
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate button */}
                    <Button
                        variant="primary"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                        ) : (
                            <><Sparkles className="w-4 h-4" /> Generate {selectedType === "reply" ? "Reply" : selectedType === "conversation_starter" ? "Starter" : "DM"}</>
                        )}
                    </Button>

                    {/* Generated content */}
                    {generatedText && (
                        <div className="relative">
                            <div className="rounded-lg bg-bg-tertiary border border-border p-4 text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
                                {generatedText}
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={handleCopy}
                            >
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copied ? "Copied!" : "Copy"}
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            {/* Previous engagements */}
            {lead.engagements.length > 0 && (
                <Card>
                    <h2 className="text-lg font-semibold mb-4">Previous Engagements</h2>
                    <div className="space-y-3">
                        {lead.engagements.map((eng) => (
                            <div key={eng.id} className="rounded-lg bg-bg-tertiary p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="default">{eng.type}</Badge>
                                    <span className="text-xs text-text-tertiary">
                                        {formatRelativeTime(new Date(eng.createdAt))}
                                    </span>
                                    {eng.wasPosted && <Badge variant="success">Posted</Badge>}
                                </div>
                                <p className="text-sm text-text-secondary line-clamp-3">
                                    {eng.editedContent || eng.generatedContent}
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    )
}
