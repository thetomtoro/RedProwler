import { withErrorHandler, successResponse } from "@/lib/api-helpers"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export const GET = withErrorHandler(async () => {
    const user = await requireAuth()

    const productIds = (
        await prisma.product.findMany({
            where: { userId: user.id },
            select: { id: true },
        })
    ).map((p) => p.id)

    if (productIds.length === 0) {
        return successResponse({
            totalLeads: 0,
            totalEngagements: 0,
            engagementRate: 0,
            conversions: 0,
            leadsOverTime: [],
            statusBreakdown: [],
            subredditBreakdown: [],
            platformBreakdown: [],
        })
    }

    // Aggregate stats
    const [totalLeads, totalEngagements, conversions, statusCounts, subredditCounts, leadsOverTime, platformCounts] =
        await Promise.all([
            prisma.lead.count({ where: { productId: { in: productIds } } }),
            prisma.engagement.count({ where: { userId: user.id } }),
            prisma.lead.count({
                where: { productId: { in: productIds }, status: "CONVERTED" },
            }),
            prisma.lead.groupBy({
                by: ["status"],
                where: { productId: { in: productIds } },
                _count: { id: true },
            }),
            prisma.lead.groupBy({
                by: ["subredditId"],
                where: { productId: { in: productIds } },
                _count: { id: true },
                orderBy: { _count: { id: "desc" } },
                take: 10,
            }),
            // Leads per day for last 30 days
            prisma.$queryRaw`
                SELECT DATE(created_at) as date, COUNT(*)::int as count
                FROM leads
                WHERE product_id = ANY(${productIds})
                AND created_at > NOW() - INTERVAL '30 days'
                GROUP BY DATE(created_at)
                ORDER BY date ASC
            ` as Promise<Array<{ date: string; count: number }>>,
            prisma.lead.groupBy({
                by: ["platform"],
                where: { productId: { in: productIds } },
                _count: { id: true },
            }),
        ])

    // Get subreddit names for breakdown
    const subredditIds = subredditCounts.map((s) => s.subredditId).filter((id): id is string => id !== null)
    const subreddits = await prisma.subreddit.findMany({
        where: { id: { in: subredditIds } },
        select: { id: true, name: true },
    })
    const subMap = Object.fromEntries(subreddits.map((s) => [s.id, s.name]))

    const engagementRate = totalLeads > 0 ? (totalEngagements / totalLeads) * 100 : 0

    return successResponse({
        totalLeads,
        totalEngagements,
        engagementRate: Math.round(engagementRate * 10) / 10,
        conversions,
        leadsOverTime,
        statusBreakdown: statusCounts.map((s) => ({
            status: s.status,
            count: s._count.id,
        })),
        subredditBreakdown: subredditCounts.map((s) => ({
            subreddit: (s.subredditId && subMap[s.subredditId]) || "unknown",
            count: s._count.id,
        })),
        platformBreakdown: platformCounts.map((p) => ({
            platform: p.platform,
            count: p._count.id,
        })),
    })
})
