import { NextRequest } from "next/server"
import { withErrorHandler, successResponse } from "@/lib/api-helpers"
import { requireAuth, checkPlanLimit } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { createProductSchema } from "@/lib/validators"

export const GET = withErrorHandler(async () => {
    const user = await requireAuth()

    const products = await prisma.product.findMany({
        where: { userId: user.id },
        include: {
            subreddits: {
                include: { subreddit: true },
            },
            _count: { select: { leads: true } },
        },
        orderBy: { createdAt: "desc" },
    })

    return successResponse(products)
})

export const POST = withErrorHandler(async (req: NextRequest) => {
    const user = await requireAuth()

    // Check product limit
    const productCount = await prisma.product.count({
        where: { userId: user.id },
    })
    checkPlanLimit(user.plan, "productsLimit", productCount)

    const body = await req.json()
    const data = createProductSchema.parse(body)

    const product = await prisma.product.create({
        data: {
            userId: user.id,
            name: data.name,
            url: data.url || null,
            description: data.description,
            targetAudience: data.targetAudience || null,
            keywords: data.keywords,
        },
    })

    return successResponse(product)
})
