import { ApiError } from "@/lib/api-helpers"
import { logger } from "@/lib/logger"
import { requirePlan, checkPlanLimit } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const user = await requirePlan("PRO")
        checkPlanLimit(user.plan, "csvExport", 0)

        const productId = req.nextUrl.searchParams.get("productId")

        // Always scope to user's own products to prevent IDOR
        const userProducts = await prisma.product.findMany({
            where: { userId: user.id },
            select: { id: true },
        })
        const userProductIds = new Set(userProducts.map((p) => p.id))

        let productIds: string[]
        if (productId) {
            if (!userProductIds.has(productId)) {
                return NextResponse.json(
                    { error: { code: "403", message: "Forbidden" } },
                    { status: 403 }
                )
            }
            productIds = [productId]
        } else {
            productIds = [...userProductIds]
        }

        if (productIds.length === 0) {
            return NextResponse.json(
                { error: { code: "400", message: "No products found" } },
                { status: 400 }
            )
        }

        const leads = await prisma.lead.findMany({
            where: { productId: { in: productIds } },
            include: {
                subreddit: { select: { name: true } },
                product: { select: { name: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 5000,
        })

        const headers = [
            "ID", "Product", "Subreddit", "Title", "Author", "Relevance Score",
            "Status", "Sentiment", "Reddit Score", "Comments", "Permalink", "Created At",
        ]

        // Sanitize CSV values to prevent formula injection (=, +, -, @, \t, \r)
        const sanitizeCsvValue = (val: string | number): string => {
            const str = String(val).replace(/"/g, '""')
            if (/^[=+\-@\t\r]/.test(str)) {
                return `'${str}`
            }
            return str
        }

        const rows = leads.map((l) => [
            l.id,
            l.product.name,
            `r/${l.subreddit?.name ?? "hackernews"}`,
            l.title || "",
            l.author,
            l.relevanceScore.toFixed(2),
            l.status,
            l.sentiment,
            l.redditScore,
            l.commentCount,
            `https://reddit.com${l.permalink}`,
            l.createdAt.toISOString(),
        ])

        const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${sanitizeCsvValue(v)}"`).join(","))].join("\n")

        return new Response(csv, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="redprowler-leads-${new Date().toISOString().split("T")[0]}.csv"`,
            },
        })
    } catch (error) {
        if (error instanceof ApiError) {
            return NextResponse.json(
                { error: { code: error.statusCode.toString(), message: error.message } },
                { status: error.statusCode }
            )
        }
        logger.error("Export error", error)
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Export failed" } },
            { status: 500 }
        )
    }
}
