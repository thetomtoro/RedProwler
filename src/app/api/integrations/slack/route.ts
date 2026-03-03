import { NextRequest } from "next/server"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-helpers"
import { requirePlan } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { isValidSlackUrl } from "@/lib/safe-fetch"

const slackSchema = z.object({
    webhookUrl: z.string().url().max(500).refine(
        (url) => isValidSlackUrl(url),
        "Must be a valid Slack webhook URL (https://hooks.slack.com/services/...)"
    ),
})

export const POST = withErrorHandler(async (req: NextRequest) => {
    const user = await requirePlan("PRO")
    const body = await req.json()
    const { webhookUrl } = slackSchema.parse(body)

    await prisma.user.update({
        where: { id: user.id },
        data: { slackWebhookUrl: webhookUrl },
    })

    return successResponse({ connected: true })
})

export const DELETE = withErrorHandler(async () => {
    const user = await requirePlan("PRO")

    await prisma.user.update({
        where: { id: user.id },
        data: { slackWebhookUrl: null },
    })

    return successResponse({ disconnected: true })
})

export const GET = withErrorHandler(async () => {
    const user = await requirePlan("PRO")

    return successResponse({
        connected: !!user.slackWebhookUrl,
        webhookUrl: user.slackWebhookUrl ? "***" + user.slackWebhookUrl.slice(-10) : null,
    })
})
