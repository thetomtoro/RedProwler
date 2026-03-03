# Hacker News Monitoring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Hacker News as a second lead source, reusing the existing Product keywords and two-phase scoring pipeline.

**Architecture:** Separate HN cron job using the free HN Algolia Search API. New `HackerNewsClient` class mirrors `RedditClient` pattern. Leads stored with `platform: HACKER_NEWS` and `subredditId: null`. Shared plan limits, same notifications.

**Tech Stack:** HN Algolia API (free, no auth), existing Prisma/scoring/notification stack.

---

### Task 1: HN API Client

**Files:**
- Create: `src/lib/hackernews.ts`

**Step 1: Create the HN client**

```typescript
// src/lib/hackernews.ts

export interface HNStory {
    objectID: string
    title: string
    story_text: string | null
    url: string | null
    author: string
    points: number
    num_comments: number
    created_at_i: number
    _tags: string[]
}

interface HNSearchResponse {
    hits: HNStory[]
    nbHits: number
    page: number
    nbPages: number
}

const HN_API_BASE = "https://hn.algolia.com/api/v1"

class HackerNewsClient {
    async searchStories(query: string, limit = 20): Promise<HNStory[]> {
        const params = new URLSearchParams({
            query,
            tags: "story",
            hitsPerPage: limit.toString(),
        })

        const response = await fetch(`${HN_API_BASE}/search_by_date?${params}`)
        if (!response.ok) {
            throw new Error(`HN API error: ${response.status}`)
        }

        const data: HNSearchResponse = await response.json()
        return data.hits
    }

    async searchAskHN(query: string, limit = 20): Promise<HNStory[]> {
        const params = new URLSearchParams({
            query,
            tags: "ask_hn",
            hitsPerPage: limit.toString(),
        })

        const response = await fetch(`${HN_API_BASE}/search_by_date?${params}`)
        if (!response.ok) {
            throw new Error(`HN API error: ${response.status}`)
        }

        const data: HNSearchResponse = await response.json()
        return data.hits
    }
}

export const hnClient = new HackerNewsClient()
```

**Step 2: Verify it compiles**

