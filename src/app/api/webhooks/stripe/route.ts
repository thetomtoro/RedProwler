import { NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import type { PlanTier } from "@/generated/prisma/client"

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
                const subscription = await getStripe().subscriptions.retrieve(subscriptionId)
                const priceId = subscription.items.data[0]?.price.id

                let plan: PlanTier = "PRO"
                if (priceId === process.env.STRIPE_TEAM_PRICE_ID) {
                    plan = "TEAM"
                }

                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        plan,
                        stripeSubscriptionId: subscriptionId,
                        stripeCustomerId: session.customer as string,
                        planExpiresAt: new Date((subscription.current_period_end ?? Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60) * 1000),
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

            if (user) {
                const priceId = subscription.items.data[0]?.price.id
                let plan: PlanTier = "PRO"
                if (priceId === process.env.STRIPE_TEAM_PRICE_ID) {
                    plan = "TEAM"
                }

                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        plan,
                        planExpiresAt: new Date((subscription.current_period_end ?? Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60) * 1000),
                    },
                })
            }
            break
        }

        case "customer.subscription.deleted": {
            const subscription = event.data.object
            const customerId = subscription.customer as string

            await prisma.user.updateMany({
                where: { stripeCustomerId: customerId },
                data: {
                    plan: "FREE",
                    stripeSubscriptionId: null,
                    planExpiresAt: null,
                },
            })
            break
        }
    }

    return NextResponse.json({ received: true })
}
