import { Rocket, Target, Zap, CreditCard, Link2, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface HelpArticleSection {
    heading?: string
    body: string
    list?: string[]
    note?: string
}

export interface HelpArticle {
    slug: string
    title: string
    category: string
    description: string
    sections: HelpArticleSection[]
    relatedSlugs: string[]
}

export interface HelpCategory {
    icon: LucideIcon
    title: string
    articles: { title: string; slug: string }[]
}

// ─── Categories ──────────────────────────────────────────────

export const helpCategories: HelpCategory[] = [
    {
        icon: Rocket,
        title: "Getting Started",
        articles: [
            { title: "Creating your account", slug: "creating-your-account" },
            { title: "Setting up your first product", slug: "setting-up-your-first-product" },
            { title: "Choosing target subreddits", slug: "choosing-target-subreddits" },
            { title: "Understanding the dashboard", slug: "understanding-the-dashboard" },
        ],
    },
    {
        icon: Target,
        title: "Lead Discovery",
        articles: [
            { title: "How lead scoring works", slug: "how-lead-scoring-works" },
            { title: "Two-phase scoring explained", slug: "two-phase-scoring-explained" },
            { title: "Filtering and sorting leads", slug: "filtering-and-sorting-leads" },
            { title: "Understanding relevance scores", slug: "understanding-relevance-scores" },
        ],
    },
    {
        icon: Zap,
        title: "AI Engagement",
        articles: [
            { title: "Generating AI replies", slug: "generating-ai-replies" },
            { title: "Using reply templates", slug: "using-reply-templates" },
            { title: "Customizing tone and style", slug: "customizing-tone-and-style" },
            { title: "Best practices for Reddit replies", slug: "best-practices-for-reddit-replies" },
        ],
    },
    {
        icon: CreditCard,
        title: "Billing & Plans",
        articles: [
            { title: "Plan comparison and limits", slug: "plan-comparison-and-limits" },
            { title: "Upgrading your plan", slug: "upgrading-your-plan" },
            { title: "Managing your subscription", slug: "managing-your-subscription" },
            { title: "Understanding usage resets", slug: "understanding-usage-resets" },
        ],
    },
    {
        icon: Link2,
        title: "Integrations",
        articles: [
            { title: "Setting up Slack notifications", slug: "setting-up-slack-notifications" },
            { title: "Configuring custom webhooks", slug: "configuring-custom-webhooks" },
            { title: "Exporting leads to CSV", slug: "exporting-leads-to-csv" },
            { title: "Webhook event reference", slug: "webhook-event-reference" },
        ],
    },
    {
        icon: Users,
        title: "Teams",
        articles: [
            { title: "Inviting team members", slug: "inviting-team-members" },
            { title: "Team roles and permissions", slug: "team-roles-and-permissions" },
            { title: "Managing your team", slug: "managing-your-team" },
            { title: "Team plan features", slug: "team-plan-features" },
        ],
    },
]

// ─── Articles ────────────────────────────────────────────────

export const helpArticles: HelpArticle[] = [
    // ── Getting Started ──────────────────────────────────────
    {
        slug: "creating-your-account",
        title: "Creating your account",
        category: "Getting Started",
        description: "Sign up for RedProwler and get started in under a minute.",
        sections: [
            {
                heading: "Sign up with Google",
                body: "RedProwler uses Google sign-in for fast, secure authentication. There are no passwords to remember.",
                list: [
                    "Go to redprowler.com and click \"Get Started Free\" or \"Log In\"",
                    "You'll be redirected to the sign-in page",
                    "Click \"Continue with Google\" and select your Google account",
                    "Your RedProwler account is created automatically",
                ],
            },
            {
                heading: "First-time setup",
                body: "After signing in for the first time, you'll be taken through a quick onboarding wizard to set up your first product. This takes about 2 minutes and helps RedProwler start finding leads for you right away.",
                note: "You start on the free Starter plan with 1 product, 3 subreddits, 50 leads/month, and 20 AI generations/month. No credit card required.",
            },
            {
                heading: "Returning users",
                body: "If you already have an account, clicking \"Log In\" and signing in with the same Google account will take you straight to your dashboard. Your data, products, and leads are all waiting for you.",
            },
        ],
        relatedSlugs: ["setting-up-your-first-product", "choosing-target-subreddits", "understanding-the-dashboard"],
    },
    {
        slug: "setting-up-your-first-product",
        title: "Setting up your first product",
        category: "Getting Started",
        description: "Walk through the onboarding wizard to configure your first product for lead discovery.",
        sections: [
            {
                heading: "Step 1: Describe your product",
                body: "The first step is telling RedProwler about your product so our AI can find relevant leads.",
                list: [
                    "Product Name (required) — the name of your product or service",
                    "Product URL (optional) — your website or landing page",
                    "Description (required) — a clear description of what your product does and who it's for. The more specific, the better the leads.",
                    "Target Audience (optional) — describe your ideal customer (e.g., \"SaaS founders with less than 50 employees\")",
                    "Keywords (optional) — comma-separated terms related to your product (e.g., \"email marketing, newsletter, drip campaigns\")",
                ],
                note: "Tip: Be specific in your description. Instead of \"a marketing tool\", write \"an AI-powered email marketing platform that helps e-commerce stores increase repeat purchases through automated drip campaigns.\"",
            },
            {
                heading: "Step 2: Select subreddits",
                body: "Choose which subreddits RedProwler should monitor for leads. We suggest 12 popular communities to get started, but you can add any subreddit.",
                list: [
                    "Click on suggested subreddits to select them (r/SaaS, r/startups, r/Entrepreneur, r/smallbusiness, r/indiehackers, r/marketing, and more)",
                    "Type a custom subreddit name and press Enter to add it",
                    "Remove a subreddit by clicking the X on its badge",
                    "You need at least 1 subreddit to continue",
                ],
            },
            {
                heading: "Step 3: Review and launch",
                body: "Review your product name and selected subreddits. When you click \"Launch\", RedProwler will start monitoring these subreddits immediately. New leads will appear on your dashboard as our scanning cron discovers relevant posts.",
            },
        ],
        relatedSlugs: ["choosing-target-subreddits", "how-lead-scoring-works", "understanding-the-dashboard"],
    },
    {
        slug: "choosing-target-subreddits",
        title: "Choosing target subreddits",
        category: "Getting Started",
        description: "How to pick the right subreddits for finding high-quality leads.",
        sections: [
            {
                heading: "Where to find the right subreddits",
                body: "The best subreddits for lead generation are communities where your target audience asks questions, shares problems, or seeks recommendations. Think about where your ideal customer hangs out on Reddit.",
                list: [
                    "Problem-focused subreddits where people ask for solutions (e.g., r/smallbusiness for business tools)",
                    "Industry-specific communities (e.g., r/webdev for developer tools)",
                    "Recommendation subreddits where people explicitly ask \"what tool should I use?\"",
                    "Competitor subreddits where people discuss alternatives",
                ],
            },
            {
                heading: "Suggested subreddits",
                body: "During onboarding, RedProwler suggests 12 popular subreddits: r/SaaS, r/startups, r/Entrepreneur, r/smallbusiness, r/indiehackers, r/marketing, r/SEO, r/webdev, r/sideproject, r/growmybusiness, r/digitalnomad, and r/freelance. These are great starting points for most B2B products.",
            },
            {
                heading: "Adding and managing subreddits",
                body: "You can add or remove subreddits at any time from your product detail page. Go to Products, click on a product, and scroll to the \"Targeted Subreddits\" section.",
                note: "Subreddit limits per product: Starter plan = 3, Pro = 20, Team = 50. You can upgrade your plan to monitor more communities.",
            },
            {
                heading: "Tips for better results",
                body: "Quality matters more than quantity. Start with 3-5 highly relevant subreddits and expand based on the leads you see.",
                list: [
                    "Choose active subreddits with regular posts (at least a few per day)",
                    "Avoid overly broad subreddits where your product would rarely be relevant",
                    "Look for subreddits with question-style posts (\"What tool do you use for...\")",
                    "Check the subreddit rules — some communities don't allow self-promotion",
                ],
            },
        ],
        relatedSlugs: ["setting-up-your-first-product", "how-lead-scoring-works", "best-practices-for-reddit-replies"],
    },
    {
        slug: "understanding-the-dashboard",
        title: "Understanding the dashboard",
        category: "Getting Started",
        description: "A tour of your RedProwler dashboard and what each section shows.",
        sections: [
            {
                heading: "Overview stats",
                body: "The top of your dashboard shows four key metrics at a glance:",
                list: [
                    "Leads Found — total number of leads RedProwler has discovered across all your products",
                    "Replies Generated — how many AI-powered replies you've created",
                    "Engagement Rate — the percentage of leads you've engaged with (replied to or created content for)",
                    "Conversions — leads you've manually marked as converted",
                ],
            },
            {
                heading: "Recent leads",
                body: "Below the stats, you'll see your 5 most recent leads. Each lead shows the post title (or a preview of the body), the subreddit it came from, and a color-coded relevance score badge. Green means 70%+ relevance, yellow is 40-69%, and gray is below 40%. Click any lead to view the full post and generate an AI reply.",
            },
            {
                heading: "Quick actions",
                body: "The sidebar offers shortcuts to common tasks:",
                list: [
                    "Add Product — create a new product to monitor",
                    "Browse Templates — explore 50+ viral reply templates",
                    "View Analytics — see detailed performance charts",
                ],
            },
        ],
        relatedSlugs: ["filtering-and-sorting-leads", "generating-ai-replies", "understanding-relevance-scores"],
    },

    // ── Lead Discovery ───────────────────────────────────────
    {
        slug: "how-lead-scoring-works",
        title: "How lead scoring works",
        category: "Lead Discovery",
        description: "Understand how RedProwler finds and scores potential leads from Reddit.",
        sections: [
            {
                heading: "Overview",
                body: "RedProwler uses a two-phase scoring system to find the most relevant leads for your product. This hybrid approach balances speed and accuracy — a fast keyword filter handles the volume, then AI analyzes the best candidates in depth.",
            },
            {
                heading: "Phase 1: Keyword pre-scoring",
                body: "Every post from your targeted subreddits goes through a fast keyword analysis first. This phase scores posts from 0 to 0.5 based on keyword matches, intent phrases, and engagement signals. Only posts scoring 0.2 or higher advance to Phase 2.",
            },
            {
                heading: "Phase 2: AI analysis",
                body: "Posts that pass the keyword filter are analyzed by our AI (Claude) for deeper understanding. The AI evaluates whether someone is actively seeking a solution, expressing pain points, showing buying signals, or has commercial intent. It returns a final relevance score from 0 to 1, along with a reason and detected intent signals.",
            },
            {
                heading: "What happens with the score",
                body: "Posts with a final score of 0.3 or higher become leads in your dashboard. Posts scoring 0.8 or higher are considered high-relevance and trigger notifications (in-app, Slack, and webhooks if configured).",
                note: "The two-phase approach saves ~70% on AI costs compared to analyzing every post with AI, while still catching the best leads.",
            },
        ],
        relatedSlugs: ["two-phase-scoring-explained", "understanding-relevance-scores", "filtering-and-sorting-leads"],
    },
    {
        slug: "two-phase-scoring-explained",
        title: "Two-phase scoring explained",
        category: "Lead Discovery",
        description: "A deep dive into how the keyword pre-filter and AI scoring pipeline work together.",
        sections: [
            {
                heading: "Phase 1: Keyword pre-scoring (0 to 0.5)",
                body: "The first phase runs instantly on every new post. It checks for signals that suggest the post might be relevant to your product:",
                list: [
                    "Keyword match — each matching keyword from your product adds +0.1 to the score",
                    "Intent phrases — 20 built-in phrases like \"looking for\", \"anyone recommend\", \"need help with\" each add +0.08",
                    "Question indicators — posts containing question marks get +0.05",
                    "Reddit engagement — posts with 10+ upvotes get +0.03, 50+ upvotes get +0.06",
                    "Discussion activity — posts with 5+ comments get +0.02, 20+ comments get +0.05",
                ],
                note: "Phase 1 scores are capped at 0.5. Posts scoring below 0.2 are discarded — they don't contain enough signals to justify AI analysis.",
            },
            {
                heading: "Phase 2: AI analysis (0 to 1.0)",
                body: "Posts that score 0.2+ in Phase 1 are sent to our AI for deep analysis. The AI reads the full post content alongside your product description and evaluates four dimensions:",
                list: [
                    "Solution-seeking — is the person actively looking for a tool or solution?",
                    "Pain points — are they expressing frustration with their current approach?",
                    "Buying signals — do they mention budget, timeline, or readiness to purchase?",
                    "Commercial intent — does the context suggest a business need rather than casual browsing?",
                ],
            },
            {
                heading: "AI output",
                body: "For each post, the AI returns:",
                list: [
                    "Relevance score (0 to 1) — the final score used for ranking and filtering",
                    "Relevance reason — a short explanation of why this post was scored this way",
                    "Intent signals — specific buying signals detected (e.g., \"comparing tools\", \"budget allocated\")",
                    "Sentiment — the post author's tone: Positive, Negative, Neutral, or Question",
                ],
            },
        ],
        relatedSlugs: ["how-lead-scoring-works", "understanding-relevance-scores", "filtering-and-sorting-leads"],
    },
    {
        slug: "filtering-and-sorting-leads",
        title: "Filtering and sorting leads",
        category: "Lead Discovery",
        description: "How to find the leads that matter most using filters and sorting.",
        sections: [
            {
                heading: "Available filters",
                body: "The leads page lets you narrow down your results with several filters:",
                list: [
                    "Product — show leads for a specific product only",
                    "Subreddit — filter by the subreddit the lead was found in",
                    "Status — filter by NEW (unread), VIEWED (seen but not acted on), ENGAGED (you generated a reply), or CONVERTED (marked as a conversion)",
                    "Minimum score — set a threshold to only show leads above a certain relevance percentage",
                ],
            },
            {
                heading: "Sorting",
                body: "Leads are sorted by newest first by default. The most recently discovered leads appear at the top. As you scroll, older leads load automatically using cursor-based pagination.",
            },
            {
                heading: "Lead status workflow",
                body: "Each lead progresses through statuses as you interact with it:",
                list: [
                    "NEW — just discovered, you haven't seen it yet",
                    "VIEWED — you've opened the lead detail page",
                    "ENGAGED — you've generated at least one AI reply for this lead",
                    "CONVERTED — you've manually marked this lead as a successful conversion",
                ],
            },
            {
                heading: "Bookmarking leads",
                body: "Click the heart icon on any lead to bookmark it. Bookmarked leads are saved for later so you can quickly find the most promising opportunities.",
            },
        ],
        relatedSlugs: ["understanding-relevance-scores", "generating-ai-replies", "understanding-the-dashboard"],
    },
    {
        slug: "understanding-relevance-scores",
        title: "Understanding relevance scores",
        category: "Lead Discovery",
        description: "What the color-coded relevance badges mean and how to use them.",
        sections: [
            {
                heading: "Score ranges",
                body: "Every lead has a relevance score from 0% to 100%, shown as a color-coded badge:",
                list: [
                    "Green (70%+) — Strong match. This person is very likely looking for something your product solves. Prioritize these leads.",
                    "Yellow (40-69%) — Moderate match. The post is related to your space but the person may not be actively seeking a solution. Worth reviewing.",
                    "Gray (below 40%) — Weak match. The post has some keyword overlap but likely isn't a direct lead. Check occasionally for hidden gems.",
                ],
            },
            {
                heading: "High-relevance alerts",
                body: "Leads scoring 80% or higher are considered high-relevance. When one is found, RedProwler automatically sends you an in-app notification. If you have Slack or webhooks configured, those are triggered too. These are your hottest leads — respond quickly for the best results.",
            },
            {
                heading: "What affects the score",
                body: "The relevance score is influenced by how closely the post matches your product description, whether the author is actively seeking a solution, the presence of buying signals, and how commercially oriented the discussion is. You can improve your scores by writing a detailed, specific product description and choosing targeted keywords.",
            },
        ],
        relatedSlugs: ["how-lead-scoring-works", "two-phase-scoring-explained", "generating-ai-replies"],
    },

    // ── AI Engagement ────────────────────────────────────────
    {
        slug: "generating-ai-replies",
        title: "Generating AI replies",
        category: "AI Engagement",
        description: "How to use AI to generate authentic Reddit replies for your leads.",
        sections: [
            {
                heading: "Getting started",
                body: "Open any lead from your leads page, then scroll down to the AI Engagement section. You'll see options to choose your reply type and tone before generating.",
            },
            {
                heading: "Reply types",
                body: "Choose the type of engagement that fits the situation:",
                list: [
                    "Reply — a direct Reddit comment that naturally addresses the person's question or problem while mentioning your product as a helpful option",
                    "Conversation Starter — generates three different approaches (helpful, personal story, educational) to start a genuine conversation",
                    "DM Template — a friendly, non-spammy direct message template for reaching out privately",
                ],
            },
            {
                heading: "Choosing a tone",
                body: "Select from 5 tones to match the subreddit culture and your brand voice: Helpful (default), Casual, Professional, Witty, or Empathetic. See the \"Customizing tone and style\" article for details on each.",
            },
            {
                heading: "Generation and copying",
                body: "Click \"Generate\" and the AI reply streams in real-time. Once complete, click \"Copy\" to copy it to your clipboard. You can then paste it as a Reddit comment or DM. Each generation counts toward your monthly AI generation limit.",
                note: "Monthly AI generation limits: Starter = 20, Pro = 500, Team = 2,000. Your current usage is shown on Settings → Billing.",
            },
            {
                heading: "Engagement history",
                body: "Every reply you generate for a lead is saved in the \"Previous Engagements\" section at the bottom of the lead detail page. You can refer back to earlier generations at any time.",
            },
        ],
        relatedSlugs: ["customizing-tone-and-style", "using-reply-templates", "best-practices-for-reddit-replies"],
    },
    {
        slug: "using-reply-templates",
        title: "Using reply templates",
        category: "AI Engagement",
        description: "Browse, search, and use our library of 50+ proven reply templates.",
        sections: [
            {
                heading: "Browsing templates",
                body: "Go to Templates in the sidebar to browse the full library. Templates are organized into 10 categories: Question, Story, Opinion, Recommendation, Problem & Solution, Comparison, Case Study, AMA, Discussion, and Tutorial.",
            },
            {
                heading: "Searching and filtering",
                body: "Use the search bar at the top to find templates by keyword. Click any category tab to filter by type. The \"All\" tab shows every template.",
            },
            {
                heading: "Using a template",
                body: "Each template card shows a preview of the content, relevant tags, and how many times it's been used. Click the \"Copy\" button to copy the full template text to your clipboard. Then customize it with your product details before posting on Reddit.",
            },
            {
                heading: "Favorites",
                body: "Click the heart icon on any template to save it as a favorite. Your favorited templates are easy to find — just look for the filled heart icon when browsing.",
            },
        ],
        relatedSlugs: ["generating-ai-replies", "customizing-tone-and-style", "best-practices-for-reddit-replies"],
    },
    {
        slug: "customizing-tone-and-style",
        title: "Customizing tone and style",
        category: "AI Engagement",
        description: "Choose the right tone for your AI-generated replies to match any subreddit.",
        sections: [
            {
                heading: "Available tones",
                body: "When generating a reply, you can select from five distinct tones:",
                list: [
                    "Helpful (default) — genuine and direct. Addresses the question straightforwardly and offers your product as a natural suggestion. Works well in most subreddits.",
                    "Casual — conversational and laid-back. Uses informal language and feels like advice from a friend. Great for r/indiehackers, r/sideproject, and similar communities.",
                    "Professional — business-like and formal. Appropriate for r/Entrepreneur, r/smallbusiness, and corporate-focused discussions.",
                    "Witty — clever and engaging with a touch of humor. Stands out in busy threads. Use carefully — humor doesn't land in every context.",
                    "Empathetic — understanding and emotionally aware. Ideal when someone is expressing frustration or describing a painful problem.",
                ],
            },
            {
                heading: "Choosing the right tone",
                body: "Match your tone to the subreddit culture and the mood of the post. If someone is frustrated, use Empathetic. If the discussion is lighthearted, Casual or Witty works well. When in doubt, Helpful is the safest default.",
            },
        ],
        relatedSlugs: ["generating-ai-replies", "best-practices-for-reddit-replies", "using-reply-templates"],
    },
    {
        slug: "best-practices-for-reddit-replies",
        title: "Best practices for Reddit replies",
        category: "AI Engagement",
        description: "Tips for writing authentic, effective replies that don't feel like spam.",
        sections: [
            {
                heading: "Be genuinely helpful first",
                body: "The most successful Reddit replies lead with value. Answer the person's question or address their problem before mentioning your product. If your product isn't relevant to the specific question, don't force it.",
            },
            {
                heading: "Mention your product as one option",
                body: "Never position your product as the only solution. Mention it alongside other options or as something that worked for you personally. Reddit users are skeptical of overtly promotional content.",
            },
            {
                heading: "Match the subreddit culture",
                body: "Every subreddit has its own tone and rules. Some are casual and meme-friendly, others are strictly professional. Read the subreddit rules and recent posts before replying. RedProwler's tone selector helps you adapt automatically.",
            },
            {
                heading: "Keep it concise",
                body: "Aim for 2-4 paragraphs. Long walls of text get skipped on Reddit. The AI generates replies in this range by default.",
            },
            {
                heading: "Avoid common pitfalls",
                body: "RedProwler's AI is trained to avoid these, but always review before posting:",
                list: [
                    "Don't use cliche phrases like \"I stumbled upon\" or \"full disclosure\"",
                    "Don't sound like an advertisement or press release",
                    "Don't copy-paste the same reply across multiple threads",
                    "Don't reply to very old posts (Reddit users notice)",
                    "Don't ignore the subreddit's self-promotion rules",
                ],
            },
            {
                heading: "Always review before posting",
                body: "AI-generated replies are starting points, not finished products. Read through the generated text, personalize it with your own experience, and make sure it sounds like you wrote it. The best results come from combining AI efficiency with your authentic voice.",
                note: "RedProwler generates the reply — you decide what to post. Always review and edit before sharing on Reddit.",
            },
        ],
        relatedSlugs: ["generating-ai-replies", "customizing-tone-and-style", "using-reply-templates"],
    },

    // ── Billing & Plans ──────────────────────────────────────
    {
        slug: "plan-comparison-and-limits",
        title: "Plan comparison and limits",
        category: "Billing & Plans",
        description: "Compare Starter, Pro, and Team plans side by side.",
        sections: [
            {
                heading: "Starter (Free)",
                body: "Get started at no cost. Perfect for testing RedProwler with a single product.",
                list: [
                    "1 product",
                    "3 subreddits per product",
                    "50 leads per month",
                    "20 AI generations per month",
                    "No competitor monitoring",
                    "No Slack notifications",
                    "No webhook integrations",
                    "No CSV export",
                ],
            },
            {
                heading: "Pro — $29/month",
                body: "For founders and marketers who are serious about Reddit growth.",
                list: [
                    "5 products",
                    "20 subreddits per product",
                    "1,000 leads per month",
                    "500 AI generations per month",
                    "Competitor monitoring",
                    "Slack notifications",
                    "Custom webhook integrations",
                    "CSV export",
                ],
            },
            {
                heading: "Team — $79/month",
                body: "For growing teams running Reddit outreach at scale.",
                list: [
                    "20 products",
                    "50 subreddits per product",
                    "5,000 leads per month",
                    "2,000 AI generations per month",
                    "Up to 10 team members",
                    "Competitor monitoring",
                    "All integrations (Slack, webhooks, CSV)",
                    "Shared dashboards and products",
                ],
            },
        ],
        relatedSlugs: ["upgrading-your-plan", "understanding-usage-resets", "team-plan-features"],
    },
    {
        slug: "upgrading-your-plan",
        title: "Upgrading your plan",
        category: "Billing & Plans",
        description: "How to upgrade from Starter to Pro or Team.",
        sections: [
            {
                heading: "How to upgrade",
                body: "Upgrading takes less than a minute:",
                list: [
                    "Go to Settings in the sidebar",
                    "You'll land on the Billing tab",
                    "Click \"Upgrade to Pro\" at the top, or click \"Upgrade\" on any plan card below",
                    "You'll be redirected to a secure Stripe checkout page",
                    "Enter your payment details and confirm",
                    "Your plan activates immediately — you'll be redirected back to Settings",
                ],
            },
            {
                heading: "What happens after upgrading",
                body: "Your new plan limits take effect instantly. If you were on the Starter plan with 50 leads/month and upgrade to Pro, your limit jumps to 1,000 leads/month right away. Your existing leads and data are preserved.",
            },
            {
                heading: "Changing plans",
                body: "To switch between Pro and Team, use the \"Manage Subscription\" button on the Billing tab. This opens the Stripe customer portal where you can change your plan.",
            },
        ],
        relatedSlugs: ["plan-comparison-and-limits", "managing-your-subscription", "understanding-usage-resets"],
    },
    {
        slug: "managing-your-subscription",
        title: "Managing your subscription",
        category: "Billing & Plans",
        description: "Update payment methods, change plans, or cancel your subscription.",
        sections: [
            {
                heading: "Accessing the billing portal",
                body: "Go to Settings → Billing and click \"Manage Subscription\". This opens the Stripe customer portal where you can manage everything about your subscription.",
            },
            {
                heading: "What you can do",
                body: "In the Stripe billing portal, you can:",
                list: [
                    "Update your credit card or payment method",
                    "View your billing history and download invoices",
                    "Change your plan (upgrade or downgrade)",
                    "Cancel your subscription",
                ],
            },
            {
                heading: "Cancellation",
                body: "If you cancel, your paid plan remains active until the end of the current billing period. After that, your account reverts to the free Starter plan. Your data is preserved — you can re-subscribe at any time to regain access to Pro or Team features.",
                note: "There are no prorated refunds for partial months. If you cancel mid-cycle, you keep access until the period ends.",
            },
        ],
        relatedSlugs: ["upgrading-your-plan", "plan-comparison-and-limits", "understanding-usage-resets"],
    },
    {
        slug: "understanding-usage-resets",
        title: "Understanding usage resets",
        category: "Billing & Plans",
        description: "How and when your monthly lead and AI generation counters reset.",
        sections: [
            {
                heading: "What resets",
                body: "Two counters reset each month:",
                list: [
                    "Leads used this month — the number of leads RedProwler has discovered for you",
                    "AI generations used this month — the number of AI replies you've generated",
                ],
            },
            {
                heading: "When resets happen",
                body: "Usage counters reset on the 1st of each month at midnight UTC. For example, if you've used 45 of your 50 leads on January 31st, your counter resets to 0 on February 1st.",
            },
            {
                heading: "Checking your usage",
                body: "Go to Settings → Billing to see your current usage. Two progress bars show leads used and AI generations used, along with your plan limits. If you're approaching your limit, consider upgrading your plan.",
                note: "You'll receive an in-app notification when you reach 90% of your monthly limits.",
            },
        ],
        relatedSlugs: ["plan-comparison-and-limits", "upgrading-your-plan", "managing-your-subscription"],
    },

    // ── Integrations ─────────────────────────────────────────
    {
        slug: "setting-up-slack-notifications",
        title: "Setting up Slack notifications",
        category: "Integrations",
        description: "Get notified in Slack when RedProwler finds high-relevance leads.",
        sections: [
            {
                heading: "Requirements",
                body: "Slack notifications require a Pro or Team plan. You'll also need permission to create an incoming webhook in your Slack workspace.",
            },
            {
                heading: "Creating a Slack webhook",
                body: "First, create an incoming webhook URL in Slack:",
                list: [
                    "Go to api.slack.com/apps and click \"Create New App\"",
                    "Choose \"From scratch\", name it \"RedProwler\", and select your workspace",
                    "In the app settings, go to \"Incoming Webhooks\" and toggle it on",
                    "Click \"Add New Webhook to Workspace\" and select the channel for notifications",
                    "Copy the webhook URL (starts with https://hooks.slack.com/services/...)",
                ],
            },
            {
                heading: "Connecting to RedProwler",
                body: "With your webhook URL copied:",
                list: [
                    "Go to Settings → Integrations in RedProwler",
                    "Find the Slack Notifications section",
                    "Paste your webhook URL",
                    "Click \"Connect\"",
                ],
            },
            {
                heading: "What triggers notifications",
                body: "Once connected, you'll receive Slack messages for:",
                list: [
                    "High-relevance leads (scoring 80% or higher)",
                    "Competitor mentions found in your monitored subreddits",
                    "Daily digest summaries (if enabled)",
                ],
            },
        ],
        relatedSlugs: ["configuring-custom-webhooks", "webhook-event-reference", "understanding-relevance-scores"],
    },
    {
        slug: "configuring-custom-webhooks",
        title: "Configuring custom webhooks",
        category: "Integrations",
        description: "Send RedProwler events to your own endpoints with signed webhooks.",
        sections: [
            {
                heading: "Requirements",
                body: "Custom webhooks require a Pro or Team plan.",
            },
            {
                heading: "Adding a webhook",
                body: "Go to Settings → Integrations and find the Webhooks section. Enter your endpoint URL and select which events you want to receive. RedProwler will automatically generate an HMAC-SHA256 signing secret for verifying payloads.",
            },
            {
                heading: "Verifying webhook signatures",
                body: "Every webhook request includes two headers for verification:",
                list: [
                    "X-Webhook-Signature — HMAC-SHA256 hash of the request body, signed with your webhook's secret",
                    "X-Webhook-Event — the event type (e.g., \"lead.high_relevance\")",
                ],
            },
            {
                heading: "Payload format",
                body: "Each webhook sends a JSON payload with three fields:",
                list: [
                    "event — the event type string",
                    "timestamp — ISO 8601 timestamp of when the event occurred",
                    "data — event-specific data (lead details, competitor mention details, etc.)",
                ],
                note: "Webhooks have a 10-second timeout. If your endpoint doesn't respond within 10 seconds, the delivery is considered failed. Use asynchronous processing for heavy workloads.",
            },
        ],
        relatedSlugs: ["webhook-event-reference", "setting-up-slack-notifications", "exporting-leads-to-csv"],
    },
    {
        slug: "exporting-leads-to-csv",
        title: "Exporting leads to CSV",
        category: "Integrations",
        description: "Download your leads as a CSV file for analysis or import into other tools.",
        sections: [
            {
                heading: "Requirements",
                body: "CSV export requires a Pro or Team plan.",
            },
            {
                heading: "How to export",
                body: "Go to Settings → Integrations and click the \"Export\" button in the CSV Export section. Your browser will download a CSV file named redprowler-leads-YYYY-MM-DD.csv with up to 5,000 of your most recent leads.",
            },
            {
                heading: "CSV columns",
                body: "The exported file includes 12 columns:",
                list: [
                    "ID — unique lead identifier",
                    "Product — the product name this lead belongs to",
                    "Subreddit — the subreddit (formatted as r/name)",
                    "Title — the Reddit post title",
                    "Author — the Reddit username",
                    "Relevance Score — the AI-computed score (0 to 1, two decimal places)",
                    "Status — current lead status (NEW, VIEWED, ENGAGED, CONVERTED)",
                    "Sentiment — detected sentiment (POSITIVE, NEGATIVE, NEUTRAL, QUESTION)",
                    "Reddit Score — the post's upvote count",
                    "Comments — number of comments on the post",
                    "Permalink — full Reddit URL to the original post",
                    "Created At — timestamp when the lead was discovered",
                ],
            },
        ],
        relatedSlugs: ["filtering-and-sorting-leads", "configuring-custom-webhooks", "plan-comparison-and-limits"],
    },
    {
        slug: "webhook-event-reference",
        title: "Webhook event reference",
        category: "Integrations",
        description: "Complete reference of all webhook events and their payloads.",
        sections: [
            {
                heading: "lead.high_relevance",
                body: "Fired when a lead with a relevance score of 80% or higher is discovered.",
                list: [
                    "leadId — the unique lead ID",
                    "title — the Reddit post title",
                    "subreddit — the subreddit name",
                    "score — the relevance score (0 to 1)",
                    "permalink — path to the Reddit post",
                    "author — the Reddit username",
                    "productName — which of your products this lead matched",
                ],
            },
            {
                heading: "competitor.mention",
                body: "Fired when a competitor keyword is found in a monitored subreddit.",
                list: [
                    "competitorId — the competitor record ID",
                    "competitorName — the competitor name you configured",
                    "mentionId — the unique mention ID",
                    "subreddit — the subreddit where the mention was found",
                    "title — the Reddit post title",
                    "permalink — path to the Reddit post",
                    "sentiment — detected sentiment (positive, negative, neutral, question)",
                ],
            },
            {
                heading: "digest.daily",
                body: "Fired once daily with a summary of the last 24 hours of activity.",
                list: [
                    "totalLeads — number of leads found in the last 24 hours",
                    "leadsByProduct — breakdown of leads per product",
                    "competitorMentions — number of competitor mentions found",
                    "usagePercent — current monthly usage as a percentage",
                ],
            },
        ],
        relatedSlugs: ["configuring-custom-webhooks", "setting-up-slack-notifications", "how-lead-scoring-works"],
    },

    // ── Teams ────────────────────────────────────────────────
    {
        slug: "inviting-team-members",
        title: "Inviting team members",
        category: "Teams",
        description: "Add team members to collaborate on lead generation.",
        sections: [
            {
                heading: "Requirements",
                body: "Team collaboration requires the Team plan ($79/month). You can invite up to 10 team members.",
            },
            {
                heading: "How to invite",
                body: "Follow these steps to add a team member:",
                list: [
                    "Go to Settings → Team",
                    "Enter the email address of the person you want to invite",
                    "Click \"Invite\"",
                    "The person must already have a RedProwler account (they can sign up for free first)",
                ],
                note: "You cannot invite yourself, and duplicate invitations to the same email are blocked.",
            },
            {
                heading: "After inviting",
                body: "Once invited, the team member gains access to your shared products, leads, and dashboards. They can generate AI replies and interact with leads. Their activity counts toward your team's shared usage limits.",
            },
        ],
        relatedSlugs: ["team-roles-and-permissions", "managing-your-team", "team-plan-features"],
    },
    {
        slug: "team-roles-and-permissions",
        title: "Team roles and permissions",
        category: "Teams",
        description: "Understand the different access levels for team members.",
        sections: [
            {
                heading: "Owner",
                body: "The account creator is the Owner. They have full access to everything:",
                list: [
                    "Manage billing and subscription",
                    "Invite and remove team members",
                    "Create, edit, and delete products",
                    "View and engage with all leads",
                    "Configure integrations (Slack, webhooks)",
                    "Export data",
                ],
            },
            {
                heading: "Admin",
                body: "Admins can manage most aspects of the account except billing:",
                list: [
                    "Invite and remove team members",
                    "Create, edit, and delete products",
                    "View and engage with all leads",
                    "Configure integrations",
                ],
            },
            {
                heading: "Member",
                body: "Members have access to the core features:",
                list: [
                    "View all shared products and leads",
                    "Generate AI replies and engage with leads",
                    "Use templates and bookmark leads",
                    "View the dashboard and analytics",
                ],
            },
        ],
        relatedSlugs: ["inviting-team-members", "managing-your-team", "team-plan-features"],
    },
    {
        slug: "managing-your-team",
        title: "Managing your team",
        category: "Teams",
        description: "Remove members and manage your team settings.",
        sections: [
            {
                heading: "Viewing your team",
                body: "Go to Settings → Team to see all current team members, their roles, and when they were added.",
            },
            {
                heading: "Removing a member",
                body: "To remove a team member, go to Settings → Team, find the member in the list, and click the remove button. They will immediately lose access to your shared products and leads. Their personal RedProwler account remains active on the free plan.",
            },
            {
                heading: "Transferring ownership",
                body: "If you need to transfer account ownership to another team member, contact support at support@redprowler.com. Ownership transfer includes billing responsibility and full administrative access.",
            },
        ],
        relatedSlugs: ["inviting-team-members", "team-roles-and-permissions", "team-plan-features"],
    },
    {
        slug: "team-plan-features",
        title: "Team plan features",
        category: "Teams",
        description: "Everything included in the Team plan for collaborative Reddit outreach.",
        sections: [
            {
                heading: "Team plan overview",
                body: "The Team plan ($79/month) is designed for growing teams that need to run Reddit outreach at scale. It includes everything in the Pro plan plus team collaboration features.",
            },
            {
                heading: "Limits and quotas",
                body: "The Team plan includes generous limits shared across all team members:",
                list: [
                    "20 products",
                    "50 subreddits per product",
                    "5,000 leads per month",
                    "2,000 AI generations per month",
                    "Up to 10 team members",
                ],
                note: "Usage limits are shared across the entire team. All members' AI generations and lead discoveries count toward the same monthly totals.",
            },
            {
                heading: "Collaboration features",
                body: "Team members share access to:",
                list: [
                    "All products and their targeted subreddits",
                    "The full lead pipeline across every product",
                    "AI engagement tools and reply history",
                    "Templates and bookmarked leads",
                    "Dashboard and analytics",
                ],
            },
            {
                heading: "All integrations included",
                body: "The Team plan includes every integration: Slack notifications, custom webhooks, CSV export, and competitor monitoring. These are configured by the Owner or Admin and benefit the whole team.",
            },
        ],
        relatedSlugs: ["plan-comparison-and-limits", "inviting-team-members", "team-roles-and-permissions"],
    },
]

// ─── Lookup helpers ──────────────────────────────────────────

export function getArticleBySlug(slug: string): HelpArticle | undefined {
    return helpArticles.find((a) => a.slug === slug)
}

export function getArticlesByCategory(category: string): HelpArticle[] {
    return helpArticles.filter((a) => a.category === category)
}

export function getAllSlugs(): string[] {
    return helpArticles.map((a) => a.slug)
}
