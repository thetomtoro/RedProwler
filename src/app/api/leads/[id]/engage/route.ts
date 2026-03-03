import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { createStreamingResponse } from "@/lib/ai"
import { getReplyGenerationPrompt, getConversationStarterPrompt, getDMTemplatePrompt } from "@/lib/prompts"
import { generateReplySchema } from "@/lib/validators"
import { MODELS } from "@/constants"
import { PLAN_LIMITS } from "@/constants"
import { resetUsageIfNeeded } from "@/lib/auth-helpers"
import { checkRateLimit } from "@/lib/rate-limit"
import { logger } from "@/lib/logger"

const ENGAGEMENT_TYPE_MAP = {
    reply: "REPLY",
    conversation_starter: "CONVERSATION_STARTER",
    dm_template: "DM_TEMPLATE",
} as const

export async function POST(req: NextRequest, ctx: { params: Promise<Record<string, string>> }) {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) {
            return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 })
        }

        let user = await prisma.user.findUnique({ where: { clerkId } })
        if (!user) {
            return NextResponse.json({ error: { message: "User not found" } }, { status: 401 })
        }

        // Rate limit: 10 AI generations per minute per user
        const rl = checkRateLimit(`engage:${user.id}`, 10, 60_000)
        if (!rl.allowed) {
            return NextResponse.json(
                { error: { message: "Too many requests. Please wait before generating again." } },
                { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
            )
        }

        // Reset usage counters if new billing period
        await resetUsageIfNeeded(user.id)
        user = await prisma.user.findUnique({ where: { clerkId } })
        if (!user) {
            return NextResponse.json({ error: { message: "User not found" } }, { status: 401 })
        }

        const { id } = await ctx.params
        const body = await req.json()
        const { type, tone } = generateReplySchema.parse(body)

        // Atomically check and increment AI usage to prevent race conditions
        const limit = PLAN_LIMITS[user.plan].aiGenerationsPerMonth
        const updatedUser = await prisma.user.updateMany({
            where: {
                id: user.id,
                aiCreditsUsedThisMonth: { lt: limit },
            },
            data: { aiCreditsUsedThisMonth: { increment: 1 } },
        })

        if (updatedUser.count === 0) {
            return NextResponse.json(
                { error: { message: "AI generation limit reached. Upgrade your plan." } },
                { status: 403 }
            )
        }

        const lead = await prisma.lead.findUnique({
            where: { id },
            include: { product: true, subreddit: true },
        })

        if (!lead) {
            return NextResponse.json({ error: { message: "Lead not found" } }, { status: 404 })
        }
        if (lead.product.userId !== user.id) {
            return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 })
        }

        const product = {
            name: lead.product.name,
            description: lead.product.description,
            keywords: lead.product.keywords,
            targetAudience: lead.product.targetAudience || undefined,
        }

        const leadContext = {
            title: lead.title || undefined,
            body: lead.body,
            subreddit: lead.subreddit?.name ?? "hackernews",
            author: lead.author,
            redditScore: lead.redditScore,
            commentCount: lead.commentCount,
        }

        let systemPrompt: string
        let userMessage: string

        switch (type) {
            case "reply":
                systemPrompt = "You are an expert at writing authentic, helpful Reddit replies that naturally mention relevant products."
                userMessage = getReplyGenerationPrompt(leadContext, product, tone)
                break
            case "conversation_starter":
                systemPrompt = "You are an expert at crafting multiple conversation approaches for Reddit engagement. Always respond with valid JSON."
                userMessage = getConversationStarterPrompt(leadContext, product)
                break
            case "dm_template":
                systemPrompt = "You are an expert at writing friendly, non-spammy Reddit DMs that start genuine conversations."
                userMessage = getDMTemplatePrompt(leadContext, product)
                break
        }

        // Update lead status and create engagement record
        const engagementType = ENGAGEMENT_TYPE_MAP[type]

        await Promise.all([
            prisma.lead.update({
                where: { id },
                data: { status: "ENGAGED" },
            }),
            prisma.engagement.create({
                data: {
                    userId: user.id,
                    leadId: id,
                    type: engagementType,
                    generatedContent: "", // Placeholder — will be updated by client
                },
            }),
        ])

        return createStreamingResponse(MODELS.REPLY_GENERATION, systemPrompt, userMessage)
    } catch (error) {
        logger.error("Engage route error", error)
        return NextResponse.json(
            { error: { message: "Something went wrong" } },
            { status: 500 }
        )
    }
}
