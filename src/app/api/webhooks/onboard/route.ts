import { withErrorHandler, successResponse } from "@/lib/api-helpers"
import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export const POST = withErrorHandler(async () => {
    const user = await requireAuth()

    await prisma.user.update({
        where: { id: user.id },
        data: { onboarded: true },
    })

    return successResponse({ onboarded: true })
})
