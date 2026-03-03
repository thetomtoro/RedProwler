import { withErrorHandler, successResponse, ApiError } from "@/lib/api-helpers"
import { requireAuth } from "@/lib/auth-helpers"
import { createPortalSession } from "@/lib/stripe"

export const POST = withErrorHandler(async () => {
    const user = await requireAuth()

    if (!user.stripeCustomerId) {
        throw new ApiError(400, "No billing account found. Subscribe to a plan first.")
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const session = await createPortalSession(
        user.stripeCustomerId,
        `${appUrl}/settings`
    )

    return successResponse({ url: session.url })
})
