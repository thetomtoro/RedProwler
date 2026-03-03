# Hacker News Monitoring — Design

## Summary

Add Hacker News as a second lead source alongside Reddit. HN leads use the same Product keywords, scoring pipeline, and shared plan limits. No pricing or schema changes required — the `Lead.platform` enum already supports `HACKER_NEWS`.

## Approach

Separate HN cron job (Approach A). Keeps Reddit pipeline untouched, avoids Vercel timeout risks, and mirrors the existing architecture.

## New Files

### `src/lib/hackernews.ts` — HN Algolia API Client

- Uses the free HN Algolia Search API (no auth, no rate limits)
- `searchStories(query, limit)` — `GET hn.algolia.com/api/v1/search_by_date?query={query}&tags=story&hitsPerPage={limit}`
- `searchAskHN(query, limit)` — `GET hn.algolia.com/api/v1/search_by_date?query={query}&tags=ask_hn&hitsPerPage={limit}`
- Normalizes HN response into a shape compatible with the scoring pipeline:
  - `id` → `hn_{objectID}`
  - `title` → story title
  - `body` → story_text or empty
  - `author` → HN username
  - `permalink` → `https://news.ycombinator.com/item?id={objectID}`
  - `score` → HN points
  - `commentCount` → num_comments
  - `createdAt` → created_at_i (unix timestamp)

### `src/app/api/cron/scan-hackernews/route.ts` — HN Cron Job

Flow mirrors `scan-reddit`:

1. Auth check (`CRON_SECRET`)
2. Load all Products with keywords
3. For each product, search HN stories + Ask HN posts for each keyword
4. Deduplicate by `redditId` field (stores `hn_{objectID}`)
5. Run through `scoreLead()` — same two-phase pipeline
6. Create Lead with `platform: HACKER_NEWS`, `subredditId: null`
7. Notifications for high-relevance leads (score >= 0.8)
8. Increment `leadsUsedThisMonth` (shared quota)

## Modified Files

### `src/lib/scoring.ts`

- `keywordPreScore`: Skip subreddit-specific logic when no subreddit provided
- Use HN `points` for engagement signals (same thresholds as redditScore)
- "Ask HN" title prefix gets +0.05 bonus (inherently help-seeking)

### `src/app/api/analytics/route.ts`

- Add `platformBreakdown` to response: `[{ platform: "REDDIT", count }, { platform: "HACKER_NEWS", count }]`

### `src/app/(main)/leads/page.tsx`

- Platform filter dropdown: All / Reddit / Hacker News
- Lead card shows platform badge (orange "HN" or blue "Reddit")

### `src/app/(main)/leads/[id]/page.tsx`

- "View on HN" link when `platform === HACKER_NEWS`
- Link format: `https://news.ycombinator.com/item?id={hnId}`

### `src/app/api/leads/route.ts`

- Accept `platform` query param for filtering

### `vercel.json`

- Add HN cron schedule (daily, offset from Reddit scan)

## What Stays the Same

- AI scoring (Phase 2) — identical prompts work for HN content
- Reply generation — same AI pipeline
- Notifications — same in-app, Slack, webhook flow
- Plan limits — shared quotas, no pricing changes
- Prisma schema — `platform` enum already has `HACKER_NEWS`
- Competitor monitoring — can extend to HN later
