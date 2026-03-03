import { NextRequest } from "next/server"
import { withErrorHandler, successResponse } from "@/lib/api-helpers"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export const GET = withErrorHandler(async (req: NextRequest) => {
    const user = await requireAuth()

    const url = new URL(req.url)
    const unreadOnly = url.searchParams.get("unread") === "true"
    const cursor = url.searchParams.get("cursor") ?? undefined
    const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20"), 50)

    const notifications = await prisma.notification.findMany({
        where: {
            recipientId: user.id,
            ...(unreadOnly ? { read: false } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    })

    const hasMore = notifications.length > limit
    const items = hasMore ? notifications.slice(0, limit) : notifications

    const unreadCount = await prisma.notification.count({
        where: { recipientId: user.id, read: false },
    })

    return successResponse(items, {
        unreadCount,
        nextCursor: hasMore ? items[items.length - 1].id : null,
    })
})

const markReadSchema = z.object({
    ids: z.array(z.string()).min(1).max(100).optional(),
    all: z.boolean().optional(),
})

export const PATCH = withErrorHandler(async (req: NextRequest) => {
    const user = await requireAuth()
    const body = await req.json()
    const { ids, all } = markReadSchema.parse(body)

    if (all) {
        await prisma.notification.updateMany({
            where: { recipientId: user.id, read: false },
            data: { read: true },
        })
    } else if (ids?.length) {
        await prisma.notification.updateMany({
            where: {
                id: { in: ids },
                recipientId: user.id,
            },
            data: { read: true },
        })
    }

    return successResponse({ success: true })
})
