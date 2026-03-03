"use client"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"
import {
    ArrowLeft,
    Target,
    Plus,
    Trash2,
    Edit3,
    Save,
    X,
    Sparkles,
    Globe,
} from "lucide-react"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

interface Subreddit {
    id: string
    subreddit: { id: string; name: string; displayName: string; subscriberCount: number }
    source: string
    isActive: boolean
}

interface Product {
    id: string
    name: string
    url?: string
    description: string
    aiDescription?: string
    targetAudience?: string
    keywords: string[]
    subreddits: Subreddit[]
    _count: { leads: number }
    createdAt: string
}

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const queryClient = useQueryClient()
    const productId = params.id as string

    const [editing, setEditing] = useState(false)
    const [addingSub, setAddingSub] = useState(false)
    const [newSubreddit, setNewSubreddit] = useState("")
    const [editForm, setEditForm] = useState({
        name: "",
        url: "",
        description: "",
        targetAudience: "",
        keywords: "",
    })

    const { data: product, isLoading } = useQuery({
        queryKey: ["product", productId],
        queryFn: async () => {
            const res = await fetch(`/api/products/${productId}`)
            if (!res.ok) throw new Error("Product not found")
            const json = await res.json()
            return json.data as Product
        },
    })

    const updateProduct = useMutation({
        mutationFn: async (data: Record<string, unknown>) => {
            const res = await fetch(`/api/products/${productId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (!res.ok) throw new Error("Failed to update")
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product", productId] })
            setEditing(false)
        },
    })

    const deleteProduct = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/products/${productId}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to delete")
        },
        onSuccess: () => {
            router.push("/products")
        },
    })

    const addSubreddit = useMutation({
        mutationFn: async (name: string) => {
            const res = await fetch(`/api/products/${productId}/subreddits`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, source: "USER_ADDED" }),
            })
            if (!res.ok) throw new Error("Failed to add subreddit")
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product", productId] })
            setNewSubreddit("")
            setAddingSub(false)
        },
    })

    const removeSubreddit = useMutation({
        mutationFn: async (linkId: string) => {
            const res = await fetch(`/api/products/${productId}/subreddits/${linkId}`, {
                method: "DELETE",
            })
            if (!res.ok) throw new Error("Failed to remove")
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product", productId] })
        },
    })

    function startEditing() {
        if (!product) return
        setEditForm({
            name: product.name,
            url: product.url || "",
            description: product.description,
            targetAudience: product.targetAudience || "",
            keywords: product.keywords.join(", "),
        })
        setEditing(true)
    }

    function handleSave() {
        updateProduct.mutate({
            name: editForm.name,
            url: editForm.url || undefined,
            description: editForm.description,
            targetAudience: editForm.targetAudience || undefined,
            keywords: editForm.keywords.split(",").map((k) => k.trim()).filter(Boolean),
        })
    }

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <Card><div className="animate-shimmer h-48 rounded-lg" /></Card>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="max-w-4xl mx-auto">
                <Card>
                    <div className="text-center py-12">
                        <p className="text-text-secondary">Product not found</p>
                        <Link href="/products" className="mt-4 inline-block">
                            <Button variant="primary" size="sm">Back to Products</Button>
                        </Link>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/products">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{product.name}</h1>
                        {product.url && (
                            <a
                                href={product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-accent hover:underline flex items-center gap-1 mt-0.5"
                            >
                                <Globe className="w-3 h-3" /> {product.url}
                            </a>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!editing ? (
                        <>
                            <Button variant="secondary" size="sm" onClick={startEditing}>
                                <Edit3 className="w-3.5 h-3.5" /> Edit
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    if (confirm("Delete this product? This also removes all leads.")) {
                                        deleteProduct.mutate()
                                    }
                                }}
                            >
                                <Trash2 className="w-3.5 h-3.5 text-error" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="primary" size="sm" onClick={handleSave} disabled={updateProduct.isPending}>
                                <Save className="w-3.5 h-3.5" /> Save
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                                <X className="w-3.5 h-3.5" /> Cancel
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Product details */}
            <Card>
                {editing ? (
                    <div className="space-y-4">
                        <Input
                            label="Product Name"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                        <Input
                            label="URL"
                            value={editForm.url}
                            onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                        />
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-text-secondary">Description</label>
                            <textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                rows={3}
                                className="px-3 py-2.5 rounded-lg bg-bg-tertiary border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                            />
                        </div>
                        <Input
                            label="Keywords (comma-separated)"
                            value={editForm.keywords}
                            onChange={(e) => setEditForm({ ...editForm, keywords: e.target.value })}
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-text-secondary mb-1">Description</p>
                            <p className="text-text-primary">{product.description}</p>
                        </div>
                        {product.targetAudience && (
                            <div>
                                <p className="text-sm text-text-secondary mb-1">Target Audience</p>
                                <p className="text-text-primary">{product.targetAudience}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-text-secondary mb-1">Keywords</p>
                            <div className="flex flex-wrap gap-1.5">
                                {product.keywords.map((kw) => (
                                    <Badge key={kw} variant="default">{kw}</Badge>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 pt-2 border-t border-border text-sm text-text-secondary">
                            <span className="flex items-center gap-1.5">
                                <Target className="w-4 h-4" /> {product._count.leads} leads
                            </span>
                            <span>{product.subreddits.length} subreddits</span>
                        </div>
                    </div>
                )}
            </Card>

            {/* Subreddits */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold">Targeted Subreddits</h2>
                        <p className="text-sm text-text-secondary">
                            RedPulse monitors these subreddits for leads matching your product.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={() => setAddingSub(true)}>
                            <Plus className="w-3.5 h-3.5" /> Add
                        </Button>
                    </div>
                </div>

                {addingSub && (
                    <div className="flex gap-2 mb-4">
                        <Input
                            placeholder="subreddit name (without r/)"
                            value={newSubreddit}
                            onChange={(e) => setNewSubreddit(e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => newSubreddit && addSubreddit.mutate(newSubreddit)}
                            disabled={addSubreddit.isPending}
                        >
                            Add
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setAddingSub(false)}>
                            <X className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                )}

                {product.subreddits.length === 0 ? (
                    <div className="text-center py-8">
                        <Sparkles className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
                        <p className="text-text-secondary text-sm">No subreddits added yet.</p>
                        <p className="text-text-tertiary text-xs mt-1">
                            Add subreddits to start finding leads for this product.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {product.subreddits.map((link) => (
                            <div
                                key={link.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-sm">
                                        r/{link.subreddit.name}
                                    </span>
                                    <Badge variant={link.source === "AI_RECOMMENDED" ? "accent" : "default"}>
                                        {link.source === "AI_RECOMMENDED" ? "AI Recommended" : "Manual"}
                                    </Badge>
                                    {link.subreddit.subscriberCount > 0 && (
                                        <span className="text-xs text-text-tertiary">
                                            {(link.subreddit.subscriberCount / 1000).toFixed(0)}k members
                                        </span>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSubreddit.mutate(link.id)}
                                >
                                    <Trash2 className="w-3.5 h-3.5 text-text-tertiary hover:text-error" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}
