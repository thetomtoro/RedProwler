import { NextRequest } from "next/server"
import { withErrorHandler, successResponse } from "@/lib/api-helpers"
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

    // Require a productId
    const productId = (await req.json().catch(() => ({}))).productId
    const products = await prisma.product.findMany({
        where: { userId: user.id },
        select: { id: true },
        take: 1,
    })

    if (products.length === 0) {
        throw new Error("Create a product first before adding competitors")
    }

    const competitor = await prisma.competitor.create({
        data: {
            userId: user.id,
            productId: productId || products[0].id,
            name: data.name,
            keywords: data.keywords,
        },
    })

    return successResponse(competitor)
})
