import { ApiError } from "@/lib/api-helpers"
import { requirePlan, checkPlanLimit } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const user = await requirePlan("PRO")
        checkPlanLimit(user.plan, "csvExport", 0)

        const productId = req.nextUrl.searchParams.get("productId")

        const productIds = productId
            ? [productId]
            : (await prisma.product.findMany({
                where: { userId: user.id },
                select: { id: true },
            })).map((p) => p.id)

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

        const rows = leads.map((l) => [
            l.id,
            l.product.name,
            `r/${l.subreddit.name}`,
            (l.title || "").replace(/"/g, '""'),
            l.author,
            l.relevanceScore.toFixed(2),
            l.status,
            l.sentiment,
            l.redditScore,
            l.commentCount,
            `https://reddit.com${l.permalink}`,
            l.createdAt.toISOString(),
        ])

        const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n")

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
        console.error("Export error:", error)
        return NextResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Export failed" } },
            { status: 500 }
        )
    }
}
