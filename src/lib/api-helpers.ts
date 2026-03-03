import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"

export class ApiError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message)
        this.name = "ApiError"
    }
}

export function withErrorHandler(
    handler: (req: NextRequest, ctx?: { params: Promise<Record<string, string>> }) => Promise<NextResponse>
) {
    return async (req: NextRequest, ctx?: { params: Promise<Record<string, string>> }) => {
        try {
            return await handler(req, ctx)
        } catch (error) {
            if (error instanceof ApiError) {
                return NextResponse.json(
                    { error: { code: error.statusCode.toString(), message: error.message } },
                    { status: error.statusCode }
                )
            }
            if (error instanceof ZodError) {
                return NextResponse.json(
                    {
                        error: {
                            code: "VALIDATION_ERROR",
                            message: "Invalid request",
                            details: error.flatten(),
                        },
                    },
                    { status: 400 }
                )
            }
            console.error("Unhandled API error:", error)
            return NextResponse.json(
                { error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
                { status: 500 }
            )
        }
    }
}

export function successResponse<T>(data: T, meta?: Record<string, unknown>) {
    return NextResponse.json({ data, ...(meta ? { meta } : {}) })
}
