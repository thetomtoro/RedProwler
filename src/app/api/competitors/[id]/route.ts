import { NextRequest } from "next/server"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-helpers"
import { requirePlan } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export const GET = withErrorHandler(async (_req: NextRequest, ctx) => {
    const user = await requirePlan("PRO")
    const { id } = await ctx!.params

    const competitor = await prisma.competitor.findUnique({
        where: { id, userId: user.id },
        include: {
            product: { select: { name: true } },
            redditMentions: {
                orderBy: { createdAt: "desc" },
                take: 50,
            },
        },
    })

    if (!competitor) throw new ApiError(404, "Competitor not found")

    return successResponse(competitor)
})

export const DELETE = withErrorHandler(async (_req: NextRequest, ctx) => {
    const user = await requirePlan("PRO")
    const { id } = await ctx!.params

    const competitor = await prisma.competitor.findUnique({
        where: { id, userId: user.id },
    })
    if (!competitor) throw new ApiError(404, "Competitor not found")

    await prisma.competitor.delete({ where: { id } })

    return successResponse({ deleted: true })
})
