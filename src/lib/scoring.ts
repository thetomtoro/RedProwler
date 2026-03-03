import { createMessage } from "@/lib/ai"
import { logger } from "@/lib/logger"
import { getLeadScoringPrompt } from "@/lib/prompts"
import { MODELS } from "@/constants"

interface ScoringInput {
    title?: string
    body: string
    subreddit: string
    author: string
    redditScore: number
    commentCount: number
    platform?: "REDDIT" | "HACKER_NEWS"
}

interface ProductInput {
    name: string
    description: string
    keywords: string[]
    targetAudience?: string
}

interface ScoringOutput {
    score: number
    reason: string
    intentSignals: string[]
    sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE" | "QUESTION"
}

const INTENT_PHRASES = [
    "looking for",
    "any suggestions",
    "recommend",
    "best tool",
    "alternative to",
    "anyone tried",
    "help me find",
    "what do you use",
    "how do you",
    "need a solution",
    "struggling with",
    "frustrated with",
    "is there a",
    "does anyone know",
    "what's the best",
    "switch from",
    "comparison",
    "vs",
    "worth it",
    "review of",
]

function keywordPreScore(post: ScoringInput, product: ProductInput): number {
    const text = `${post.title || ""} ${post.body}`.toLowerCase()
    let score = 0

    // Keyword matches
    for (const keyword of product.keywords) {
        if (text.includes(keyword.toLowerCase())) {
            score += 0.1
        }
    }

    // Intent phrase matches
    for (const phrase of INTENT_PHRASES) {
        if (text.includes(phrase)) {
            score += 0.08
        }
    }

    // Question marks indicate seeking help
    if (text.includes("?")) {
        score += 0.05
    }

    // Higher Reddit score = more visibility
    if (post.redditScore > 10) score += 0.03
    if (post.redditScore > 50) score += 0.03

    // Comments indicate active discussion
    if (post.commentCount > 5) score += 0.02
    if (post.commentCount > 20) score += 0.03

    // Ask HN posts are inherently help-seeking
    if (post.platform === "HACKER_NEWS" && post.title?.toLowerCase().startsWith("ask hn")) {
        score += 0.05
    }

    return Math.min(score, 0.5)
}

export async function scoreLead(
    post: ScoringInput,
    product: ProductInput
): Promise<ScoringOutput> {
    // Phase 1: Fast keyword pre-filter
    const preScore = keywordPreScore(post, product)

    if (preScore < 0.2) {
        return {
            score: preScore,
            reason: "Low keyword relevance",
            intentSignals: [],
            sentiment: "NEUTRAL",
        }
    }

    // Phase 2: AI scoring (only for pre-score >= 0.2)
    try {
        const prompt = getLeadScoringPrompt(
            {
                title: post.title,
                body: post.body,
                subreddit: post.subreddit,
                author: post.author,
                redditScore: post.redditScore,
                commentCount: post.commentCount,
                platform: post.platform,
            },
            {
                name: product.name,
                description: product.description,
                keywords: product.keywords,
                targetAudience: product.targetAudience,
            }
        )

        const response = await createMessage(
            MODELS.LEAD_SCORING,
            "You are a lead scoring expert. Always respond with valid JSON.",
            prompt,
            512
        )

        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            return {
                score: Math.max(0, Math.min(1, parsed.score || 0)),
                reason: parsed.reason || "AI scored",
                intentSignals: parsed.intentSignals || [],
                sentiment: parsed.sentiment || "NEUTRAL",
            }
        }
    } catch (error) {
        logger.error("AI scoring failed, falling back to pre-score", error)
    }

    return {
        score: preScore,
        reason: "Keyword match (AI scoring unavailable)",
        intentSignals: [],
        sentiment: "NEUTRAL",
    }
}
