"use client"

import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import {
    ArrowRight,
    ArrowLeft,
    Package,
    Target,
    Rocket,
    Check,
    Sparkles,
    Plus,
    X,
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

const STEPS = [
    { icon: Package, label: "Describe Your Product" },
    { icon: Target, label: "Select Subreddits" },
    { icon: Rocket, label: "Launch" },
]

const SUGGESTED_SUBREDDITS = [
    { name: "SaaS", label: "r/SaaS" },
    { name: "startups", label: "r/startups" },
    { name: "Entrepreneur", label: "r/Entrepreneur" },
    { name: "smallbusiness", label: "r/smallbusiness" },
    { name: "indiehackers", label: "r/indiehackers" },
    { name: "marketing", label: "r/marketing" },
    { name: "SEO", label: "r/SEO" },
    { name: "webdev", label: "r/webdev" },
    { name: "sideproject", label: "r/sideproject" },
    { name: "growmybusiness", label: "r/growmybusiness" },
    { name: "digitalnomad", label: "r/digitalnomad" },
    { name: "freelance", label: "r/freelance" },
]

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [loading, setLoading] = useState(false)

    const [productForm, setProductForm] = useState({
        name: "",
        url: "",
        description: "",
        targetAudience: "",
        keywords: "",
    })

    const [selectedSubreddits, setSelectedSubreddits] = useState<string[]>([])
    const [customSubreddit, setCustomSubreddit] = useState("")

    function toggleSubreddit(name: string) {
        setSelectedSubreddits((prev) =>
            prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
        )
    }

    function addCustomSubreddit() {
        if (customSubreddit && !selectedSubreddits.includes(customSubreddit)) {
            setSelectedSubreddits([...selectedSubreddits, customSubreddit])
            setCustomSubreddit("")
        }
    }

    async function handleFinish() {
        setLoading(true)
        try {
            // Create product
            const productRes = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...productForm,
                    keywords: productForm.keywords.split(",").map((k) => k.trim()).filter(Boolean),
                }),
            })

            if (!productRes.ok) throw new Error("Failed to create product")
            const { data: product } = await productRes.json()

            // Add subreddits
            for (const name of selectedSubreddits) {
                await fetch(`/api/products/${product.id}/subreddits`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, source: "USER_ADDED" }),
                })
            }

            // Mark onboarded
            await fetch("/api/webhooks/onboard", { method: "POST" })

            router.push("/dashboard")
        } catch (err) {
            console.error("Onboarding error:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
            <div className="w-full max-w-2xl space-y-8">
                {/* Logo */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold gradient-text">RedProwler</h1>
                    <p className="text-text-secondary mt-1">Let&apos;s get you set up in 2 minutes</p>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-center gap-3">
                    {STEPS.map((s, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                    i === step
                                        ? "bg-accent-muted text-accent"
                                        : i < step
                                        ? "bg-success/10 text-success"
                                        : "bg-bg-tertiary text-text-tertiary"
                                }`}
                            >
                                {i < step ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                                <span className="hidden sm:inline">{s.label}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`w-8 h-0.5 rounded-full ${i < step ? "bg-success" : "bg-border"}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 1: Product Info */}
                {step === 0 && (
                    <Card>
                        <div className="space-y-5">
                            <div>
                                <h2 className="text-xl font-semibold">Tell us about your product</h2>
                                <p className="text-text-secondary text-sm mt-1">
                                    This helps our AI find the most relevant leads for you.
                                </p>
                            </div>

                            <Input
                                label="Product Name"
                                placeholder="e.g., My SaaS Tool"
                                value={productForm.name}
                                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                required
                            />

                            <Input
                                label="Product URL (optional)"
                                placeholder="https://yourproduct.com"
                                value={productForm.url}
                                onChange={(e) => setProductForm({ ...productForm, url: e.target.value })}
                            />

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-secondary">
                                    What does your product do?
                                </label>
                                <textarea
                                    placeholder="Describe your product, who it's for, and what problems it solves..."
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                    rows={3}
                                    required
                                    className="px-3 py-2.5 rounded-lg bg-bg-tertiary border border-border text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-secondary">
                                    Target Audience (optional)
                                </label>
                                <textarea
                                    placeholder="Who is your ideal customer?"
                                    value={productForm.targetAudience}
                                    onChange={(e) => setProductForm({ ...productForm, targetAudience: e.target.value })}
                                    rows={2}
                                    className="px-3 py-2.5 rounded-lg bg-bg-tertiary border border-border text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                                />
                            </div>

                            <Input
                                label="Keywords (comma-separated)"
                                placeholder="e.g., analytics, dashboard, SaaS"
                                value={productForm.keywords}
                                onChange={(e) => setProductForm({ ...productForm, keywords: e.target.value })}
                            />

                            <div className="flex justify-end">
                                <Button
                                    variant="primary"
                                    onClick={() => setStep(1)}
                                    disabled={!productForm.name || !productForm.description}
                                >
                                    Next <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Step 2: Subreddits */}
                {step === 1 && (
                    <Card>
                        <div className="space-y-5">
                            <div>
                                <h2 className="text-xl font-semibold">Choose subreddits to monitor</h2>
                                <p className="text-text-secondary text-sm mt-1">
                                    Select subreddits where your ideal customers hang out.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {SUGGESTED_SUBREDDITS.map((sub) => (
                                    <button
                                        key={sub.name}
                                        onClick={() => toggleSubreddit(sub.name)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                            selectedSubreddits.includes(sub.name)
                                                ? "bg-accent-muted text-accent border border-accent/30"
                                                : "bg-bg-tertiary text-text-secondary hover:text-text-primary border border-transparent"
                                        }`}
                                    >
                                        {selectedSubreddits.includes(sub.name) && (
                                            <Check className="w-3 h-3 inline mr-1" />
                                        )}
                                        {sub.label}
                                    </button>
                                ))}
                            </div>

                            {/* Custom subreddit */}
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add custom subreddit..."
                                    value={customSubreddit}
                                    onChange={(e) => setCustomSubreddit(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && addCustomSubreddit()}
                                    className="flex-1"
                                />
                                <Button variant="secondary" size="sm" onClick={addCustomSubreddit}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Selected */}
                            {selectedSubreddits.length > 0 && (
                                <div>
                                    <p className="text-sm text-text-secondary mb-2">
                                        Selected ({selectedSubreddits.length}):
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedSubreddits.map((name) => (
                                            <Badge key={name} variant="accent">
                                                r/{name}
                                                <button onClick={() => toggleSubreddit(name)} className="ml-1 cursor-pointer">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <Button variant="secondary" onClick={() => setStep(0)}>
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => setStep(2)}
                                    disabled={selectedSubreddits.length === 0}
                                >
                                    Next <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Step 3: Launch */}
                {step === 2 && (
                    <Card>
                        <div className="space-y-6 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-accent-muted flex items-center justify-center mx-auto">
                                <Sparkles className="w-8 h-8 text-accent" />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold">You&apos;re all set!</h2>
                                <p className="text-text-secondary text-sm mt-1">
                                    Here&apos;s a summary of your setup:
                                </p>
                            </div>

                            <div className="text-left space-y-3 max-w-md mx-auto">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary">
                                    <span className="text-sm text-text-secondary">Product</span>
                                    <span className="text-sm font-medium">{productForm.name}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary">
                                    <span className="text-sm text-text-secondary">Subreddits</span>
                                    <span className="text-sm font-medium">{selectedSubreddits.length} selected</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary">
                                    <span className="text-sm text-text-secondary">Plan</span>
                                    <Badge variant="accent">Starter (Free)</Badge>
                                </div>
                            </div>

                            <p className="text-text-tertiary text-sm">
                                RedProwler will start monitoring these subreddits immediately and notify you when leads appear.
                            </p>

                            <div className="flex justify-center gap-3">
                                <Button variant="secondary" onClick={() => setStep(1)}>
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </Button>
                                <Button
                                    variant="cta"
                                    onClick={handleFinish}
                                    disabled={loading}
                                >
                                    {loading ? "Setting up..." : (
                                        <><Rocket className="w-4 h-4" /> Launch RedProwler</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
