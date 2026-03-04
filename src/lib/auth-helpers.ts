import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { ApiError } from "@/lib/api-helpers"
import { PLAN_LIMITS } from "@/constants"
import type { PlanTier } from "@/generated/prisma/client"

export async function requireAuth() {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
        throw new ApiError(401, "Unauthorized")
    }

    // Try to find existing user
    let user = await prisma.user.findUnique({
        where: { clerkId },
    })

    // Auto-create user if they don't exist in DB yet
    // (handles cases where Clerk webhook hasn't fired, e.g. local dev)
    if (!user) {
        const clerkUser = await currentUser()
        const email = clerkUser?.emailAddresses[0]?.emailAddress
        if (!email) {
            throw new ApiError(401, "User not found")
        }
        const displayName =
            [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
            email.split("@")[0]

        user = await prisma.user.create({
            data: {
                clerkId,
                email,
                displayName,
                avatarUrl: clerkUser.imageUrl,
            },
        })
    }

    return user
}

export async function requireOwnership(resourceUserId: string) {
    const user = await requireAuth()
    if (user.id !== resourceUserId) {
        throw new ApiError(403, "Forbidden")
    }
    return user
}

export async function requirePlan(requiredPlan: PlanTier) {
    const user = await requireAuth()

    const planHierarchy: Record<PlanTier, number> = {
        FREE: 0,
        PRO: 1,
        TEAM: 2,
    }

    if (planHierarchy[user.plan] < planHierarchy[requiredPlan]) {
        throw new ApiError(403, `This feature requires the ${requiredPlan} plan or higher`)
    }

    // A paid user with past_due payments loses access
    if (user.plan !== "FREE" && user.subscriptionStatus !== "ACTIVE") {
        throw new ApiError(403, "Your subscription payment is past due. Please update your payment method to continue.")
    }

    return user
}

export function checkPlanLimit(
    plan: PlanTier,
    limitKey: keyof (typeof PLAN_LIMITS)["FREE"],
    currentUsage: number
) {
    const limit = PLAN_LIMITS[plan][limitKey]
    if (typeof limit === "number" && currentUsage >= limit) {
        throw new ApiError(
            403,
            `You've reached your ${String(limitKey)} limit. Upgrade your plan to continue.`
        )
    }
    if (typeof limit === "boolean" && !limit) {
        throw new ApiError(
            403,
            `This feature is not available on your current plan. Upgrade to access it.`
        )
    }
}

export async function resetUsageIfNeeded(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, usageResetAt: true },
    })
    if (!user) return

    const now = new Date()

    if (!user.usageResetAt || user.usageResetAt <= now) {
        const nextReset = new Date(Date.UTC(
            now.getUTCMonth() === 11 ? now.getUTCFullYear() + 1 : now.getUTCFullYear(),
            now.getUTCMonth() === 11 ? 0 : now.getUTCMonth() + 1,
            1, 0, 0, 0
        ))

        await prisma.user.update({
            where: { id: userId },
            data: {
                leadsUsedThisMonth: 0,
                aiCreditsUsedThisMonth: 0,
                usageResetAt: nextReset,
            },
        })
    }
}
