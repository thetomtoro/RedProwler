# RedProwler

Reddit lead discovery for founders. RedProwler scans target subreddits on a schedule, finds conversations where someone is actively looking for a product like yours, scores them with a two-phase AI pipeline, and drafts a reply you can post.

Live at [redprowler.com](https://redprowler.com).

## How scoring works

Sending every scraped post to an LLM is slow and expensive, so scoring happens in two phases:

1. **Keyword pre-score.** A fast lexical pass rates each post 0 to 0.5 against the product's keyword profile. Posts below a threshold never reach the model. This cut API spend roughly in half with no measurable recall loss.
2. **Claude semantic scoring.** Surviving posts go to Claude with the product context. The response is parsed with strict JSON extraction, clamped to the valid 0 to 1 range, and retried with exponential backoff on transient failures. If the API is unavailable, the pipeline falls back to the pre-score instead of failing the run.

The design goal is that a model hiccup degrades quality gracefully rather than crashing a scan or letting a malformed response into the database.

## Features

- Scheduled subreddit scans with per-product keyword profiles
- Two-phase lead scoring (above)
- Reply drafting with Claude, tailored to the thread and the product
- Competitor mention monitoring
- Analytics: leads found, engagement, per-subreddit performance
- Stripe billing with subscription lifecycle handling (past-due access revocation, webhook-driven state)

## Stack

Next.js (App Router), TypeScript, Prisma, PostgreSQL, Redis, Claude API, Stripe. Deployed on Vercel.

## Development

```bash
npm install
cp .env.example .env   # fill in database, Reddit, Anthropic, Stripe keys
npx prisma migrate dev
npm run dev
```

Scoring logic lives in `src/lib/scoring.ts`, the Claude client with retry/backoff in `src/lib/ai.ts`, and prompts in `src/lib/prompts.ts`.
