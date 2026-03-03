import { NextRequest } from "next/server"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-helpers"
import { requirePlan } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { randomBytes } from "crypto"
import { validateWebhookUrl } from "@/lib/safe-fetch"

const createWebhookSchema = z.object({
    url: z.string().url().max(2048),
    events: z.array(z.string().max(100)).min(1).max(20),
})

export const GET = withErrorHandler(async () => {
    const user = await requirePlan("PRO")

    const webhooks = await prisma.webhook.findMany({
        where: { userId: user.id },
        select: { id: true, url: true, events: true, isActive: true, createdAt: true, updatedAt: true },
        orderBy: { createdAt: "desc" },
    })

    return successResponse(webhooks)
})

export const POST = withErrorHandler(async (req: NextRequest) => {
    const user = await requirePlan("PRO")
    const body = await req.json()
    const data = createWebhookSchema.parse(body)

    // SSRF-safe URL validation with DNS resolution
    const validation = await validateWebhookUrl(data.url)
    if (!validation.valid) {
        throw new ApiError(400, `Invalid webhook URL: ${validation.reason}`)
    }

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
