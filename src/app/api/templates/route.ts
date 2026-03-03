import { NextRequest } from "next/server"
import { withErrorHandler, successResponse } from "@/lib/api-helpers"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { templateFilterSchema } from "@/lib/validators"

export const GET = withErrorHandler(async (req: NextRequest) => {
    const user = await requireAuth()
    const params = Object.fromEntries(req.nextUrl.searchParams)
    const { category, search } = templateFilterSchema.parse(params)

    const templates = await prisma.template.findMany({
        where: {
            ...(category && category !== "ALL" ? { category: category as never } : {}),
            ...(search ? {
                OR: [
                    { title: { contains: search, mode: "insensitive" as const } },
                    { body: { contains: search, mode: "insensitive" as const } },
                    { tags: { has: search.toLowerCase() } },
                ],
            } : {}),
        },
        include: {
            favorites: {
                where: { userId: user.id },
                select: { id: true },
            },
        },
        orderBy: { usageCount: "desc" },
    })

    const data = templates.map((t) => ({
        ...t,
        isFavorited: t.favorites.length > 0,
        favorites: undefined,
    }))

    return successResponse(data)
})
