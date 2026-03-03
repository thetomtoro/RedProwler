import { Webhook } from "svix"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

interface WebhookEvent {
    type: string
    data: {
        id: string
        email_addresses: Array<{ email_address: string }>
        first_name: string | null
        last_name: string | null
        image_url: string | null
    }
}

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error("CLERK_WEBHOOK_SECRET is not set")
    }

    const headerPayload = await headers()
    const svixId = headerPayload.get("svix-id")
    const svixTimestamp = headerPayload.get("svix-timestamp")
    const svixSignature = headerPayload.get("svix-signature")

    if (!svixId || !svixTimestamp || !svixSignature) {
        return NextResponse.json({ error: "Missing svix headers" }, { status: 400 })
    }

    const payload = await req.json()
    const body = JSON.stringify(payload)

    const wh = new Webhook(WEBHOOK_SECRET)
    let event: WebhookEvent

    try {
        event = wh.verify(body, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
        }) as WebhookEvent
    } catch {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const { type, data } = event

    if (type === "user.created" || type === "user.updated") {
        const email = data.email_addresses[0]?.email_address
        const displayName = [data.first_name, data.last_name].filter(Boolean).join(" ") || email?.split("@")[0] || "User"

        if (!email) {
            return NextResponse.json({ error: "No email found" }, { status: 400 })
        }

        await prisma.user.upsert({
            where: { clerkId: data.id },
            update: {
                email,
                displayName,
                avatarUrl: data.image_url,
            },
            create: {
                clerkId: data.id,
                email,
                displayName,
                avatarUrl: data.image_url,
            },
        })
    }

    if (type === "user.deleted") {
        await prisma.user.deleteMany({
            where: { clerkId: data.id },
        })
    }

    return NextResponse.json({ received: true })
}
