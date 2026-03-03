import { NextRequest } from "next/server"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-helpers"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export const POST = withErrorHandler(async (_req: NextRequest, ctx) => {
    const user = await requireAuth()
    const { id } = await ctx!.params

    const lead = await prisma.lead.findUnique({
        where: { id },
        include: { product: { select: { userId: true } } },
    })

    if (!lead) throw new ApiError(404, "Lead not found")
    if (lead.product.userId !== user.id) throw new ApiError(403, "Forbidden")

    const updated = await prisma.lead.update({
        where: { id },
        data: { isBookmarked: !lead.isBookmarked },
    })

    return successResponse({ isBookmarked: updated.isBookmarked })
})
