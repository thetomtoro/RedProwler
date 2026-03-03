import { prisma } from "@/lib/prisma"
import { PLAN_LIMITS } from "@/constants"
import { createHmac } from "crypto"
import type { NotificationType, PlanTier } from "@/generated/prisma/client"

// ─── In-App Notification Creation ───

interface CreateNotificationInput {
    recipientId: string
    type: NotificationType
    title: string
    body?: string
    referenceId?: string
    referenceType?: string
}

export async function createNotification(input: CreateNotificationInput) {
    return prisma.notification.create({
        data: {
            recipientId: input.recipientId,
            type: input.type,
            title: input.title,
            body: input.body ?? null,
            referenceId: input.referenceId ?? null,
            referenceType: input.referenceType ?? null,
        },
    })
}

// ─── Slack Notification ───

export async function sendSlackNotification(
    userId: string,
    message: { text: string }
): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { slackWebhookUrl: true, plan: true },
    })

    if (!user?.slackWebhookUrl) return false
    if (!PLAN_LIMITS[user.plan as PlanTier].slackIntegration) return false

    try {
        const response = await fetch(user.slackWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(message),
        })
        return response.ok
    } catch (error) {
        console.error(`Slack notification failed for user ${userId}:`, error)
        return false
    }
}

// ─── Custom Webhook Firing ───

export async function fireWebhooks(
    userId: string,
    event: string,
    payload: Record<string, unknown>
): Promise<void> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true },
    })
    if (!user || !PLAN_LIMITS[user.plan as PlanTier].webhooks) return

    const webhooks = await prisma.webhook.findMany({
        where: { userId, isActive: true },
    })

    const matching = webhooks.filter((wh) => wh.events.includes(event))
    if (matching.length === 0) return

    const body = JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        data: payload,
    })

    await Promise.allSettled(
        matching.map(async (wh) => {
            const signature = createHmac("sha256", wh.secret)
                .update(body)
                .digest("hex")

            try {
                await fetch(wh.url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Webhook-Signature": signature,
                        "X-Webhook-Event": event,
                    },
                    body,
                    signal: AbortSignal.timeout(10000),
                })
            } catch (error) {
                console.error(`Webhook ${wh.id} delivery failed:`, error)
            }
        })
    )
}
