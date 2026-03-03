import { z } from "zod"

export const createProductSchema = z.object({
    name: z.string().min(1).max(100),
    url: z.string().url().optional().or(z.literal("")),
    description: z.string().min(10).max(5000),
    targetAudience: z.string().max(2000).optional(),
    keywords: z.array(z.string().max(50)).max(20),
})

export const updateProductSchema = createProductSchema.partial()

export const addSubredditSchema = z.object({
    name: z.string().min(1).max(50),
    source: z.enum(["AI_RECOMMENDED", "USER_ADDED"]).default("USER_ADDED"),
})

export const generateReplySchema = z.object({
    type: z.enum(["reply", "conversation_starter", "dm_template"]),
    tone: z.string().default("helpful"),
})

export const addCompetitorSchema = z.object({
    name: z.string().min(1).max(100),
    keywords: z.array(z.string().max(50)).min(1).max(10),
})

export const leadFilterSchema = z.object({
    productId: z.string().optional(),
    subredditId: z.string().optional(),
    platform: z.enum(["REDDIT", "HACKER_NEWS"]).optional(),
    status: z.enum(["NEW", "VIEWED", "ENGAGED", "CONVERTED", "DISMISSED"]).optional(),
    minScore: z.coerce.number().min(0).max(1).optional(),
    cursor: z.string().optional(),
    limit: z.coerce.number().min(1).max(50).default(20),
})
