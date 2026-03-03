import { NextRequest } from "next/server"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-helpers"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export const GET = withErrorHandler(async (_req: NextRequest, ctx) => {
    const user = await requireAuth()
    const { id } = await ctx!.params

    const lead = await prisma.lead.findUnique({
        where: { id },
        include: {
            subreddit: { select: { name: true, displayName: true } },
            product: { select: { name: true, userId: true } },
            engagements: {
                orderBy: { createdAt: "desc" },
                take: 10,
            },
        },
    })

    if (!lead) throw new ApiError(404, "Lead not found")
    if (lead.product.userId !== user.id) throw new ApiError(403, "Forbidden")

    // Mark as viewed
    if (lead.status === "NEW") {
        await prisma.lead.update({
            where: { id },
            data: { status: "VIEWED" },
        })
    }

    return successResponse(lead)
})
