import { NextRequest } from "next/server"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-helpers"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export const DELETE = withErrorHandler(async (_req: NextRequest, ctx) => {
    const user = await requireAuth()
    const { id: productId, linkId } = await ctx!.params

    const product = await prisma.product.findUnique({
        where: { id: productId, userId: user.id },
    })
    if (!product) throw new ApiError(404, "Product not found")

    const link = await prisma.productSubreddit.findUnique({
        where: { id: linkId, productId },
    })
    if (!link) throw new ApiError(404, "Subreddit link not found")

    await prisma.productSubreddit.delete({ where: { id: linkId } })

    return successResponse({ deleted: true })
})
