import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { redditClient } from "@/lib/reddit"
import { scoreLead } from "@/lib/scoring"

export async function GET(req: NextRequest) {
    // Verify cron secret
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        // Get all active product-subreddit pairs
        const productSubreddits = await prisma.productSubreddit.findMany({
            where: { isActive: true },
            include: {
                product: true,
                subreddit: true,
            },
        })

        // Group by subreddit to avoid duplicate API calls
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
                // Fetch latest posts
                const { posts } = await redditClient.fetchSubredditPosts(subredditName, 25)

                for (const post of posts) {
                    // Skip if already tracked
                    const existing = await prisma.lead.findUnique({
                        where: { redditId: `t3_${post.id}` },
                    })
                    if (existing) continue

                    // Score against each product linked to this subreddit
                    for (const link of links) {
                        const product = link.product

                        // Check user lead limit
                        const user = await prisma.user.findUnique({
                            where: { id: product.userId },
                        })
                        if (!user) continue

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

                        // Only store leads with score >= 0.3
                        if (result.score >= 0.3) {
                            await prisma.lead.create({
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

                            // Increment user's lead usage
                            await prisma.user.update({
                                where: { id: user.id },
                                data: { leadsUsedThisMonth: { increment: 1 } },
                            })

                            totalLeadsCreated++
                        }
                    }
                }

                // Update last scanned timestamp
                await prisma.subreddit.updateMany({
                    where: { name: subredditName },
                    data: { lastScannedAt: new Date() },
                })
            } catch (error) {
                console.error(`Error scanning r/${subredditName}:`, error)
            }
        }

        return NextResponse.json({
            success: true,
            subredditsScanned: subredditGroups.size,
            leadsCreated: totalLeadsCreated,
        })
    } catch (error) {
        console.error("Cron scan error:", error)
        return NextResponse.json(
            { error: "Internal error" },
            { status: 500 }
        )
    }
}
