import { NextRequest } from "next/server"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-helpers"
import { requirePlan } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export const DELETE = withErrorHandler(async (_req: NextRequest, ctx) => {
    const user = await requirePlan("TEAM")
    const { id } = await ctx!.params

    const member = await prisma.teamMember.findUnique({
        where: { id, teamOwnerId: user.id },
    })
    if (!member) throw new ApiError(404, "Team member not found")

    await prisma.teamMember.delete({ where: { id } })

    return successResponse({ deleted: true })
})