Run: `cd /Users/tommyong/Documents/RedProwler && npx tsc --noEmit src/lib/hackernews.ts`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/hackernews.ts
git commit -m "Add Hacker News Algolia API client"
```

---

### Task 2: Update Scoring for Platform-Agnostic Input

**Files:**
- Modify: `src/lib/scoring.ts`
- Modify: `src/lib/prompts.ts`

**Step 1: Make ScoringInput platform-agnostic**

In `src/lib/scoring.ts`, change the `ScoringInput` interface and `keywordPreScore` function:

```typescript
// src/lib/scoring.ts — updated interface
interface ScoringInput {
    title?: string
    body: string
    subreddit: string       // For HN, pass "hackernews"
    author: string
    redditScore: number     // For HN, pass points
    commentCount: number
    platform?: "REDDIT" | "HACKER_NEWS"  // NEW
}
```

Update `keywordPreScore` to add Ask HN bonus:

```typescript
function keywordPreScore(post: ScoringInput, product: ProductInput): number {
    const text = `${post.title || ""} ${post.body}`.toLowerCase()
    let score = 0

    // Keyword matches
    for (const keyword of product.keywords) {
        if (text.includes(keyword.toLowerCase())) {
            score += 0.1
        }
    }

    // Intent phrase matches
    for (const phrase of INTENT_PHRASES) {
        if (text.includes(phrase)) {
            score += 0.08
        }
    }

    // Question marks indicate seeking help
    if (text.includes("?")) {
        score += 0.05
    }

    // Higher score = more visibility
    if (post.redditScore > 10) score += 0.03
    if (post.redditScore > 50) score += 0.03

    // Comments indicate active discussion
    if (post.commentCount > 5) score += 0.02
    if (post.commentCount > 20) score += 0.03

    // Ask HN posts are inherently help-seeking
    if (post.platform === "HACKER_NEWS" && post.title?.toLowerCase().startsWith("ask hn")) {
        score += 0.05
    }

    return Math.min(score, 0.5)
}
```

**Step 2: Update the scoring prompt for platform awareness**

In `src/lib/prompts.ts`, update the `LeadContext` interface and `getLeadScoringPrompt`:

Add `platform` to `LeadContext`:

```typescript
interface LeadContext {
    title?: string
    body: string
    subreddit: string
    author: string
    redditScore: number
    commentCount: number
    platform?: string  // NEW
}
```

In `getLeadScoringPrompt`, change the "REDDIT POST" section to be platform-aware:

Replace:
```
REDDIT POST:
Subreddit: r/${lead.subreddit}
```

With:
```
${lead.platform === "HACKER_NEWS" ? "HACKER NEWS POST:" : "REDDIT POST:"}
${lead.platform === "HACKER_NEWS" ? "Source: Hacker News" : `Subreddit: r/${lead.subreddit}`}
```

Do the same for `getReplyGenerationPrompt`, `getConversationStarterPrompt`, and `getDMTemplatePrompt` — replace `Subreddit: r/${lead.subreddit}` with the conditional. For HN, the context line should read `Source: Hacker News` instead.

**Step 3: Verify it compiles**

Run: `cd /Users/tommyong/Documents/RedProwler && npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/lib/scoring.ts src/lib/prompts.ts
git commit -m "Make scoring and prompts platform-agnostic for HN support"
```

---

### Task 3: HN Cron Job

**Files:**
- Create: `src/app/api/cron/scan-hackernews/route.ts`

**Step 1: Create the cron route**

```typescript
// src/app/api/cron/scan-hackernews/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hnClient } from "@/lib/hackernews"
import { scoreLead } from "@/lib/scoring"
import { PLAN_LIMITS } from "@/constants"
import { resetUsageIfNeeded } from "@/lib/auth-helpers"
import { createNotification, sendSlackNotification, fireWebhooks } from "@/lib/notifications"
import type { PlanTier } from "@/generated/prisma/client"

