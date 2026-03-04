import { NextRequest } from "next/server"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-helpers"
import { requireAuth } from "@/lib/auth-helpers"
import { STRIPE_PLANS, createCheckoutSession } from "@/lib/stripe"
import { checkRateLimit } from "@/lib/rate-limit"
import { z } from "zod"

const checkoutSchema = z.object({
    plan: z.enum(["PRO", "TEAM"]),
})

export const POST = withErrorHandler(async (req: NextRequest) => {
    const user = await requireAuth()

    // Rate limit: 5 checkout sessions per minute per user
    const rl = checkRateLimit(`checkout:${user.id}`, 5, 60_000)
    if (!rl.allowed) {
        throw new ApiError(429, "Too many requests. Please wait before trying again.")
    }

    const body = await req.json()
    const { plan } = checkoutSchema.parse(body)

    const priceId = STRIPE_PLANS[plan]
    if (!priceId) throw new ApiError(400, "Invalid plan")

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // Reuse existing Stripe customer ID to avoid duplicates on re-subscribe
    const session = await createCheckoutSession({
        customerId: user.stripeCustomerId ?? undefined,
        customerEmail: user.stripeCustomerId ? undefined : user.email,
        priceId,
        userId: user.id,
        successUrl: `${appUrl}/settings?upgraded=true`,
        cancelUrl: `${appUrl}/settings`,
    })

    return successResponse({ url: session.url })
})
