import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createNotification, sendSlackNotification, fireWebhooks } from "@/lib/notifications"
import { PLAN_LIMITS } from "@/constants"
import type { PlanTier } from "@/generated/prisma/client"

export async function GET(req: NextRequest) {
    const cronSecret = process.env.CRON_SECRET
    const authHeader = req.headers.get("authorization")
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

        const users = await prisma.user.findMany({
            where: { products: { some: {} } },
            select: {
                id: true,
                plan: true,
                email: true,
                displayName: true,
                leadsUsedThisMonth: true,
                slackWebhookUrl: true,
            },
        })

        let digestsSent = 0

        for (const user of users) {
            try {
                const recentLeads = await prisma.lead.findMany({
                    where: {
                        product: { userId: user.id },
                        createdAt: { gte: oneDayAgo },
                    },
                    include: {
                        product: { select: { name: true } },
                        subreddit: { select: { name: true } },
                    },
                    orderBy: { relevanceScore: "desc" },
                })

                if (recentLeads.length === 0) continue

                const recentMentions = await prisma.competitorMention.findMany({
                    where: {
                        competitor: { userId: user.id },
                        createdAt: { gte: oneDayAgo },
                    },
                    include: {
                        competitor: { select: { name: true } },
                    },
                })

                // Group leads by product
                const leadsByProduct = new Map<string, typeof recentLeads>()
                for (const lead of recentLeads) {
                    const key = lead.product.name
                    if (!leadsByProduct.has(key)) {
                        leadsByProduct.set(key, [])
                    }
                    leadsByProduct.get(key)!.push(lead)
                }

                const highRelevanceCount = recentLeads.filter((l) => l.relevanceScore >= 0.8).length
                const lines: string[] = [
                    `📊 Daily Digest: ${recentLeads.length} new leads found`,
                ]

                for (const [productName, leads] of leadsByProduct) {
                    const topScore = Math.max(...leads.map((l) => l.relevanceScore))
                    lines.push(
                        `• ${productName}: ${leads.length} leads (best: ${(topScore * 100).toFixed(0)}%)`
                    )
                }

                if (recentMentions.length > 0) {
                    lines.push(`👀 ${recentMentions.length} competitor mentions detected`)
                }

                // Usage warning
                const limits = PLAN_LIMITS[user.plan as PlanTier]
                const usagePercent = (user.leadsUsedThisMonth / limits.leadsPerMonth) * 100
                if (usagePercent >= 80) {
                    lines.push(
                        `⚠️ Usage: ${user.leadsUsedThisMonth}/${limits.leadsPerMonth} leads (${usagePercent.toFixed(0)}%)`
                    )

                    if (usagePercent >= 90) {
                        await createNotification({
                            recipientId: user.id,
                            type: "USAGE_LIMIT_WARNING",
                            title: "Approaching lead limit",
                            body: `You've used ${user.leadsUsedThisMonth} of ${limits.leadsPerMonth} leads this month (${usagePercent.toFixed(0)}%).`,
                        })
                    }
                }

                const digestBody = lines.join("\n")

                await createNotification({
                    recipientId: user.id,
                    type: "WEEKLY_DIGEST",
                    title: `Daily Digest: ${recentLeads.length} leads, ${highRelevanceCount} high-relevance`,
                    body: digestBody,
                })

                if (limits.slackIntegration) {
                    await sendSlackNotification(user.id, { text: digestBody })
                }

                if (limits.webhooks) {
                    await fireWebhooks(user.id, "digest.daily", {
                        totalLeads: recentLeads.length,
                        highRelevanceLeads: highRelevanceCount,
                        competitorMentions: recentMentions.length,
                        leadsByProduct: Object.fromEntries(
                            Array.from(leadsByProduct.entries()).map(([name, leads]) => [
                                name,
                                {
                                    count: leads.length,
                                    topLeads: leads.slice(0, 3).map((l) => ({
                                        id: l.id,
                                        title: l.title,
                                        score: l.relevanceScore,
                                        subreddit: l.subreddit?.name ?? "hackernews",
                                    })),
                                },
                            ])
                        ),
                    })
                }

                digestsSent++
            } catch (error) {
                console.error(`Digest failed for user ${user.id}:`, error)
            }
        }

        return NextResponse.json({
            success: true,
            digestsSent,
            usersProcessed: users.length,
        })
    } catch (error) {
        console.error("Daily digest cron error:", error)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}
