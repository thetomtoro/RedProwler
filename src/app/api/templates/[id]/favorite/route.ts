import { NextRequest } from "next/server"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-helpers"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export const POST = withErrorHandler(async (_req: NextRequest, ctx) => {
    const user = await requireAuth()
    const { id: templateId } = await ctx!.params

    const template = await prisma.template.findUnique({ where: { id: templateId } })
    if (!template) throw new ApiError(404, "Template not found")

    const existing = await prisma.templateFavorite.findUnique({
        where: {
            userId_templateId: { userId: user.id, templateId },
        },
    })

    if (existing) {
        await prisma.templateFavorite.delete({ where: { id: existing.id } })
        return successResponse({ isFavorited: false })
    }

    await prisma.templateFavorite.create({
        data: { userId: user.id, templateId },
    })

    return successResponse({ isFavorited: true })
})
