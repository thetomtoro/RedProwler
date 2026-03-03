# RedProwler

AI-powered Reddit lead generation platform for founders and marketers. Discover high-intent conversations, generate personalized replies, and convert Reddit users into customers.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2d3748?logo=prisma&logoColor=white)

## What It Does

- **Lead Discovery** — Scans target subreddits on a cron schedule and surfaces posts where people are looking for solutions your product solves
- **AI Scoring** — Two-phase scoring pipeline: fast keyword pre-filter, then Claude Haiku for semantic relevance scoring (saves ~70% on AI costs)
- **Reply Generation** — Claude Sonnet generates natural, helpful replies tailored to each conversation and your product
- **Template Library** — 50+ viral Reddit reply templates across 10 categories, with AI personalization
- **Analytics Dashboard** — Track leads found, engagement rates, conversions, and subreddit performance over time
- **Competitor Monitoring** — Watch for competitor mentions and sentiment across subreddits
- **Multi-tier Plans** — Free tier for getting started, Pro for power users, Team for collaboration

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Auth | Clerk |
| Database | PostgreSQL (Neon) + Prisma 7 |
| AI | Anthropic Claude (Haiku + Sonnet) |
| State | Zustand 5 |
| Data Fetching | TanStack React Query 5 |
| Validation | Zod 4 |
| Payments | Stripe |
| Animations | Framer Motion |
| Charts | Recharts |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (recommend [Neon](https://neon.tech))
- [Clerk](https://clerk.com) account
- [Anthropic](https://console.anthropic.com) API key
- [Stripe](https://stripe.com) account (for billing)
- [Reddit API](https://www.reddit.com/prefs/apps) credentials

### Setup

1. **Clone the repo**

```bash
git clone https://github.com/thetomtoro/RedProwler.git
cd RedProwler
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env.local
```

Fill in your API keys in `.env.local` — see `.env.example` for all required variables.

4. **Set up the database**

```bash
npx prisma generate
npx prisma db push
```

5. **Seed templates** (optional)

```bash
npx prisma db seed
```

6. **Start the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Sign in, sign up, onboarding
│   ├── (main)/          # Dashboard, products, leads, templates, analytics, settings
│   ├── api/             # REST API routes + webhooks + cron jobs
│   ├── globals.css      # Tailwind v4 theme (dark-first)
│   └── layout.tsx       # Root layout with Clerk provider
├── components/
│   ├── ui/              # Button, Card, Badge, Input, Modal, etc.
│   ├── layout/          # Sidebar, Navbar, MobileNav
│   ├── landing/         # Hero, Features, Pricing, FAQ, etc.
│   └── ...              # Feature-specific components
├── lib/
│   ├── prisma.ts        # Database client
│   ├── ai.ts            # Anthropic SDK + streaming
│   ├── reddit.ts        # Reddit OAuth2 client
│   ├── scoring.ts       # Two-phase lead scoring
│   ├── stripe.ts        # Stripe helpers
│   └── validators.ts    # Zod schemas
├── constants/           # Plan limits, categories, model IDs
└── middleware.ts        # Clerk auth middleware
```

## Key Features

### Lead Discovery Pipeline

Runs on a cron schedule via Vercel Cron:

1. Fetches active product → subreddit pairs
2. Calls Reddit API for latest posts/comments (respecting rate limits)
3. Phase 1: Keyword/heuristic pre-filter (score 0.0–0.5)
4. Phase 2: Claude Haiku AI scoring for pre-score >= 0.2 (score 0.0–1.0)
5. Stores qualifying leads and fires notifications for high-relevance matches

### Pricing Tiers

| | Free | Pro ($29/mo) | Team ($79/mo) |
|---|---|---|---|
| Products | 1 | 5 | 20 |
| Subreddits / product | 3 | 20 | 50 |
| Leads / month | 50 | 1,000 | 5,000 |
| AI generations / month | 20 | 500 | 2,000 |
| Competitor monitoring | — | Yes | Yes |
| Integrations | — | Slack, Webhooks, CSV | Slack, Webhooks, CSV |
| Team members | 1 | 1 | 10 |

## Deployment

Deploy to [Vercel](https://vercel.com) with one click. Make sure to:

1. Add all environment variables from `.env.example`
2. Set up the Neon database and run migrations
3. Configure Clerk webhook endpoint (`/api/webhooks/clerk`)
4. Configure Stripe webhook endpoint (`/api/webhooks/stripe`)
5. Set up Vercel Cron for `/api/cron/scan-reddit`

## License

MIT
