import { NextRequest } from "next/server"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-helpers"
import { requireAuth, checkPlanLimit } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { addSubredditSchema } from "@/lib/validators"

export const POST = withErrorHandler(async (req: NextRequest, ctx) => {
    const user = await requireAuth()
    const { id: productId } = await ctx!.params

    const product = await prisma.product.findUnique({
        where: { id: productId, userId: user.id },
        include: { _count: { select: { subreddits: true } } },
    })
    if (!product) throw new ApiError(404, "Product not found")

    checkPlanLimit(user.plan, "subredditsPerProduct", product._count.subreddits)

    const body = await req.json()
    const data = addSubredditSchema.parse(body)

    // Find or create subreddit
    let subreddit = await prisma.subreddit.findUnique({
        where: { name: data.name.toLowerCase() },
    })

    if (!subreddit) {
        subreddit = await prisma.subreddit.create({
            data: {
                name: data.name.toLowerCase(),
                displayName: data.name,
            },
        })
    }

    // Check if already linked
    const existing = await prisma.productSubreddit.findUnique({
        where: {
            productId_subredditId: {
                productId,
                subredditId: subreddit.id,
            },
        },
    })

    if (existing) throw new ApiError(409, "Subreddit already added to this product")

    const link = await prisma.productSubreddit.create({
        data: {
            productId,
            subredditId: subreddit.id,
            source: data.source,
        },
        include: { subreddit: true },
    })

    return successResponse(link)
})
