import Stripe from "stripe"

// Lazy singleton — builds succeed even without STRIPE_SECRET_KEY set
let _stripe: Stripe | undefined
export const stripe = new Proxy({} as Stripe, {
    get(_target, prop, receiver) {
        if (!_stripe) {
            _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
                apiVersion: "2025-02-24.acacia",
            })
        }
        const value = Reflect.get(_stripe, prop, receiver)
        return typeof value === "function" ? value.bind(_stripe) : value
    },
})

// Keep getStripe() for backward compatibility
export function getStripe(): Stripe {
    return stripe
}

export const STRIPE_PLANS = {
    PRO: process.env.STRIPE_PRO_PRICE_ID || "",
    TEAM: process.env.STRIPE_TEAM_PRICE_ID || "",
} as const

export async function createCheckoutSession({
    customerId,
    customerEmail,
    priceId,
    userId,
    successUrl,
    cancelUrl,
}: {
    customerId?: string
    customerEmail?: string
    priceId: string
    userId: string
    successUrl: string
    cancelUrl: string
}) {
    return stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: { userId },
        success_url: successUrl,
        cancel_url: cancelUrl,
        // Reuse existing customer to avoid duplicates on re-subscribe
        ...(customerId
            ? { customer: customerId }
            : customerEmail
                ? { customer_email: customerEmail }
                : {}),
    })
}

export async function createPortalSession(customerId: string, returnUrl: string) {
    return stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
    })
}
