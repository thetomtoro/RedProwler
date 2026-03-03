import { NextRequest } from "next/server"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-helpers"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { leadFilterSchema } from "@/lib/validators"

export const GET = withErrorHandler(async (req: NextRequest) => {
    const user = await requireAuth()
    const params = Object.fromEntries(req.nextUrl.searchParams)
    const filters = leadFilterSchema.parse(params)

    // Get user's product IDs
    const userProducts = await prisma.product.findMany({
        where: { userId: user.id },
        select: { id: true },
    })
    const productIds = userProducts.map((p) => p.id)

    // Validate productId belongs to current user (prevents IDOR)
    if (filters.productId && !productIds.includes(filters.productId)) {
        throw new ApiError(403, "Forbidden")
    }

    const where = {
        productId: { in: filters.productId ? [filters.productId] : productIds },
        ...(filters.subredditId && { subredditId: filters.subredditId }),
        ...(filters.status && { status: filters.status }),
        ...(filters.minScore && { relevanceScore: { gte: filters.minScore } }),
        ...(filters.platform && { platform: filters.platform }),
        ...(filters.cursor && { createdAt: { lt: new Date(filters.cursor) } }),
    }

    const leads = await prisma.lead.findMany({
        where,
        include: {
            subreddit: { select: { name: true, displayName: true } },
            product: { select: { name: true } },
            _count: { select: { engagements: true } },
        },
        orderBy: { createdAt: "desc" },
        take: filters.limit + 1,
    })

    const hasMore = leads.length > filters.limit
    const items = hasMore ? leads.slice(0, -1) : leads
    const nextCursor = hasMore ? items[items.length - 1].createdAt.toISOString() : null

    return successResponse(items, {
        nextCursor,
        hasMore,
    })
})
