import { NextRequest } from "next/server"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-helpers"
import { requirePlan, checkPlanLimit } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { checkRateLimit } from "@/lib/rate-limit"
import { z } from "zod"

const inviteSchema = z.object({
    email: z.string().email(),
    role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
})

export const GET = withErrorHandler(async () => {
    const user = await requirePlan("TEAM")

    const members = await prisma.teamMember.findMany({
        where: { teamOwnerId: user.id },
        include: {
            user: {
                select: { id: true, email: true, displayName: true, avatarUrl: true },
            },
        },
        orderBy: { createdAt: "desc" },
    })

    return successResponse(members)
})

export const POST = withErrorHandler(async (req: NextRequest) => {
    const user = await requirePlan("TEAM")

    // Rate limit invite attempts to prevent email enumeration
    const rl = checkRateLimit(`team-invite:${user.id}`, 10, 60_000)
    if (!rl.allowed) {
        throw new ApiError(429, "Too many invite attempts. Please wait before trying again.")
    }

    const body = await req.json()
    const data = inviteSchema.parse(body)

    // Check team member limit
    const currentCount = await prisma.teamMember.count({
        where: { teamOwnerId: user.id },
    })
    checkPlanLimit(user.plan, "teamMembers", currentCount)

    // Find user by email — return generic error to prevent enumeration
    const invitee = await prisma.user.findUnique({
        where: { email: data.email },
    })
    if (!invitee) {
        throw new ApiError(400, "Unable to invite this user. Ensure they have a RedProwler account.")
    }
    if (invitee.id === user.id) {
        throw new ApiError(400, "You can't invite yourself")
    }

    const existing = await prisma.teamMember.findUnique({
        where: {
            userId_teamOwnerId: {
                userId: invitee.id,
                teamOwnerId: user.id,
            },
        },
    })
    if (existing) throw new ApiError(400, "Unable to invite this user. Ensure they have a RedProwler account.")

    const member = await prisma.teamMember.create({
        data: {
            userId: invitee.id,
            teamOwnerId: user.id,
            role: data.role,
        },
        include: {
            user: {
                select: { id: true, email: true, displayName: true, avatarUrl: true },
            },
        },
    })

    return successResponse(member)
})
