export const MODELS = {
    LEAD_SCORING: "claude-haiku-4-5-20251001",
    REPLY_GENERATION: "claude-sonnet-4-6",
    SUBREDDIT_RECOMMENDATION: "claude-sonnet-4-6",
    TEMPLATE_PERSONALIZATION: "claude-haiku-4-5-20251001",
    PRODUCT_DESCRIPTION: "claude-sonnet-4-6",
} as const

export const PLAN_LIMITS = {
    FREE: {
        productsLimit: 1,
        subredditsPerProduct: 3,
        leadsPerMonth: 50,
        aiGenerationsPerMonth: 20,
        competitorMonitoring: false,
        teamMembers: 1,
        slackIntegration: false,
        webhooks: false,
        csvExport: false,
    },
    PRO: {
        productsLimit: 5,
        subredditsPerProduct: 20,
        leadsPerMonth: 1000,
        aiGenerationsPerMonth: 500,
        competitorMonitoring: true,
        teamMembers: 1,
        slackIntegration: true,
        webhooks: true,
        csvExport: true,
    },
    TEAM: {
        productsLimit: 20,
        subredditsPerProduct: 50,
        leadsPerMonth: 5000,
        aiGenerationsPerMonth: 2000,
        competitorMonitoring: true,
        teamMembers: 10,
        slackIntegration: true,
        webhooks: true,
        csvExport: true,
    },
} as const

export const PRICING = {
    FREE: { price: 0, name: "Starter", description: "Get started for free" },
    PRO: { price: 29, name: "Pro", description: "For serious founders" },
    TEAM: { price: 79, name: "Team", description: "For growing teams" },
} as const

export const TEMPLATE_CATEGORIES = [
    "QUESTION",
    "STORY",
    "OPINION",
    "RECOMMENDATION",
    "PROBLEM_SOLUTION",
    "COMPARISON",
    "CASE_STUDY",
    "AMA",
    "DISCUSSION",
    "TUTORIAL",
] as const

export const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/products", label: "Products", icon: "Package" },
    { href: "/leads", label: "Leads", icon: "Target" },
    { href: "/templates", label: "Templates", icon: "FileText" },
    { href: "/analytics", label: "Analytics", icon: "BarChart3" },
    { href: "/competitors", label: "Competitors", icon: "Eye" },
    { href: "/settings", label: "Settings", icon: "Settings" },
] as const
