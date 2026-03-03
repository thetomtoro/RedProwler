import { NextRequest } from "next/server"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-helpers"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { updateProductSchema } from "@/lib/validators"

export const GET = withErrorHandler(async (_req: NextRequest, ctx) => {
    const user = await requireAuth()
    const { id } = await ctx!.params

    const product = await prisma.product.findUnique({
        where: { id, userId: user.id },
        include: {
            subreddits: { include: { subreddit: true } },
            _count: { select: { leads: true } },
        },
    })

    if (!product) throw new ApiError(404, "Product not found")

    return successResponse(product)
})

export const PATCH = withErrorHandler(async (req: NextRequest, ctx) => {
    const user = await requireAuth()
    const { id } = await ctx!.params
    const body = await req.json()
    const data = updateProductSchema.parse(body)

    const product = await prisma.product.findUnique({
        where: { id, userId: user.id },
    })
    if (!product) throw new ApiError(404, "Product not found")

    const updated = await prisma.product.update({
        where: { id },
        data,
    })

    return successResponse(updated)
})

export const DELETE = withErrorHandler(async (_req: NextRequest, ctx) => {
    const user = await requireAuth()
    const { id } = await ctx!.params

    const product = await prisma.product.findUnique({
        where: { id, userId: user.id },
    })
    if (!product) throw new ApiError(404, "Product not found")

    await prisma.product.delete({ where: { id } })

    return successResponse({ deleted: true })
})
