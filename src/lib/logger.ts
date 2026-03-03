/**
 * Structured logger with PII redaction.
 *
 * Logs JSON objects in production for machine parsing.
 * Strips sensitive fields to prevent accidental PII leaks.
 */

const SENSITIVE_KEYS = new Set([
    "password",
    "secret",
    "token",
    "authorization",
    "cookie",
    "stripeCustomerId",
    "stripeSubscriptionId",
    "slackWebhookUrl",
    "email",
    "apiKey",
    "api_key",
    "accessToken",
    "access_token",
    "creditCard",
])

function redact(obj: unknown, depth = 0): unknown {
    if (depth > 5) return "[nested]"
    if (obj === null || obj === undefined) return obj
    if (typeof obj === "string") return obj
    if (typeof obj === "number" || typeof obj === "boolean") return obj

    if (obj instanceof Error) {
        return {
            name: obj.name,
            message: obj.message,
            // Only include stack in non-production
            ...(process.env.NODE_ENV !== "production" ? { stack: obj.stack } : {}),
        }
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => redact(item, depth + 1))
    }

    if (typeof obj === "object") {
        const result: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
            if (SENSITIVE_KEYS.has(key)) {
                result[key] = "[REDACTED]"
            } else {
                result[key] = redact(value, depth + 1)
            }
        }
        return result
    }

    return String(obj)
}

export const logger = {
    info(message: string, context?: Record<string, unknown>) {
        console.log(JSON.stringify({ level: "info", message, ...redact(context ?? {}) as object, timestamp: new Date().toISOString() }))
    },

    warn(message: string, context?: Record<string, unknown>) {
        console.warn(JSON.stringify({ level: "warn", message, ...redact(context ?? {}) as object, timestamp: new Date().toISOString() }))
    },

    error(message: string, error?: unknown, context?: Record<string, unknown>) {
        console.error(JSON.stringify({
            level: "error",
            message,
            error: redact(error),
            ...redact(context ?? {}) as object,
            timestamp: new Date().toISOString(),
        }))
    },
}
