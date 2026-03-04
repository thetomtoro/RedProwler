import { NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import type { PlanTier, SubscriptionStatus } from "@/generated/prisma/client"
import Stripe from "stripe"

function resolvePlan(priceId: string | undefined): PlanTier | null {
    if (priceId === process.env.STRIPE_PRO_PRICE_ID) return "PRO"
    if (priceId === process.env.STRIPE_TEAM_PRICE_ID) return "TEAM"
    console.error(`Unknown Stripe price ID: ${priceId}`)
    return null
}

function mapStripeStatus(stripeStatus: string): { plan?: PlanTier; subscriptionStatus: SubscriptionStatus } {
    switch (stripeStatus) {
        case "active":
        case "trialing":
            return { subscriptionStatus: "ACTIVE" }
        case "past_due":
        case "unpaid":
            return { subscriptionStatus: "PAST_DUE" }
        case "canceled":
        case "incomplete_expired":
            return { plan: "FREE", subscriptionStatus: "CANCELED" }
        default:
            return { subscriptionStatus: "ACTIVE" }
    }
}

function getPeriodDates(subscription: Stripe.Subscription) {
    // Current API version: period dates on subscription root
    // Stripe v20 will move them to subscription.items.data[0]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sub = subscription as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const firstItem = subscription.items?.data?.[0] as any
    const periodStart = (firstItem?.current_period_start ?? sub.current_period_start) as number | undefined
    const periodEnd = (firstItem?.current_period_end ?? sub.current_period_end) as number | undefined

    return {
        currentPeriodStart: periodStart ? new Date(periodStart * 1000) : undefined,
        currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : undefined,
    }
}

export async function POST(req: NextRequest) {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    let event
    try {
        event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
    } catch {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object
            const userId = session.metadata?.userId
            const subscriptionId = session.subscription as string

            if (userId && subscriptionId) {
                const subscription = await getStripe().subscriptions.retrieve(subscriptionId, {
                    expand: ["items.data"],
                })
                const priceId = subscription.items.data[0]?.price.id
                const plan = resolvePlan(priceId)
                if (!plan) break

                const { currentPeriodStart, currentPeriodEnd } = getPeriodDates(subscription)

                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        plan,
                        subscriptionStatus: "ACTIVE",
                        stripeSubscriptionId: subscriptionId,
                        stripeCustomerId: session.customer as string,
                        currentPeriodStart,
                        currentPeriodEnd,
                    },
                })
            }
            break
        }

        case "customer.subscription.updated": {
            const subscription = event.data.object
            const customerId = subscription.customer as string

            const user = await prisma.user.findUnique({
                where: { stripeCustomerId: customerId },
            })
            if (!user) break

            const priceId = subscription.items.data[0]?.price.id
            const plan = resolvePlan(priceId)
            if (!plan) break

            const { plan: overridePlan, subscriptionStatus } = mapStripeStatus(subscription.status)
            const { currentPeriodStart, currentPeriodEnd } = getPeriodDates(subscription)

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    plan: overridePlan ?? plan,
                    subscriptionStatus,
                    currentPeriodStart,
                    currentPeriodEnd,
                },
            })
            break
        }

        case "customer.subscription.deleted": {
            const subscription = event.data.object
            const customerId = subscription.customer as string

            await prisma.user.updateMany({
                where: { stripeCustomerId: customerId },
                data: {
                    plan: "FREE",
                    subscriptionStatus: "CANCELED",
                    stripeSubscriptionId: null,
                    currentPeriodStart: null,
                    currentPeriodEnd: null,
                },
            })
            break
        }

        case "invoice.payment_failed": {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const invoice = event.data.object as any
            // v20: invoice.parent?.subscription_details?.subscription
            // pre-v20: invoice.subscription
            const stripeSubId = invoice.parent?.subscription_details?.subscription
                ?? invoice.subscription

            if (!stripeSubId) break

            const subId = typeof stripeSubId === "string" ? stripeSubId : (stripeSubId as { id: string }).id

            const user = await prisma.user.findUnique({
                where: { stripeSubscriptionId: subId },
            })
            if (!user) break

            await prisma.user.update({
                where: { id: user.id },
                data: { subscriptionStatus: "PAST_DUE" },
            })
            break
        }
    }

    return NextResponse.json({ received: true })
}
