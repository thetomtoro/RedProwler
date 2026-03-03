import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { redditClient } from "@/lib/reddit"
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
        // ─── Lead Discovery ───

        const productSubreddits = await prisma.productSubreddit.findMany({
            where: { isActive: true },
            include: {
                product: {
                    select: {
                        id: true, userId: true, name: true,
                        description: true, keywords: true, targetAudience: true,
                    },
                },
                subreddit: true,
            },
        })

        const subredditGroups = new Map<string, typeof productSubreddits>()
        for (const ps of productSubreddits) {
            const key = ps.subreddit.name
            if (!subredditGroups.has(key)) {
                subredditGroups.set(key, [])
            }
            subredditGroups.get(key)!.push(ps)
        }

        let totalLeadsCreated = 0

        for (const [subredditName, links] of subredditGroups) {
            try {
                const { posts } = await redditClient.fetchSubredditPosts(subredditName, 25)

                for (const post of posts) {
                    const existing = await prisma.lead.findUnique({
                        where: { redditId: `t3_${post.id}` },
                    })
                    if (existing) continue

                    for (const link of links) {
                        const product = link.product

                        // Reset usage if new billing period
                        await resetUsageIfNeeded(product.userId)

                        // Atomic check-and-increment to prevent race conditions
                        const leadLimit = PLAN_LIMITS[
                            (await prisma.user.findUnique({
                                where: { id: product.userId },
                                select: { plan: true },
                            }))?.plan as PlanTier ?? "FREE"
                        ].leadsPerMonth

                        const result = await scoreLead(
                            {
                                title: post.title,
                                body: post.selftext,
                                subreddit: post.subreddit,
                                author: post.author,
                                redditScore: post.score,
                                commentCount: post.num_comments,
                            },
                            {
                                name: product.name,
                                description: product.description,
                                keywords: product.keywords,
                                targetAudience: product.targetAudience || undefined,
                            }
                        )

                        if (result.score >= 0.3) {
                            // Atomically check limit and increment
                            const usageResult = await prisma.user.updateMany({
                                where: {
                                    id: product.userId,
                                    leadsUsedThisMonth: { lt: leadLimit },
                                },
                                data: { leadsUsedThisMonth: { increment: 1 } },
                            })
                            if (usageResult.count === 0) continue // Limit reached

                            const lead = await prisma.lead.create({
                                data: {
                                    productId: product.id,
                                    subredditId: link.subredditId,
                                    redditId: `t3_${post.id}`,
                                    redditType: "POST",
                                    title: post.title,
                                    body: post.selftext,
                                    author: post.author,
                                    permalink: post.permalink,
                                    redditScore: post.score,
                                    commentCount: post.num_comments,
                                    redditCreatedAt: new Date(post.created_utc * 1000),
                                    relevanceScore: result.score,
                                    relevanceReason: result.reason,
                                    intentSignals: result.intentSignals,
                                    sentiment: result.sentiment,
                                },
                            })

                            totalLeadsCreated++

                            // Notify on high-relevance leads
                            if (result.score >= 0.8) {
                                await createNotification({
                                    recipientId: product.userId,
                                    type: "HIGH_RELEVANCE_LEAD",
                                    title: `High-relevance lead in r/${subredditName}`,
                                    body: post.title,
                                    referenceId: lead.id,
                                    referenceType: "Lead",
                                })

                                await sendSlackNotification(product.userId, {
                                    text: `🎯 High-relevance lead (${(result.score * 100).toFixed(0)}%) in r/${subredditName}: ${post.title}`,
                                })

                                await fireWebhooks(product.userId, "lead.high_relevance", {
                                    leadId: lead.id,
                                    title: post.title,
                                    subreddit: subredditName,
                                    score: result.score,
                                    permalink: post.permalink,
                                })
                            }
                        }
                    }
                }

                await prisma.subreddit.updateMany({
                    where: { name: subredditName },
                    data: { lastScannedAt: new Date() },
                })
            } catch (error) {
                logger.error(`Error scanning r/${subredditName}`, error)
            }
        }

        // ─── Competitor Mention Scanning ───

        let totalMentionsCreated = 0

        const competitors = await prisma.competitor.findMany({
            where: {
                user: { plan: { in: ["PRO", "TEAM"] } },
            },
            include: {
                user: { select: { id: true, plan: true } },
                product: {
                    include: {
                        subreddits: {
                            where: { isActive: true },
                            include: { subreddit: true },
                        },
                    },
                },
            },
        })

        // Group by subreddit to minimize API calls
        const competitorSubredditMap = new Map<string, Array<{
            competitor: typeof competitors[0]
            subredditName: string
        }>>()

        for (const competitor of competitors) {
            for (const ps of competitor.product.subreddits) {
                const name = ps.subreddit.name
                if (!competitorSubredditMap.has(name)) {
                    competitorSubredditMap.set(name, [])
                }
                competitorSubredditMap.get(name)!.push({
                    competitor,
                    subredditName: name,
                })
            }
        }

        for (const [subredditName, entries] of competitorSubredditMap) {
            try {
                for (const { competitor } of entries) {
                    const searchQuery = competitor.keywords.join(" OR ")
                    const posts = await redditClient.searchPosts(searchQuery, subredditName, 10)

                    for (const post of posts) {
                        const redditId = `t3_${post.id}`

                        const existingMention = await prisma.competitorMention.findFirst({
                            where: { competitorId: competitor.id, redditId },
                        })
                        if (existingMention) continue

                        // Verify keyword actually appears in text
                        const text = `${post.title} ${post.selftext}`.toLowerCase()
                        const hasKeyword = competitor.keywords.some((kw) =>
                            text.includes(kw.toLowerCase())
                        )
                        if (!hasKeyword) continue

                        const sentiment = text.includes("love") || text.includes("great") || text.includes("recommend")
                            ? "POSITIVE" as const
                            : text.includes("hate") || text.includes("terrible") || text.includes("worst")
                            ? "NEGATIVE" as const
                            : text.includes("?")
                            ? "QUESTION" as const
                            : "NEUTRAL" as const

                        const mention = await prisma.competitorMention.create({
                            data: {
                                competitorId: competitor.id,
                                redditId,
                                title: post.title,
                                body: post.selftext,
                                author: post.author,
                                permalink: post.permalink,
                                subredditName,
                                sentiment,
                            },
                        })

                        totalMentionsCreated++

                        await createNotification({
                            recipientId: competitor.userId,
                            type: "COMPETITOR_MENTION",
                            title: `${competitor.name} mentioned in r/${subredditName}`,
                            body: post.title,
                            referenceId: mention.id,
                            referenceType: "CompetitorMention",
                        })

                        await sendSlackNotification(competitor.userId, {
                            text: `👀 Competitor "${competitor.name}" mentioned in r/${subredditName}: ${post.title}`,
                        })

                        await fireWebhooks(competitor.userId, "competitor.mention", {
                            competitorId: competitor.id,
                            competitorName: competitor.name,
                            mentionId: mention.id,
                            subreddit: subredditName,
                            title: post.title,
                            permalink: post.permalink,
                            sentiment,
                        })
                    }
                }
            } catch (error) {
                logger.error(`Error scanning competitors in r/${subredditName}`, error)
            }
        }

        return NextResponse.json({
            success: true,
            subredditsScanned: subredditGroups.size,
            leadsCreated: totalLeadsCreated,
            competitorMentionsCreated: totalMentionsCreated,
        })
    } catch (error) {
        logger.error("Cron scan error", error)
        return NextResponse.json(
            { error: "Internal error" },
            { status: 500 }
        )
    }
}
