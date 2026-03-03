import Stripe from "stripe"

let _stripe: Stripe | null = null

export function getStripe() {
    if (!_stripe) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("STRIPE_SECRET_KEY is not set")
        }
        _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: "2025-02-24.acacia",
        })
    }
    return _stripe
}

export const STRIPE_PLANS = {
    PRO: process.env.STRIPE_PRO_PRICE_ID || "",
    TEAM: process.env.STRIPE_TEAM_PRICE_ID || "",
} as const

export async function createCheckoutSession({
    customerId,
    priceId,
    userId,
    successUrl,
    cancelUrl,
}: {
    customerId?: string
    priceId: string
    userId: string
    successUrl: string
    cancelUrl: string
}) {
    return getStripe().checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        ...(customerId ? { customer: customerId } : {}),
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { userId },
    })
}

export async function createPortalSession(customerId: string, returnUrl: string) {
    return getStripe().billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
    })
}
