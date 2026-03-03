"use client"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"
import { Tabs } from "@/components/ui/Tabs"
import { Check, CreditCard, Bell, Link2, Users, Download, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { PRICING, PLAN_LIMITS } from "@/constants"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const settingsTabs = [
    { id: "billing", label: "Billing" },
    { id: "notifications", label: "Notifications" },
    { id: "integrations", label: "Integrations" },
    { id: "team", label: "Team" },
]

interface UserData {
    plan: string
    leadsUsedThisMonth: number
    aiCreditsUsedThisMonth: number
    slackWebhookUrl?: string
}

export default function SettingsPage() {
    const queryClient = useQueryClient()
    const [activeTab, setActiveTab] = useState("billing")
    const [slackUrl, setSlackUrl] = useState("")
    const [inviteEmail, setInviteEmail] = useState("")

    const { data: user } = useQuery({
        queryKey: ["user-settings"],
        queryFn: async () => {
            // Get user data from analytics endpoint (which returns user context)
            const res = await fetch("/api/analytics")
            if (!res.ok) return null
            return null as UserData | null
        },
    })

    const upgradeToProPlan = useMutation({
        mutationFn: async (plan: "PRO" | "TEAM") => {
            const res = await fetch("/api/billing/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan }),
            })
            const { data } = await res.json()
            if (data?.url) window.location.href = data.url
        },
    })

    const openPortal = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/billing/portal", { method: "POST" })
            const { data } = await res.json()
            if (data?.url) window.location.href = data.url
        },
    })

    const connectSlack = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/integrations/slack", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ webhookUrl: slackUrl }),
            })
            if (!res.ok) throw new Error("Failed to connect")
        },
        onSuccess: () => {
            setSlackUrl("")
            queryClient.invalidateQueries({ queryKey: ["user-settings"] })
        },
    })

    const exportLeads = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/integrations/export")
            if (!res.ok) throw new Error("Export failed")
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `redprowler-leads-${new Date().toISOString().split("T")[0]}.csv`
            a.click()
            URL.revokeObjectURL(url)
        },
    })

    const inviteMember = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/team", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: inviteEmail, role: "MEMBER" }),
            })
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error?.message || "Failed to invite")
            }
        },
        onSuccess: () => {
            setInviteEmail("")
            queryClient.invalidateQueries({ queryKey: ["team-members"] })
        },
    })

    const currentPlan = user?.plan || "FREE"
    const limits = PLAN_LIMITS[currentPlan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.FREE

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-text-secondary mt-1">
                    Manage your account, billing, and integrations.
                </p>
            </div>

            <Tabs tabs={settingsTabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === "billing" && (
                <div className="space-y-6">
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-semibold">Current Plan</h2>
                                <p className="text-text-secondary text-sm">
                                    You&apos;re on the {PRICING[currentPlan as keyof typeof PRICING]?.name || "Starter"} plan.
                                </p>
                            </div>
                            <Badge variant={currentPlan === "FREE" ? "default" : "accent"}>
                                {PRICING[currentPlan as keyof typeof PRICING]?.name || "Free"}
                            </Badge>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 mb-6">
                            <div className="rounded-lg bg-bg-tertiary p-4">
                                <p className="text-sm text-text-secondary">Leads Used</p>
                                <p className="text-xl font-bold mt-1">
                                    {user?.leadsUsedThisMonth ?? 0} / {limits.leadsPerMonth}
                                </p>
                                <div className="w-full h-1.5 rounded-full bg-bg-quaternary mt-2">
                                    <div
                                        className="h-full rounded-full bg-accent transition-all"
                                        style={{
                                            width: `${Math.min(((user?.leadsUsedThisMonth ?? 0) / limits.leadsPerMonth) * 100, 100)}%`,
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="rounded-lg bg-bg-tertiary p-4">
                                <p className="text-sm text-text-secondary">AI Generations Used</p>
                                <p className="text-xl font-bold mt-1">
                                    {user?.aiCreditsUsedThisMonth ?? 0} / {limits.aiGenerationsPerMonth}
                                </p>
                                <div className="w-full h-1.5 rounded-full bg-bg-quaternary mt-2">
                                    <div
                                        className="h-full rounded-full bg-success transition-all"
                                        style={{
                                            width: `${Math.min(((user?.aiCreditsUsedThisMonth ?? 0) / limits.aiGenerationsPerMonth) * 100, 100)}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {currentPlan === "FREE" && (
                                <Button
                                    variant="primary"
                                    onClick={() => upgradeToProPlan.mutate("PRO")}
                                    disabled={upgradeToProPlan.isPending}
                                >
                                    <CreditCard className="w-4 h-4" /> Upgrade to Pro
                                </Button>
                            )}
                            {currentPlan !== "FREE" && (
                                <Button
                                    variant="secondary"
                                    onClick={() => openPortal.mutate()}
                                    disabled={openPortal.isPending}
                                >
                                    Manage Subscription
                                </Button>
                            )}
                        </div>
                    </Card>

                    <div className="grid sm:grid-cols-3 gap-4">
                        {(Object.entries(PRICING) as [string, typeof PRICING.FREE][]).map(([key, plan]) => (
                            <Card key={key}>
                                <h3 className="font-semibold">{plan.name}</h3>
                                <p className="text-text-secondary text-xs mt-1">{plan.description}</p>
                                <p className="text-2xl font-bold mt-3">
                                    ${plan.price}<span className="text-sm text-text-secondary font-normal">/mo</span>
                                </p>
                                <div className="mt-4 space-y-2">
                                    {Object.entries(PLAN_LIMITS[key as keyof typeof PLAN_LIMITS])
                                        .filter(([, v]) => typeof v === "number")
                                        .slice(0, 4)
                                        .map(([limitKey, value]) => (
                                            <div key={limitKey} className="flex items-center gap-2 text-xs text-text-secondary">
                                                <Check className="w-3 h-3 text-success" />
                                                <span>{String(value)} {limitKey.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
                                            </div>
                                        ))}
                                </div>
                                {key !== currentPlan && key !== "FREE" && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="mt-4 w-full"
                                        onClick={() => upgradeToProPlan.mutate(key as "PRO" | "TEAM")}
                                        disabled={upgradeToProPlan.isPending}
                                    >
                                        {currentPlan === "FREE" ? "Upgrade" : key === "TEAM" ? "Upgrade" : "Downgrade"}
                                    </Button>
                                )}
                                {key === currentPlan && (
                                    <div className="mt-4 text-center">
                                        <Badge variant="accent">Current Plan</Badge>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "notifications" && (
                <Card>
                    <div className="flex items-center gap-3 mb-4">
                        <Bell className="w-5 h-5 text-accent" />
                        <h2 className="text-lg font-semibold">Notification Preferences</h2>
                    </div>
                    <p className="text-text-secondary text-sm">
                        Configure how you want to be notified about new leads and competitor mentions.
                    </p>
                    <div className="mt-6 space-y-4">
                        {["High-relevance leads", "Daily digest", "Competitor mentions", "Usage limit warnings"].map((item) => (
                            <div key={item} className="flex items-center justify-between py-2">
                                <span className="text-sm">{item}</span>
                                <div className="w-10 h-5 rounded-full bg-accent relative cursor-pointer">
                                    <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {activeTab === "integrations" && (
                <div className="space-y-4">
                    <Card>
                        <div className="flex items-center gap-3 mb-4">
                            <Link2 className="w-5 h-5 text-accent" />
                            <h2 className="text-lg font-semibold">Integrations</h2>
                        </div>

                        {/* Slack */}
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-bg-tertiary">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="font-medium text-sm">Slack Notifications</p>
                                        <p className="text-xs text-text-tertiary">Get lead alerts in your Slack channel</p>
                                    </div>
                                    <Badge variant="default">Pro</Badge>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="https://hooks.slack.com/services/..."
                                        value={slackUrl}
                                        onChange={(e) => setSlackUrl(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => connectSlack.mutate()}
                                        disabled={!slackUrl || connectSlack.isPending}
                                    >
                                        Connect
                                    </Button>
                                </div>
                            </div>

                            {/* CSV Export */}
                            <div className="flex items-center justify-between p-4 rounded-lg bg-bg-tertiary">
                                <div>
                                    <p className="font-medium text-sm">Export Leads (CSV)</p>
                                    <p className="text-xs text-text-tertiary">Download all your leads as a CSV file</p>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => exportLeads.mutate()}
                                    disabled={exportLeads.isPending}
                                >
                                    <Download className="w-3.5 h-3.5" /> Export
                                </Button>
                            </div>

                            {/* Webhooks */}
                            <div className="flex items-center justify-between p-4 rounded-lg bg-bg-tertiary">
                                <div>
                                    <p className="font-medium text-sm">Custom Webhooks</p>
                                    <p className="text-xs text-text-tertiary">Send events to your own endpoints</p>
                                </div>
                                <Badge variant="default">Pro</Badge>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === "team" && (
                <Card>
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="w-5 h-5 text-accent" />
                        <h2 className="text-lg font-semibold">Team Members</h2>
                    </div>
                    <p className="text-text-secondary text-sm mb-4">
                        Invite team members to collaborate. Available on the Team plan (up to 10 members).
                    </p>

                    <div className="flex gap-2 mb-4">
                        <Input
                            placeholder="team@member.com"
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => inviteMember.mutate()}
                            disabled={!inviteEmail || inviteMember.isPending}
                        >
                            <Plus className="w-3.5 h-3.5" /> Invite
                        </Button>
                    </div>

                    {inviteMember.isError && (
                        <p className="text-sm text-error mb-3">
                            {(inviteMember.error as Error).message}
                        </p>
                    )}

                    <div className="text-center py-8 text-text-tertiary text-sm">
                        No team members yet.
                    </div>
                </Card>
            )}
        </div>
    )
}
