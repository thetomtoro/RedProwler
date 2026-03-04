# Landing Page Honesty Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove all fake social proof from the RedProwler landing page and replace with honest messaging that showcases the real product differentiators (two-phase AI scoring, competitor monitoring).

**Architecture:** Pure frontend changes — modify 4 existing components, create 2 new components, delete 1 component. No backend, API, or database changes. All components are React server components unless they need interactivity.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, Lucide icons. Dark theme with red/orange accents (`accent`, `accent-secondary` CSS variables). Existing animation classes: `animate-fade-in-up`, `animate-fade-in`. Section divider pattern: `<div className="section-divider absolute top-0 left-0 right-0" />`.

---

### Task 1: Update Hero — Kill fake stats, honest pill, AI-forward subheading

**Files:**
- Modify: `src/components/landing/Hero.tsx:41-49` (pill), `src/components/landing/Hero.tsx:61-65` (subheading)

**Step 1: Replace the fake "2,847 signals detected today" pill with honest messaging**

In `src/components/landing/Hero.tsx`, replace lines 41-49:

```tsx
{/* Signal status pill */}
<div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/[0.04] mb-8 animate-fade-in">
    <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
    </span>
    <span className="text-sm text-text-secondary font-mono tracking-wide">
        <span className="text-accent font-semibold">2,847</span> signals detected today
    </span>
</div>
```

With:

```tsx
{/* Status pill */}
<div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/[0.04] mb-8 animate-fade-in">
    <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
    </span>
    <span className="text-sm text-text-secondary font-mono tracking-wide">
        AI-Powered Reddit Lead Generation
    </span>
</div>
```

**Step 2: Update the subheading to front-load the AI scoring differentiator**

In `src/components/landing/Hero.tsx`, replace lines 61-65:

```tsx
<p className="text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed animate-fade-in-up delay-200">
    RedProwler scans thousands of Reddit conversations to find people
    actively looking for what you sell — then arms you with AI-crafted
    replies that convert.
</p>
```

With:

```tsx
<p className="text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed animate-fade-in-up delay-200">
    RedProwler&apos;s two-phase AI scans thousands of Reddit conversations
    — then surfaces only the ones where someone is actively looking for
    what you sell.
</p>
```

**Step 3: Verify the dev server renders correctly**

Run: `cd /Users/tommyong/Documents/RedProwler && npm run dev`
Open: `http://localhost:3000`
Expected: Hero pill says "AI-Powered Reddit Lead Generation" (no fake number), subheading mentions two-phase AI.

**Step 4: Commit**

```bash
git add src/components/landing/Hero.tsx
git commit -m "fix: replace fake hero stats with honest messaging"
```

---

### Task 2: Create AIScoring section — the new centerpiece

**Files:**
- Create: `src/components/landing/AIScoring.tsx`

**Step 1: Create the AIScoring component**

Create `src/components/landing/AIScoring.tsx` with this content:

