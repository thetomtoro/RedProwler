import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hnClient } from "@/lib/hackernews"
import { scoreLead } from "@/lib/scoring"
import { PLAN_LIMITS } from "@/constants"
import { resetUsageIfNeeded } from "@/lib/auth-helpers"
import { createNotification, sendSlackNotification, fireWebhooks } from "@/lib/notifications"
import { verifyCronAuth } from "@/lib/cron-auth"
import { logger } from "@/lib/logger"
import type { PlanTier } from "@/generated/prisma/client"

export async function GET(req: NextRequest) {
    const authError = verifyCronAuth(req)
    if (authError) return authError

    try {
        // Load products with only needed fields (avoid over-fetching user data)
        const products = await prisma.product.findMany({
            where: { keywords: { isEmpty: false } },
            select: {
                id: true,
                userId: true,
                name: true,
                description: true,
                keywords: true,
                targetAudience: true,
            },
        })

        let totalLeadsCreated = 0

        for (const product of products) {
            try {
                // Reset usage if new billing period
                await resetUsageIfNeeded(product.userId)
                const user = await prisma.user.findUnique({
                    where: { id: product.userId },
                    select: { id: true, plan: true, leadsUsedThisMonth: true },
                })
                if (!user) continue

                const leadLimit = PLAN_LIMITS[user.plan as PlanTier].leadsPerMonth
                if (user.leadsUsedThisMonth >= leadLimit) continue

                // Search HN for each keyword (deduplicate across keywords)
                const seenIds = new Set<string>()
                const allStories = []

                for (const keyword of product.keywords.slice(0, 5)) {
                    const [stories, askHn] = await Promise.all([
                        hnClient.searchStories(keyword, 10),
                        hnClient.searchAskHN(keyword, 10),
                    ])
                    for (const story of [...stories, ...askHn]) {
                        if (!seenIds.has(story.objectID)) {
                            seenIds.add(story.objectID)
                            allStories.push(story)
                        }
                    }
                }

                for (const story of allStories) {
                    // Check if already exists
                    const hnId = `hn_${story.objectID}`
                    const existing = await prisma.lead.findUnique({
                        where: { redditId: hnId },
                    })
                    if (existing) continue

                    const result = await scoreLead(
                        {
                            title: story.title,
                            body: story.story_text || "",
                            subreddit: "hackernews",
                            author: story.author,
                            redditScore: story.points,
                            commentCount: story.num_comments,
                            platform: "HACKER_NEWS",
                        },
                        {
                            name: product.name,
                            description: product.description,
                            keywords: product.keywords,
                            targetAudience: product.targetAudience || undefined,
                        }
                    )

                    if (result.score >= 0.3) {
                        // Atomic check-and-increment to prevent race conditions
                        const usageResult = await prisma.user.updateMany({
                            where: {
                                id: user.id,
                                leadsUsedThisMonth: { lt: leadLimit },
                            },
                            data: { leadsUsedThisMonth: { increment: 1 } },
                        })
                        if (usageResult.count === 0) break // Limit reached

                        const lead = await prisma.lead.create({
                            data: {
                                productId: product.id,
                                subredditId: null,
                                redditId: hnId,
                                redditType: "POST",
                                title: story.title,
                                body: story.story_text || "",
                                author: story.author,
                                permalink: `https://news.ycombinator.com/item?id=${story.objectID}`,
                                redditScore: story.points,
                                commentCount: story.num_comments,
                                redditCreatedAt: new Date(story.created_at_i * 1000),
                                relevanceScore: result.score,
                                relevanceReason: result.reason,
                                intentSignals: result.intentSignals,
                                sentiment: result.sentiment,
                                platform: "HACKER_NEWS",
                            },
                        })

                        totalLeadsCreated++

                        if (result.score >= 0.8) {
                            await createNotification({
                                recipientId: user.id,
                                type: "HIGH_RELEVANCE_LEAD",
                                title: "High-relevance lead on Hacker News",
                                body: story.title,
                                referenceId: lead.id,
                                referenceType: "Lead",
                            })

                            await sendSlackNotification(user.id, {
                                text: `🎯 High-relevance HN lead (${(result.score * 100).toFixed(0)}%): ${story.title}`,
                            })

                            await fireWebhooks(user.id, "lead.high_relevance", {
                                leadId: lead.id,
                                title: story.title,
                                platform: "HACKER_NEWS",
                                score: result.score,
                                permalink: `https://news.ycombinator.com/item?id=${story.objectID}`,
                            })
                        }
                    }
                }
            } catch (error) {
                logger.error(`Error scanning HN for product ${product.name}`, error)
            }
        }

        return NextResponse.json({
            success: true,
            leadsCreated: totalLeadsCreated,
        })
    } catch (error) {
        logger.error("HN cron scan error", error)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}