export async function GET(req: NextRequest) {
    const cronSecret = process.env.CRON_SECRET
    const authHeader = req.headers.get("authorization")
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        // Load all products with keywords
        const products = await prisma.product.findMany({
            where: { keywords: { isEmpty: false } },
            include: { user: true },
        })

        let totalLeadsCreated = 0

        for (const product of products) {
            try {
                // Reset usage if new billing period
                await resetUsageIfNeeded(product.userId)
                const user = await prisma.user.findUnique({
                    where: { id: product.userId },
                })
                if (!user) continue

                const leadLimit = PLAN_LIMITS[user.plan as PlanTier].leadsPerMonth
                if (user.leadsUsedThisMonth >= leadLimit) continue

                // Search HN for each keyword (deduplicate across keywords)
                const seenIds = new Set<string>()
                const allStories = []

                for (const keyword of product.keywords.slice(0, 5)) {
                    const [stories, askHn] = await Promise.all([
                        hnClient.searchStories(keyword, 10),
                        hnClient.searchAskHN(keyword, 10),
                    ])
                    for (const story of [...stories, ...askHn]) {
                        if (!seenIds.has(story.objectID)) {
                            seenIds.add(story.objectID)
                            allStories.push(story)
                        }
                    }
                }

                for (const story of allStories) {
                    // Check if already exists
                    const hnId = `hn_${story.objectID}`
                    const existing = await prisma.lead.findUnique({
                        where: { redditId: hnId },
                    })
                    if (existing) continue

                    // Re-check limit (may have incremented)
                    const freshUser = await prisma.user.findUnique({
                        where: { id: user.id },
                    })
                    if (!freshUser || freshUser.leadsUsedThisMonth >= leadLimit) break

                    const result = await scoreLead(
                        {
                            title: story.title,
                            body: story.story_text || "",
                            subreddit: "hackernews",
                            author: story.author,
                            redditScore: story.points,
                            commentCount: story.num_comments,
                            platform: "HACKER_NEWS",
                        },
                        {
                            name: product.name,
                            description: product.description,
                            keywords: product.keywords,
                            targetAudience: product.targetAudience || undefined,
                        }
                    )

                    if (result.score >= 0.3) {
                        const lead = await prisma.lead.create({
                            data: {
                                productId: product.id,
                                subredditId: null,
                                redditId: hnId,
                                redditType: "POST",
                                title: story.title,
                                body: story.story_text || "",
                                author: story.author,
                                permalink: `https://news.ycombinator.com/item?id=${story.objectID}`,
                                redditScore: story.points,
                                commentCount: story.num_comments,
                                redditCreatedAt: new Date(story.created_at_i * 1000),
                                relevanceScore: result.score,
                                relevanceReason: result.reason,
                                intentSignals: result.intentSignals,
                                sentiment: result.sentiment,
                                platform: "HACKER_NEWS",
                            },
                        })

                        await prisma.user.update({
                            where: { id: user.id },
                            data: { leadsUsedThisMonth: { increment: 1 } },
                        })

                        totalLeadsCreated++

                        if (result.score >= 0.8) {
                            await createNotification({
                                recipientId: user.id,
                                type: "HIGH_RELEVANCE_LEAD",
                                title: "High-relevance lead on Hacker News",
                                body: story.title,
                                referenceId: lead.id,
                                referenceType: "Lead",
                            })

                            await sendSlackNotification(user.id, {
                                text: `🎯 High-relevance HN lead (${(result.score * 100).toFixed(0)}%): ${story.title}`,
                            })

                            await fireWebhooks(user.id, "lead.high_relevance", {
                                leadId: lead.id,
                                title: story.title,
                                platform: "HACKER_NEWS",
                                score: result.score,
                                permalink: `https://news.ycombinator.com/item?id=${story.objectID}`,
                            })
                        }
                    }
                }
            } catch (error) {
                console.error(`Error scanning HN for product ${product.name}:`, error)
            }
        }

        return NextResponse.json({
            success: true,
            leadsCreated: totalLeadsCreated,
        })
    } catch (error) {
        console.error("HN cron scan error:", error)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}