```tsx
import { X, Check, Brain, Filter } from "lucide-react"

const noiseLeads = [
    { sub: "r/webdev", text: "Just deployed my first React app!", score: 8 },
    { sub: "r/SaaS", text: "What's everyone's tech stack?", score: 12 },
    { sub: "r/startups", text: "Sharing my weekend project", score: 5 },
    { sub: "r/marketing", text: "Best free design tools?", score: 34 },
    { sub: "r/Entrepreneur", text: "How I hit 10K followers", score: 15 },
    { sub: "r/smallbusiness", text: "Tax software recommendations?", score: 22 },
]

const qualifiedLeads = [
    {
        sub: "r/SaaS",
        text: "Looking for a tool to find leads on Reddit — any recommendations?",
        score: 95,
        intent: "Asking for recommendation",
    },
    {
        sub: "r/startups",
        text: "We need to monitor Reddit mentions of our competitors. What do you use?",
        score: 92,
        intent: "Comparing alternatives",
    },
    {
        sub: "r/Entrepreneur",
        text: "How do you find potential customers on Reddit without being spammy?",
        score: 87,
        intent: "Pain point",
    },
]

export function AIScoring() {
    return (
        <section className="py-24 px-4 sm:px-6 relative">
            <div className="section-divider absolute top-0 left-0 right-0" />

            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/15 bg-accent/[0.04] mb-6">
                        <Brain className="w-3 h-3 text-accent" />
                        <span className="text-xs font-mono text-accent uppercase tracking-widest">Two-Phase AI</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        500 Noisy Mentions.{" "}
                        <span className="gradient-text">10 That Actually Convert.</span>
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Other tools dump hundreds of barely-relevant posts on you.
                        RedProwler&apos;s two-phase AI filter does the work so you don&apos;t have to.
                    </p>
                </div>

                {/* Before / After columns */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Phase 1: The Noise */}
                    <div className="rounded-xl border border-border bg-bg-secondary p-6 animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-text-tertiary/10 flex items-center justify-center">
                                <Filter className="w-4 h-4 text-text-tertiary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-text-tertiary">Without RedProwler</h3>
                                <p className="text-xs text-text-tertiary/70">Raw Reddit firehose</p>
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            {noiseLeads.map((lead, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 rounded-lg bg-bg-tertiary/30 border border-border/50 px-4 py-3 opacity-50"
                                >
                                    <X className="w-4 h-4 text-red-400/60 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[10px] font-mono text-text-tertiary/60">{lead.sub}</span>
                                        <p className="text-sm text-text-tertiary truncate">{lead.text}</p>
                                    </div>
                                    <span className="text-xs font-mono text-text-tertiary/40 shrink-0">{lead.score}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Phase 2: Your Leads */}
                    <div className="rounded-xl border border-accent/20 bg-bg-secondary p-6 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/15 flex items-center justify-center">
                                <Brain className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-text-primary">With RedProwler</h3>
                                <p className="text-xs text-text-tertiary">AI-scored &amp; filtered</p>
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            {qualifiedLeads.map((lead, i) => (
                                <div
                                    key={i}
                                    className="group rounded-lg bg-bg-tertiary/50 border border-accent/10 px-4 py-3 transition-all hover:border-accent/25"
                                >
                                    <div className="flex items-start gap-3">
                                        <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-mono text-accent/70">{lead.sub}</span>
                                                <span className="text-[10px] font-mono text-accent bg-accent/[0.06] border border-accent/10 px-1.5 py-0.5 rounded">
                                                    {lead.intent}
                                                </span>
                                            </div>
                                            <p className="text-sm text-text-secondary leading-relaxed">{lead.text}</p>
                                        </div>
                                        <span className="text-sm font-bold font-mono text-accent shrink-0">{lead.score}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Explainer */}
                <div className="mt-10 text-center">
                    <p className="text-text-tertiary text-sm max-w-3xl mx-auto leading-relaxed">
                        <span className="text-text-secondary font-medium">Phase 1:</span> Keyword matching and intent signals filter thousands of posts down to candidates.{" "}
                        <span className="text-text-secondary font-medium">Phase 2:</span> Claude AI scores each candidate for relevance to your specific product. You only see what matters.
                    </p>
                </div>
            </div>
        </section>
    )
}
```

**Step 2: Verify it renders**

Check the dev server at `http://localhost:3000` — won't be visible yet (not added to page.tsx). Move to next task.

**Step 3: Commit**

```bash
git add src/components/landing/AIScoring.tsx
git commit -m "feat: add AIScoring section showcasing two-phase filter"
```

---

### Task 3: Create CompetitorMonitoring section

**Files:**
- Create: `src/components/landing/CompetitorMonitoring.tsx`

**Step 1: Create the CompetitorMonitoring component**

Create `src/components/landing/CompetitorMonitoring.tsx`:

