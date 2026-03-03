import { timingSafeEqual } from "crypto"
import { NextRequest, NextResponse } from "next/server"

/**
 * Verify the cron secret using timing-safe comparison
 * to prevent timing attacks.
 */
export function verifyCronAuth(req: NextRequest): NextResponse | null {
    const cronSecret = process.env.CRON_SECRET
    const authHeader = req.headers.get("authorization")

    if (!cronSecret || !authHeader) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const expected = `Bearer ${cronSecret}`

    // Length check first (timingSafeEqual requires equal lengths)
    if (authHeader.length !== expected.length) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const isValid = timingSafeEqual(
        Buffer.from(authHeader),
        Buffer.from(expected)
    )

    if (!isValid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return null // Auth passed
}