```

**Step 2: Verify it compiles**

Run: `cd /Users/tommyong/Documents/RedProwler && npx tsc --noEmit`
Expected: No errors (may need to check if `subredditId: null` is allowed — the Prisma schema has `subredditId String?` so nullable is fine)

**Step 3: Commit**

```bash
git add src/app/api/cron/scan-hackernews/route.ts
git commit -m "Add Hacker News scanning cron job"
```

---

### Task 4: Add Platform Filter to Leads API

**Files:**
- Modify: `src/lib/validators.ts`
- Modify: `src/app/api/leads/route.ts`

**Step 1: Add platform to lead filter schema**

In `src/lib/validators.ts`, add `platform` to `leadFilterSchema`:

```typescript
export const leadFilterSchema = z.object({
    productId: z.string().optional(),
    subredditId: z.string().optional(),
    platform: z.enum(["REDDIT", "HACKER_NEWS"]).optional(),  // NEW
    status: z.enum(["NEW", "VIEWED", "ENGAGED", "CONVERTED", "DISMISSED"]).optional(),
    minScore: z.coerce.number().min(0).max(1).optional(),
    cursor: z.string().optional(),
    limit: z.coerce.number().min(1).max(50).default(20),
})
```

**Step 2: Apply platform filter in leads API**

In `src/app/api/leads/route.ts`, add the platform filter to the `where` clause. After line 28 (`...(filters.minScore && { relevanceScore: { gte: filters.minScore } }),`), add:

```typescript
...(filters.platform && { platform: filters.platform }),
```

**Step 3: Verify it compiles**

Run: `cd /Users/tommyong/Documents/RedProwler && npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/lib/validators.ts src/app/api/leads/route.ts
git commit -m "Add platform filter to leads API"
```

---

### Task 5: Add Platform Breakdown to Analytics

**Files:**
- Modify: `src/app/api/analytics/route.ts`

**Step 1: Add platform groupBy query**

In `src/app/api/analytics/route.ts`, add a `platformCounts` query to the `Promise.all` block (after the subredditCounts query):

```typescript
prisma.lead.groupBy({
    by: ["platform"],
    where: { productId: { in: productIds } },
    _count: { id: true },
}),
```

Update the destructured result to include `platformCounts`:

```typescript
const [totalLeads, totalEngagements, conversions, statusCounts, subredditCounts, leadsOverTime, platformCounts] =
```

Add `platformBreakdown` to the response:

```typescript
platformBreakdown: platformCounts.map((p) => ({
    platform: p.platform,
    count: p._count.id,
})),
```

Also update the empty-state response to include `platformBreakdown: []`.

**Step 2: Verify it compiles**

Run: `cd /Users/tommyong/Documents/RedProwler && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/app/api/analytics/route.ts
git commit -m "Add platform breakdown to analytics API"
```

---

### Task 6: Update Leads List UI with Platform Badge and Filter

**Files:**
- Modify: `src/app/(main)/leads/page.tsx`

**Step 1: Add platform to Lead interface**

Add `platform` field to the `Lead` interface:

```typescript
interface Lead {
    id: string
    title?: string
    body: string
    author: string
    permalink: string
    redditScore: number
    commentCount: number
    relevanceScore: number
    relevanceReason?: string
    intentSignals: string[]
    sentiment: string
    status: string
    isBookmarked: boolean
    createdAt: string
    platform: string  // NEW
    subreddit: { name: string; displayName: string } | null  // nullable for HN leads
    product: { name: string }
    _count: { engagements: number }
}
```

**Step 2: Add PlatformBadge component**

Add after `StatusBadge`:

```typescript
function PlatformBadge({ platform }: { platform: string }) {
    if (platform === "HACKER_NEWS") {
        return <Badge variant="warning">HN</Badge>
    }
    return <Badge variant="accent">Reddit</Badge>
}
```

**Step 3: Add platform filter state and dropdown**

Add state at the top of `LeadsPage`:

```typescript
const [platformFilter, setPlatformFilter] = useState<string>("")
```

Update the query to include platform:

```typescript
const { data, isLoading } = useQuery({
    queryKey: ["leads", platformFilter],
    queryFn: async () => {
        const params = new URLSearchParams({ limit: "20" })
        if (platformFilter) params.set("platform", platformFilter)
        const res = await fetch(`/api/leads?${params}`)
        const json = await res.json()
        return json.data as Lead[]
    },
})
```

Add filter dropdown in the header section, after the subtitle `<p>`:

```tsx
<div className="flex gap-2">
    {["", "REDDIT", "HACKER_NEWS"].map((p) => (
        <button
            key={p}
            onClick={() => setPlatformFilter(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                platformFilter === p
                    ? "bg-accent-muted text-accent"
                    : "bg-bg-tertiary text-text-secondary hover:text-text-primary"
            }`}
        >
            {p === "" ? "All" : p === "REDDIT" ? "Reddit" : "Hacker News"}
        </button>
    ))}
</div>
```

**Step 4: Update lead card to show platform badge and handle HN links**

In the lead card, replace `<span className="text-xs text-text-tertiary">r/{lead.subreddit.name}</span>` with:

```tsx
<span className="text-xs text-text-tertiary">
    {lead.platform === "HACKER_NEWS" ? "Hacker News" : `r/${lead.subreddit?.name}`}
</span>
<PlatformBadge platform={lead.platform} />
```

Update the "View on Reddit" external link to handle HN:

```tsx
<a
    href={lead.platform === "HACKER_NEWS" ? lead.permalink : `https://reddit.com${lead.permalink}`}
    target="_blank"
    rel="noopener noreferrer"
>
```

Update the subtitle text to:

```
Discovered leads from your targeted subreddits and Hacker News.
```

Add `useState` to the imports if not already there.

**Step 5: Verify it compiles**

Run: `cd /Users/tommyong/Documents/RedProwler && npx tsc --noEmit`
Expected: No errors

**Step 6: Commit**

```bash
git add src/app/(main)/leads/page.tsx
git commit -m "Add platform badge, filter, and HN support to leads list"
```

---

### Task 7: Update Lead Detail Page for HN

**Files:**
- Modify: `src/app/(main)/leads/[id]/page.tsx`

**Step 1: Add platform to Lead interface**

Add `platform: string` to the `Lead` interface. Make `subreddit` nullable:

```typescript
subreddit: { name: string; displayName: string } | null  // nullable for HN
platform: string  // NEW
```

**Step 2: Update header source tag**

Replace `<span className="text-sm text-text-tertiary">r/{lead.subreddit.name}</span>` with:

```tsx
<span className="text-sm text-text-tertiary">
    {lead.platform === "HACKER_NEWS" ? "Hacker News" : `r/${lead.subreddit?.name}`}
</span>
```

**Step 3: Update "View on Reddit" button**

Replace the existing anchor wrapping "View on Reddit":

```tsx
<a
    href={lead.platform === "HACKER_NEWS" ? lead.permalink : `https://reddit.com${lead.permalink}`}
    target="_blank"
    rel="noopener noreferrer"
>
    <Button variant="secondary" size="sm">
        <ExternalLink className="w-3.5 h-3.5" />
        {lead.platform === "HACKER_NEWS" ? "View on HN" : "View on Reddit"}
    </Button>
</a>
```

**Step 4: Verify it compiles**

Run: `cd /Users/tommyong/Documents/RedProwler && npx tsc --noEmit`
Expected: No errors

**Step 5: Commit**

```bash
git add "src/app/(main)/leads/[id]/page.tsx"
git commit -m "Update lead detail page for Hacker News leads"
```

---

### Task 8: Update Dashboard Copy

**Files:**
- Modify: `src/app/(main)/dashboard/page.tsx`

**Step 1: Update dashboard subtitle**

Change the subtitle from:
```
Overview of your Reddit lead generation performance.
```
To:
```
Overview of your lead generation performance.
```

**Step 2: Update empty state text**

Change:
```
Add a product and target subreddits to start discovering leads.
```
To:
```
Add a product to start discovering leads from Reddit and Hacker News.
```

**Step 3: Update recent leads source display**

In the recent leads list, replace `r/{lead.subreddit.name}` with:

```tsx
{lead.subreddit ? `r/${lead.subreddit.name}` : "HN"}
```

Add `platform?: string` to the `Lead` interface in dashboard.

**Step 4: Commit**

```bash
git add src/app/(main)/dashboard/page.tsx
git commit -m "Update dashboard copy for multi-platform support"
```

---

### Task 9: Add HN Cron to Vercel Config

**Files:**
- Modify: `vercel.json`

**Step 1: Add HN cron schedule**

Update `vercel.json` to add the HN cron (run at 10am UTC, after Reddit at 8am and digest at 9am):

```json
{
  "crons": [
    {
      "path": "/api/cron/scan-reddit",
      "schedule": "0 8 * * *"
    },
    {
      "path": "/api/cron/daily-digest",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/scan-hackernews",
      "schedule": "0 10 * * *"
    }
  ]
}
```

**Step 2: Commit**

```bash
git add vercel.json
git commit -m "Add Hacker News cron schedule to Vercel config"
```

---

### Task 10: Full Build Verification and Deploy

**Step 1: Run full TypeScript check**

Run: `cd /Users/tommyong/Documents/RedProwler && npx tsc --noEmit`
Expected: No errors

**Step 2: Run build**

Run: `cd /Users/tommyong/Documents/RedProwler && npm run build`
Expected: Build succeeds

**Step 3: Push to GitHub**

```bash
git push origin main
```

**Step 4: Deploy to Vercel**

```bash
vercel --prod
```

Expected: Build and deploy succeeds, HN cron registered.