```tsx
import { Eye, Bell, MessageSquareText, ArrowRight } from "lucide-react"

export function CompetitorMonitoring() {
    return (
        <section className="py-24 px-4 sm:px-6 relative">
            <div className="section-divider absolute top-0 left-0 right-0" />

            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Copy */}
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/15 bg-accent/[0.04] mb-6">
                            <Eye className="w-3 h-3 text-accent" />
                            <span className="text-xs font-mono text-accent uppercase tracking-widest">Competitor Intel</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Know When Someone Asks for an Alternative to{" "}
                            <span className="gradient-text">Your Competitor</span>
                        </h2>
                        <p className="text-text-secondary text-lg leading-relaxed mb-8">
                            Track competitor mentions across Reddit. When someone is frustrated
                            with a competitor or asking for alternatives, RedProwler alerts you
                            instantly — so you can be the first to respond with a genuine, helpful answer.
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: Eye, text: "Set up keyword tracking for any competitor" },
                                { icon: Bell, text: "Get Slack alerts for high-relevance mentions" },
                                { icon: MessageSquareText, text: "AI generates contextual responses that position your product naturally" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded bg-accent/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                                        <item.icon className="w-3.5 h-3.5 text-accent" />
                                    </div>
                                    <span className="text-text-secondary text-sm">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Mockup alert card */}
                    <div className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
                        <div className="rounded-xl border border-accent/15 bg-bg-secondary p-6 relative overflow-hidden">
                            {/* Subtle glow */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[radial-gradient(ellipse_at_top_right,rgba(230,57,70,0.06)_0%,transparent_70%)]" />

                            <div className="relative space-y-4">
                                {/* Alert header */}
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                                    </span>
                                    <span className="text-xs font-mono text-accent">New competitor mention</span>
                                </div>

                                {/* Alert card 1 */}
                                <div className="rounded-lg bg-bg-tertiary/50 border border-accent/10 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-mono text-accent/70">r/SaaS</span>
                                        <span className="text-[10px] text-text-tertiary">· 2 min ago</span>
                                    </div>
                                    <p className="text-sm text-text-secondary leading-relaxed mb-3">
                                        &ldquo;We&apos;ve been using [Competitor] but it&apos;s too expensive for our
                                        team size. Any simpler alternatives?&rdquo;
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono font-bold text-accent">94% match</span>
                                        <span className="text-[10px] font-mono text-accent/60 bg-accent/[0.06] border border-accent/10 px-1.5 py-0.5 rounded">
                                            Comparing alternatives
                                        </span>
                                    </div>
                                </div>

                                {/* Alert card 2 (dimmer, stacked effect) */}
                                <div className="rounded-lg bg-bg-tertiary/30 border border-border/50 p-4 opacity-60">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-mono text-text-tertiary">r/startups</span>
                                        <span className="text-[10px] text-text-tertiary/60">· 18 min ago</span>
                                    </div>
                                    <p className="text-sm text-text-tertiary leading-relaxed mb-3">
                                        &ldquo;Has anyone switched from [Competitor]? Their new pricing
                                        is ridiculous...&rdquo;
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono text-text-tertiary">87% match</span>
                                        <span className="text-[10px] font-mono text-text-tertiary/60 bg-bg-tertiary/50 border border-border/50 px-1.5 py-0.5 rounded">
                                            Pain point
                                        </span>
                                    </div>
                                </div>

                                {/* View all link */}
                                <div className="flex items-center gap-1.5 text-accent text-sm font-medium pt-2">
                                    <span>View all mentions</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
```

**Step 2: Commit**

```bash
git add src/components/landing/CompetitorMonitoring.tsx
git commit -m "feat: add dedicated CompetitorMonitoring landing section"
```

---

### Task 4: Trim Features section from 6 to 4 cards with honest labels

**Files:**
- Modify: `src/components/landing/Features.tsx`

**Step 1: Replace the features array and update imports**

Replace the entire file content. Remove `Target` and `Eye` imports (those features got their own sections). Keep 4 cards. Replace inflated stats with honest descriptive labels.

Replace `src/components/landing/Features.tsx` lines 1-54 (the imports and features array):

```tsx
"use client"

import { Brain, FileText, BarChart3, Bell } from "lucide-react"

const features = [
    {
        icon: Brain,
        title: "AI Reply Generation",
        description:
            "Get contextual conversation starters, reply suggestions, and DM templates powered by Claude. Authentic, never spammy.",
        stat: "Claude AI",
        statLabel: "powered by",
    },
    {
        icon: FileText,
        title: "50+ Viral Templates",
        description:
            "Battle-tested post templates across 10 categories — stories, questions, comparisons, case studies. AI-personalized for your product.",
        stat: "10",
        statLabel: "categories",
    },
    {
        icon: BarChart3,
        title: "Analytics Dashboard",
        description:
            "Track leads found, engagement rates, conversion funnels, and ROI by subreddit. Know exactly what's working.",
        stat: "Real-time",
        statLabel: "insights",
    },
    {
        icon: Bell,
        title: "Slack & Webhook Alerts",
        description:
            "Get instant Slack notifications for high-relevance leads. Connect custom webhooks to your existing workflow.",
        stat: "Instant",
        statLabel: "notifications",
    },
]
```

**Step 2: Update the grid from 3 columns to 2 columns**

In `src/components/landing/Features.tsx`, replace line 78:

```tsx
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
```

With:

```tsx
<div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
```

**Step 3: Commit**

```bash
git add src/components/landing/Features.tsx
git commit -m "fix: trim features to 4 cards, remove inflated stats"
```

