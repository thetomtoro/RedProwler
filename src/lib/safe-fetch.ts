/**
 * SSRF-safe fetch wrapper.
 *
 * Validates that the target URL resolves to a public IP address
 * and blocks redirects to prevent SSRF attacks.
 */

import { lookup } from "dns/promises"
import { logger } from "@/lib/logger"

const BLOCKED_HOSTNAMES = new Set([
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "[::1]",
    "[::]",
    "169.254.169.254",
    "metadata.google.internal",
])

/**
 * Check if an IP address is in a private/reserved range.
 */
function isPrivateIP(ip: string): boolean {
    // IPv6 check
    if (ip.includes(":")) {
        const lower = ip.toLowerCase()
        return (
            lower === "::1" ||
            lower === "::" ||
            lower.startsWith("fc") ||   // fc00::/7 — unique local
            lower.startsWith("fd") ||   // fc00::/7 — unique local
            lower.startsWith("fe80") || // fe80::/10 — link-local
            lower.startsWith("::ffff:127.") || // IPv4-mapped loopback
            lower.startsWith("::ffff:10.") ||
            lower.startsWith("::ffff:192.168.") ||
            lower.startsWith("::ffff:169.254.")
        )
    }

    // IPv4 check
    const parts = ip.split(".").map(Number)
    if (parts.length !== 4 || parts.some((p) => isNaN(p))) return true // Invalid = block

    const [a, b] = parts
    return (
        a === 0 ||                              // 0.0.0.0/8 — current network
        a === 10 ||                             // 10.0.0.0/8 — private
        a === 127 ||                            // 127.0.0.0/8 — loopback
        (a === 169 && b === 254) ||             // 169.254.0.0/16 — link-local
        (a === 172 && b >= 16 && b <= 31) ||    // 172.16.0.0/12 — private
        (a === 192 && b === 168) ||             // 192.168.0.0/16 — private
        (a === 100 && b >= 64 && b <= 127) ||   // 100.64.0.0/10 — CGNAT
        (a === 198 && (b === 18 || b === 19))   // 198.18.0.0/15 — benchmarking
    )
}

/**
 * Validate that a URL is safe to fetch (no SSRF).
 * Resolves DNS and checks the actual IP address.
 */
export async function validateWebhookUrl(url: string): Promise<{ valid: boolean; reason?: string }> {
    try {
        const parsed = new URL(url)

        if (parsed.protocol !== "https:") {
            return { valid: false, reason: "URL must use HTTPS" }
        }

        if (BLOCKED_HOSTNAMES.has(parsed.hostname)) {
            return { valid: false, reason: "Blocked hostname" }
        }

        // Check for userinfo in URL (potential bypass: https://hooks.slack.com@evil.com/)
        if (parsed.username || parsed.password) {
            return { valid: false, reason: "URLs with credentials are not allowed" }
        }

        // Resolve DNS and verify the actual IP
        try {
            const { address } = await lookup(parsed.hostname)
            if (isPrivateIP(address)) {
                return { valid: false, reason: "URL resolves to a private IP address" }
            }
        } catch {
            return { valid: false, reason: "Could not resolve hostname" }
        }

        return { valid: true }
    } catch {
        return { valid: false, reason: "Invalid URL" }
    }
}

/**
 * Fetch a webhook URL safely — blocks redirects and validates the target.
 */
export async function safeFetch(
    url: string,
    options: RequestInit & { signal?: AbortSignal }
): Promise<Response> {
    // Re-validate at delivery time to defeat DNS rebinding
    const validation = await validateWebhookUrl(url)
    if (!validation.valid) {
        throw new Error(`SSRF blocked: ${validation.reason}`)
    }

    const response = await fetch(url, {
        ...options,
        redirect: "error", // Block all redirects
    })

    return response
}

/**
 * Validate a Slack webhook URL specifically.
 */
export function isValidSlackUrl(url: string): boolean {
    try {
        const parsed = new URL(url)
        return (
            parsed.protocol === "https:" &&
            parsed.hostname === "hooks.slack.com" &&
            !parsed.username &&
            !parsed.password &&
            parsed.pathname.startsWith("/services/")
        )
    } catch {
        return false
    }
}
