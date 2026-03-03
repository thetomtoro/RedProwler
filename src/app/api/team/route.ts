import { NextRequest } from "next/server"
import { withErrorHandler, successResponse, ApiError } from "@/lib/api-helpers"
import { requirePlan, checkPlanLimit } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
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
    const body = await req.json()
    const data = inviteSchema.parse(body)

    // Check team member limit
    const currentCount = await prisma.teamMember.count({
        where: { teamOwnerId: user.id },
    })
    checkPlanLimit(user.plan, "teamMembers", currentCount)

    // Find user by email
    const invitee = await prisma.user.findUnique({
        where: { email: data.email },
    })
    if (!invitee) {
        throw new ApiError(404, "User not found. They need to sign up first.")
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
    if (existing) throw new ApiError(409, "User is already a team member")

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
