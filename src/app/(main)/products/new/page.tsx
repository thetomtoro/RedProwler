"use client"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        name: "",
        url: "",
        description: "",
        targetAudience: "",
        keywords: "",
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
                }),
            })

            if (res.ok) {
                const { data } = await res.json()
                router.push(`/products/${data.id}`)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/products">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Add Product</h1>
                    <p className="text-text-secondary mt-1">
                        Describe your product so we can find the right leads.
                    </p>
                </div>
            </div>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Product Name"
                        placeholder="e.g., My SaaS Tool"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />

                    <Input
                        label="Product URL (optional)"
                        placeholder="https://yourproduct.com"
                        value={form.url}
                        onChange={(e) => setForm({ ...form, url: e.target.value })}
                    />

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-text-secondary">
                            Product Description
                        </label>
                        <textarea
                            placeholder="Describe what your product does, who it's for, and what problems it solves..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={4}
                            required
                            className="px-3 py-2.5 rounded-lg bg-bg-tertiary border border-border text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-150 resize-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-text-secondary">
                            Target Audience (optional)
                        </label>
                        <textarea
                            placeholder="Who is your ideal customer? (e.g., SaaS founders, indie hackers, marketers)"
                            value={form.targetAudience}
                            onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                            rows={2}
                            className="px-3 py-2.5 rounded-lg bg-bg-tertiary border border-border text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-150 resize-none"
                        />
                    </div>

                    <Input
                        label="Keywords (comma-separated)"
                        placeholder="e.g., analytics, dashboard, SaaS, marketing"
                        value={form.keywords}
                        onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <Link href="/products">
                            <Button variant="secondary" type="button">Cancel</Button>
                        </Link>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Product"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