---

### Task 5: Update CTASection — kill fake stats, honest copy

**Files:**
- Modify: `src/components/landing/CTASection.tsx:31-57`

**Step 1: Replace the CTA content**

In `src/components/landing/CTASection.tsx`, replace lines 31-57 (everything inside `<div className="relative">`):

```tsx
<div className="relative">
    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
        Start Finding Leads on{" "}
        <span className="gradient-text">Reddit Today</span>
    </h2>
    <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">
        Your future customers are posting on Reddit right now.
        RedProwler finds them, scores them, and helps you respond
        — starting with a free plan.
    </p>
    <Link href="/sign-up">
        <Button variant="cta" size="lg" className="min-w-[220px]">
            Start Growing Today <ArrowRight className="w-4 h-4" />
        </Button>
    </Link>

    {/* Trust signals */}
    <div className="mt-10 flex items-center justify-center gap-5 text-text-tertiary text-sm">
        <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            No credit card required
        </span>
        <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Free plan available
        </span>
        <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Cancel anytime
        </span>
    </div>
</div>
```

**Step 2: Commit**

```bash
git add src/components/landing/CTASection.tsx
git commit -m "fix: replace fake CTA stats with honest trust signals"
```

---

### Task 6: Wire up page.tsx — new section order, delete Testimonials

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/components/landing/Testimonials.tsx`

**Step 1: Replace page.tsx with new section order**

Replace the entire content of `src/app/page.tsx`:

```tsx
import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { Hero } from "@/components/landing/Hero"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { AIScoring } from "@/components/landing/AIScoring"
import { CompetitorMonitoring } from "@/components/landing/CompetitorMonitoring"
import { Features } from "@/components/landing/Features"
import { Pricing } from "@/components/landing/Pricing"
import { FAQ } from "@/components/landing/FAQ"
import { CTASection } from "@/components/landing/CTASection"
import { LandingFooter } from "@/components/landing/LandingFooter"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-bg-primary grain">
            <LandingNavbar />
            <Hero />
            <HowItWorks />
            <AIScoring />
            <CompetitorMonitoring />
            <Features />
            <Pricing />
            <FAQ />
            <CTASection />
            <LandingFooter />
        </div>
    )
}
```

**Step 2: Delete the Testimonials component**

```bash
rm src/components/landing/Testimonials.tsx
```

**Step 3: Verify the full page renders**

Run: `cd /Users/tommyong/Documents/RedProwler && npm run dev`
Open: `http://localhost:3000`

Expected page flow:
1. Hero — honest pill, AI-forward subheading, radar visual, live ticker
2. HowItWorks — 3 steps (unchanged)
3. AIScoring — before/after two-phase filter visual
4. CompetitorMonitoring — left copy + right alert mockup
5. Features — 4 cards in 2x2 grid with honest labels
6. Pricing — 3 tiers (unchanged)
7. FAQ — 7 items (unchanged)
8. CTA — honest copy, trust signals instead of fake stats
9. Footer (unchanged)

**Step 4: Commit**

```bash
git add src/app/page.tsx
git add -u src/components/landing/Testimonials.tsx
git commit -m "feat: complete landing page honesty redesign

- Remove fake testimonials, fake stats, fake signal count
- Add AIScoring section showcasing two-phase filter
- Add CompetitorMonitoring dedicated section
- Trim features to 4 cards with honest labels
- Replace CTA fake stats with trust signals"
```

---

### Task 7: Visual QA — check the page end-to-end

**Step 1: Open the page and check each section visually**

Open `http://localhost:3000` and verify:
- [ ] Hero pill says "AI-Powered Reddit Lead Generation" (no number)
- [ ] Hero subheading mentions "two-phase AI"
- [ ] No testimonials section visible
- [ ] AIScoring section shows before/after columns
- [ ] CompetitorMonitoring shows alert mockup
- [ ] Features section has 4 cards (no "AI Lead Discovery" or "Competitor Monitoring")
- [ ] CTA says "Start Finding Leads on Reddit Today" (no "Join 500+ founders")
- [ ] CTA has trust signals (no fake stats row)
- [ ] All animations work (fade-in-up)
- [ ] Mobile responsive (check at 375px width)

**Step 2: Fix any visual issues found**

Address any spacing, alignment, or responsive issues.

**Step 3: Final commit if fixes were needed**

```bash
git add -A
git commit -m "fix: visual QA polish for landing page redesign"
```
