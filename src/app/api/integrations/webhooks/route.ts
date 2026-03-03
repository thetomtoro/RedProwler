import { NextRequest } from "next/server"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-helpers"
import { requirePlan } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { randomBytes } from "crypto"

const createWebhookSchema = z.object({
    url: z.string().url(),
    events: z.array(z.string()).min(1),
})

export const GET = withErrorHandler(async () => {
    const user = await requirePlan("PRO")

    const webhooks = await prisma.webhook.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    })

    return successResponse(webhooks)
})

export const POST = withErrorHandler(async (req: NextRequest) => {
    const user = await requirePlan("PRO")
    const body = await req.json()
    const data = createWebhookSchema.parse(body)

    const secret = randomBytes(32).toString("hex")

    const webhook = await prisma.webhook.create({
        data: {
            userId: user.id,
            url: data.url,
            events: data.events,
            secret,
        },
    })

    return successResponse(webhook)
})
