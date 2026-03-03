import { NextRequest } from "next/server"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-helpers"
import { requirePlan } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { addCompetitorSchema } from "@/lib/validators"

export const GET = withErrorHandler(async () => {
    const user = await requirePlan("PRO")

    const competitors = await prisma.competitor.findMany({
        where: { userId: user.id },
        include: {
            product: { select: { name: true } },
            _count: { select: { redditMentions: true } },
        },
        orderBy: { createdAt: "desc" },
    })

    return successResponse(competitors)
})

export const POST = withErrorHandler(async (req: NextRequest) => {
    const user = await requirePlan("PRO")
    const body = await req.json()
    const data = addCompetitorSchema.parse(body)

    // Read productId from the already-parsed body (not a second req.json() call)
    const productId = body.productId as string | undefined

    // Validate product ownership
    const userProducts = await prisma.product.findMany({
        where: { userId: user.id },
        select: { id: true },
    })

    if (userProducts.length === 0) {
        throw new ApiError(400, "Create a product first before adding competitors")
    }

    const userProductIds = new Set(userProducts.map((p) => p.id))
    const targetProductId = productId || userProducts[0].id

    if (productId && !userProductIds.has(productId)) {
        throw new ApiError(403, "Forbidden")
    }

    const competitor = await prisma.competitor.create({
        data: {
            userId: user.id,
            productId: targetProductId,
            name: data.name,
            keywords: data.keywords,
        },
    })

    return successResponse(competitor)
})
