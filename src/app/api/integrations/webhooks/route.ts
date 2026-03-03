import { NextRequest } from "next/server"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-helpers"
import { requirePlan } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { randomBytes } from "crypto"

const BLOCKED_HOSTNAMES = [
    "localhost", "127.0.0.1", "0.0.0.0", "[::1]", "[::]",
    "169.254.169.254", "metadata.google.internal",
]

const createWebhookSchema = z.object({
    url: z.string().url().refine((url) => {
        try {
            const parsed = new URL(url)
            if (parsed.protocol !== "https:") return false
            if (BLOCKED_HOSTNAMES.includes(parsed.hostname)) return false
            // Block private/internal IP ranges
            if (/^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(parsed.hostname)) return false
            return true
        } catch {
            return false
        }
    }, "Webhook URL must be HTTPS and point to a public endpoint"),
    events: z.array(z.string()).min(1),
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
