import { z } from "zod"

const envSchema = z.object({
    // App
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

    // Database
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SECRET: z.string().min(1),

    // Reddit
    REDDIT_CLIENT_ID: z.string().min(1, "REDDIT_CLIENT_ID is required"),
    REDDIT_CLIENT_SECRET: z.string().min(1, "REDDIT_CLIENT_SECRET is required"),
    REDDIT_USER_AGENT: z.string().default("RedProwler/1.0"),

    // Anthropic
    ANTHROPIC_API_KEY: z.string().min(1, "ANTHROPIC_API_KEY is required"),

    // Stripe
    STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
    STRIPE_WEBHOOK_SECRET: z.string().min(1, "STRIPE_WEBHOOK_SECRET is required"),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
    STRIPE_PRO_PRICE_ID: z.string().min(1, "STRIPE_PRO_PRICE_ID is required"),
    STRIPE_TEAM_PRICE_ID: z.string().min(1, "STRIPE_TEAM_PRICE_ID is required"),

    // Cron
    CRON_SECRET: z.string().min(32, "CRON_SECRET must be at least 32 characters"),
})

// Lazily validated — call getEnv() to access validated env vars.
// This avoids crashing at import time during builds where env vars may not be set.
let _env: z.infer<typeof envSchema> | null = null

export function getEnv() {
    if (!_env) {
        _env = envSchema.parse(process.env)
    }
    return _env
}

// For cases where you only need a single var and want a clear error
export function requireEnv(key: string): string {
    const val = process.env[key]
    if (!val) {
        throw new Error(`Missing required environment variable: ${key}`)
    }
    return val
}
