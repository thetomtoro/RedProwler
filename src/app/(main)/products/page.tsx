"use client"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Package, Plus, Target } from "lucide-react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"

interface Product {
    id: string
    name: string
    url?: string
    description: string
    keywords: string[]
    subreddits: Array<{
        subreddit: { name: string; displayName: string }
    }>
    _count: { leads: number }
    createdAt: string
}

export default function ProductsPage() {
    const { data: products, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await fetch("/api/products")
            const json = await res.json()
            return json.data as Product[]
        },
    })

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Products</h1>
                    <p className="text-text-secondary mt-1">
                        Manage your products and their targeted subreddits.
                    </p>
                </div>
                <Link href="/products/new">
                    <Button variant="primary" size="sm">
                        <Plus className="w-4 h-4" /> Add Product
                    </Button>
                </Link>
            </div>

            {isLoading && (
                <div className="grid gap-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <Card key={i}>
                            <div className="animate-shimmer h-32 rounded-lg" />
                        </Card>
                    ))}
                </div>
            )}

            {!isLoading && (!products || products.length === 0) && (
                <Card>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-14 h-14 rounded-xl bg-bg-tertiary flex items-center justify-center mb-4">
                            <Package className="w-7 h-7 text-text-tertiary" />
                        </div>
                        <p className="text-text-secondary font-medium text-lg">No products yet</p>
                        <p className="text-text-tertiary text-sm mt-1 max-w-md">
                            Add your first product to start discovering leads on Reddit.
                        </p>
                        <Link href="/products/new" className="mt-4">
                            <Button variant="primary" size="sm">
                                <Plus className="w-4 h-4" /> Add Product
                            </Button>
                        </Link>
                    </div>
                </Card>
            )}

            {products && products.length > 0 && (
                <div className="grid gap-4">
                    {products.map((product) => (
                        <Link key={product.id} href={`/products/${product.id}`}>
                            <Card hover>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold">{product.name}</h3>
                                        <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center gap-3 mt-3">
                                            {product.subreddits.slice(0, 3).map((s) => (
                                                <Badge key={s.subreddit.name} variant="default">
                                                    r/{s.subreddit.name}
                                                </Badge>
                                            ))}
                                            {product.subreddits.length > 3 && (
                                                <span className="text-xs text-text-tertiary">
                                                    +{product.subreddits.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                                        <Target className="w-4 h-4" />
                                        <span>{product._count.leads} leads</span>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
