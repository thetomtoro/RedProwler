import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { createStreamingResponse } from "@/lib/ai"
import { getReplyGenerationPrompt, getConversationStarterPrompt, getDMTemplatePrompt } from "@/lib/prompts"
import { generateReplySchema } from "@/lib/validators"
import { MODELS } from "@/constants"
import { PLAN_LIMITS } from "@/constants"

export async function POST(req: NextRequest, ctx: { params: Promise<Record<string, string>> }) {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) {
            return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { clerkId } })
        if (!user) {
            return NextResponse.json({ error: { message: "User not found" } }, { status: 401 })
        }

        const { id } = await ctx.params
        const body = await req.json()
        const { type, tone } = generateReplySchema.parse(body)

        // Check AI generation limit
        const limit = PLAN_LIMITS[user.plan].aiGenerationsPerMonth
        if (user.aiCreditsUsedThisMonth >= limit) {
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
            subreddit: lead.subreddit.name,
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

        // Increment AI usage
        await prisma.user.update({
            where: { id: user.id },
            data: { aiCreditsUsedThisMonth: { increment: 1 } },
        })

        // Update lead status
        await prisma.lead.update({
            where: { id },
            data: { status: "ENGAGED" },
        })

        return createStreamingResponse(MODELS.REPLY_GENERATION, systemPrompt, userMessage)
    } catch (error) {
        console.error("Engage route error:", error)
        return NextResponse.json(
            { error: { message: "Something went wrong" } },
            { status: 500 }
        )
    }
}
