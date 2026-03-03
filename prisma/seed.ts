import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const templates = [
    // QUESTION category (6 templates)
    {
        title: "The Honest Question",
        body: "Has anyone found a good solution for [PROBLEM]? I've been struggling with [PAIN POINT] and tried [PREVIOUS SOLUTION] but it didn't work well because [REASON]. What do you all recommend?",
        category: "QUESTION" as const,
        tags: ["engagement", "authentic", "question"],
        useCase: "Great for positioning yourself as a genuine user seeking help while subtly introducing your product as a potential solution.",
    },
    {
        title: "The Poll-Style Question",
        body: "Quick question for everyone: Which [TOOL TYPE] do you use for [USE CASE]?\n\nA) [OPTION A]\nB) [OPTION B]\nC) [OPTION C]\nD) Something else (comment below!)\n\nI'm currently evaluating options and would love to hear what's worked best for you.",
        category: "QUESTION" as const,
        tags: ["poll", "engagement", "comparison"],
        useCase: "Encourages high engagement through structured choices. Perfect for market research while building visibility.",
    },
    {
        title: "The 'Am I Crazy?' Question",
        body: "Am I the only one who thinks [COMMON FRUSTRATION]? I've been dealing with this for [TIME PERIOD] and I'm starting to wonder if there's a better way. How do you all handle [SPECIFIC SCENARIO]?",
        category: "QUESTION" as const,
        tags: ["relatable", "frustration", "discussion"],
        useCase: "Taps into shared frustrations to build community rapport before offering solutions.",
    },
    {
        title: "The Expert Ask",
        body: "People who have experience with [NICHE TOPIC], what's the one thing you wish you knew when starting out? I'm [X WEEKS/MONTHS] into [ACTIVITY] and feeling overwhelmed by all the advice out there.",
        category: "QUESTION" as const,
        tags: ["expert", "learning", "community"],
        useCase: "Positions you as humble learner while building relationships with experienced community members.",
    },
    {
        title: "The Budget Question",
        body: "What's a realistic budget for [GOAL]? I've seen everything from [LOW PRICE] to [HIGH PRICE] and I'm not sure what actually delivers results. What have you spent and what was your ROI?",
        category: "QUESTION" as const,
        tags: ["budget", "roi", "practical"],
        useCase: "Opens price sensitivity discussions where you can position your product's value proposition.",
    },
    {
        title: "The 'Before I Buy' Question",
        body: "Thinking about investing in [PRODUCT CATEGORY]. Before I pull the trigger:\n\n1. What should I look for?\n2. What are common red flags?\n3. What's your experience been like?\n\nAppreciate any honest feedback!",
        category: "QUESTION" as const,
        tags: ["buying", "research", "honest"],
        useCase: "Creates a buying-intent thread where you can guide the conversation toward your product's strengths.",
    },

    // STORY category (6 templates)
    {
        title: "The Personal Journey",
        body: "I spent the last [TIME PERIOD] trying to solve [PROBLEM] and here's what I learned. When I first started, I [INITIAL APPROACH]. After [X FAILED ATTEMPTS], I realized [INSIGHT]. Here's what finally worked...",
        category: "STORY" as const,
        tags: ["storytelling", "relatable", "high-engagement"],
        useCase: "Personal narratives drive high engagement and shares. Great for building trust before a soft product mention.",
    },
    {
        title: "The 'I Almost Gave Up' Story",
        body: "I was THIS close to giving up on [GOAL]. After [SETBACK 1], [SETBACK 2], and [SETBACK 3], I found something that actually worked. Here's my full timeline:\n\nMonth 1: [WHAT HAPPENED]\nMonth 3: [BREAKTHROUGH]\nToday: [CURRENT RESULTS]\n\nKey takeaway: [LESSON LEARNED]",
        category: "STORY" as const,
        tags: ["perseverance", "timeline", "motivational"],
        useCase: "Emotional storytelling that hooks readers and makes them invested in your journey.",
    },
    {
        title: "The Side Project Update",
        body: "Month [X] update on my side project:\n\n📊 Numbers: [KEY METRICS]\n✅ What worked: [WINS]\n❌ What didn't: [FAILURES]\n🎯 Next month: [GOALS]\n\nHappy to answer any questions!",
        category: "STORY" as const,
        tags: ["buildinpublic", "update", "transparency"],
        useCase: "Build-in-public style that builds following and trust through transparency.",
    },
    {
        title: "The Transformation Story",
        body: "6 months ago I was [BEFORE STATE]. Today, I [AFTER STATE]. Here's exactly what I changed:\n\n1. [CHANGE 1] — This alone made a [X]% difference\n2. [CHANGE 2] — Took [TIME] but was worth it\n3. [CHANGE 3] — The game changer\n\nTotal investment: [COST/TIME]",
        category: "STORY" as const,
        tags: ["transformation", "before-after", "results"],
        useCase: "Before/after stories are highly shareable and create natural product placement opportunities.",
    },
    {
        title: "The Mistake Story",
        body: "I made a $[X] mistake with [TOPIC] so you don't have to. Here's what happened:\n\nWhat I did: [ACTION]\nWhy it seemed like a good idea: [REASONING]\nWhat went wrong: [CONSEQUENCE]\nHow I fixed it: [SOLUTION]\n\nLesson learned: [TAKEAWAY]",
        category: "STORY" as const,
        tags: ["mistake", "warning", "educational"],
        useCase: "People love learning from others' mistakes. Creates trust and positions you as experienced.",
    },
    {
        title: "The 'How I Built' Story",
        body: "I built [PRODUCT/PROJECT] in [TIME] and here's everything I used:\n\nTech stack: [TOOLS]\nTime spent: [HOURS]\nCost: [AMOUNT]\nBiggest challenge: [CHALLENGE]\nResult: [OUTCOME]\n\nAMA about the process!",
        category: "STORY" as const,
        tags: ["technical", "buildinpublic", "ama"],
        useCase: "Combines storytelling with AMA to maximize engagement and demonstrate expertise.",
    },

    // OPINION category (5 templates)
    {
        title: "The Hot Take",
        body: "Unpopular opinion: [CONTROVERSIAL STATEMENT ABOUT INDUSTRY]. Here's why I think this, and why most people get it wrong...\n\n[SUPPORTING ARGUMENT 1]\n[SUPPORTING ARGUMENT 2]\n[CALL TO DISCUSSION]",
        category: "OPINION" as const,
        tags: ["discussion", "engagement", "controversial"],
        useCase: "Controversial takes drive comments and engagement. Position carefully to align with your product narrative.",
    },
    {
        title: "The Industry Prediction",
        body: "Hot take: [INDUSTRY] is going to look completely different in [TIMEFRAME]. Here's why:\n\n1. [TREND 1] is accelerating faster than people think\n2. [TREND 2] is making [OLD WAY] obsolete\n3. [TREND 3] is only beginning\n\nThe companies that will win are the ones that [ACTION]. Agree or disagree?",
        category: "OPINION" as const,
        tags: ["prediction", "trends", "industry"],
        useCase: "Positions you as a thought leader while framing your product as forward-thinking.",
    },
    {
        title: "The Contrarian View",
        body: "I know I'll get downvoted for this, but [POPULAR THING] is overrated. Here's why:\n\n- [POINT 1]\n- [POINT 2]\n- [POINT 3]\n\nInstead, I think [ALTERNATIVE] is a much better approach because [REASON]. Change my mind.",
        category: "OPINION" as const,
        tags: ["contrarian", "debate", "engagement"],
        useCase: "The 'change my mind' format drives massive engagement and positions your alternative.",
    },
    {
        title: "The Myth Buster",
        body: "Let's bust some myths about [TOPIC]:\n\n❌ Myth: [COMMON BELIEF 1]\n✅ Reality: [ACTUAL TRUTH]\n\n❌ Myth: [COMMON BELIEF 2]\n✅ Reality: [ACTUAL TRUTH]\n\n❌ Myth: [COMMON BELIEF 3]\n✅ Reality: [ACTUAL TRUTH]\n\nWhat myths have held you back?",
        category: "OPINION" as const,
        tags: ["mythbusting", "educational", "engaging"],
        useCase: "Correcting misconceptions positions you as an authority and naturally leads to your solution.",
    },
    {
        title: "The Honest Review",
        body: "After using [PRODUCT/SERVICE] for [TIME], here's my brutally honest review:\n\nPros:\n+ [PRO 1]\n+ [PRO 2]\n\nCons:\n- [CON 1]\n- [CON 2]\n\nVerdict: [RATING/10] — [SUMMARY]\n\nWould I recommend it? [ANSWER + NUANCE]",
        category: "OPINION" as const,
        tags: ["review", "honest", "helpful"],
        useCase: "Honest reviews build massive trust. Mention competitor weaknesses that your product solves.",
    },

    // RECOMMENDATION category (5 templates)
    {
        title: "The Curated List",
        body: "After testing 20+ [TOOL TYPE] tools, here are my top 5:\n\n1. [TOOL 1] — Best for [USE CASE] ($[PRICE])\n2. [TOOL 2] — Best for [USE CASE] ($[PRICE])\n3. [TOOL 3] — Best for [USE CASE] ($[PRICE])\n4. [TOOL 4] — Best for [USE CASE] ($[PRICE])\n5. [TOOL 5] — Best for [USE CASE] ($[PRICE])\n\nFull breakdown in comments!",
        category: "RECOMMENDATION" as const,
        tags: ["list", "curated", "helpful"],
        useCase: "Position your product naturally within a helpful list. The 'I tested X tools' format drives huge engagement.",
    },
    {
        title: "The Stack Recommendation",
        body: "Here's the exact [TYPE] stack I use and recommend:\n\n🔧 [CATEGORY 1]: [TOOL] — Why: [REASON]\n🔧 [CATEGORY 2]: [TOOL] — Why: [REASON]\n🔧 [CATEGORY 3]: [TOOL] — Why: [REASON]\n\nTotal cost: $[X]/month\nTime saved: [X] hours/week\n\nHappy to explain any choice in detail!",
        category: "RECOMMENDATION" as const,
        tags: ["stack", "tools", "productivity"],
        useCase: "Stack recommendations show expertise and naturally include your product alongside established tools.",
    },
    {
        title: "The Free Alternatives",
        body: "Stop paying for [EXPENSIVE TOOL]. Here are free alternatives that work just as well:\n\n1. [FREE TOOL 1] replaces [PAID TOOL] — [HOW]\n2. [FREE TOOL 2] replaces [PAID TOOL] — [HOW]\n3. [FREE TOOL 3] replaces [PAID TOOL] — [HOW]\n\nSaved me $[AMOUNT]/month with zero productivity loss.",
        category: "RECOMMENDATION" as const,
        tags: ["free", "budget", "alternatives"],
        useCase: "Free alternative posts go viral. Position your freemium product as the smart choice.",
    },
    {
        title: "The Beginner's Toolkit",
        body: "If I were starting [ACTIVITY] from scratch in 2024, here's exactly what I'd use:\n\n📱 For [TASK]: [TOOL] (free)\n💻 For [TASK]: [TOOL] ($[X]/mo)\n📊 For [TASK]: [TOOL] (free trial)\n\nDon't waste time with [COMMON MISTAKE]. Start with these and you'll be ahead of 90%.",
        category: "RECOMMENDATION" as const,
        tags: ["beginner", "toolkit", "getting-started"],
        useCase: "Targets beginners who are most receptive to tool recommendations.",
    },
    {
        title: "The Workflow Recommendation",
        body: "This workflow saves me [X] hours per week:\n\n1. [STEP 1] using [TOOL]\n2. [STEP 2] using [TOOL]\n3. [STEP 3] using [TOOL]\n4. [STEP 4] using [TOOL]\n\nBefore: [OLD WAY + TIME]\nAfter: [NEW WAY + TIME]\n\nTotal automation: [PERCENTAGE]%",
        category: "RECOMMENDATION" as const,
        tags: ["workflow", "automation", "productivity"],
        useCase: "Workflow posts show practical value and naturally integrate product mentions.",
    },

    // PROBLEM_SOLUTION category (5 templates)
    {
        title: "The Problem-Solution Post",
        body: "If you're dealing with [COMMON PROBLEM], here's a simple approach that worked for me:\n\nThe problem: [DETAILED PROBLEM]\nWhat I tried: [PREVIOUS APPROACHES]\nWhat worked: [SOLUTION]\nResults: [SPECIFIC METRICS]",
        category: "PROBLEM_SOLUTION" as const,
        tags: ["actionable", "results", "problem-solving"],
        useCase: "Direct problem-solution format targets users actively searching for answers.",
    },
    {
        title: "The Quick Fix",
        body: "PSA: If you're experiencing [COMMON ISSUE], here's a quick fix that takes 5 minutes:\n\n1. [STEP 1]\n2. [STEP 2]\n3. [STEP 3]\n\nThis fixed it for me and [X OTHER PEOPLE] have confirmed it works. No need to [EXPENSIVE ALTERNATIVE].",
        category: "PROBLEM_SOLUTION" as const,
        tags: ["quick-fix", "psa", "helpful"],
        useCase: "Quick fix posts get saved and shared. Build goodwill that drives traffic to your profile/product.",
    },
    {
        title: "The Root Cause Analysis",
        body: "Spent [TIME] debugging [PROBLEM] and finally found the root cause. Turns out it was [UNEXPECTED REASON].\n\nSymptoms: [WHAT IT LOOKED LIKE]\nWhat I tried first: [OBVIOUS SOLUTIONS]\nActual cause: [ROOT CAUSE]\nFix: [SOLUTION]\n\nSaving this for anyone else who runs into this!",
        category: "PROBLEM_SOLUTION" as const,
        tags: ["debugging", "technical", "rootcause"],
        useCase: "Technical root cause posts become reference material that drives long-term traffic.",
    },
    {
        title: "The Cost-Saving Solution",
        body: "Was paying $[X]/month for [PROBLEM]. Found a way to cut it to $[Y]/month:\n\nOld approach: [EXPENSIVE WAY]\nNew approach: [CHEAPER WAY]\nSavings: $[AMOUNT]/year\nTrade-offs: [HONEST ASSESSMENT]\n\nDetailed how-to in comments if anyone wants it.",
        category: "PROBLEM_SOLUTION" as const,
        tags: ["cost-saving", "practical", "money"],
        useCase: "Money-saving posts always perform well. Position your product as the cost-effective choice.",
    },
    {
        title: "The Automation Solution",
        body: "I automated [TEDIOUS TASK] and it now takes 0 minutes instead of [X] hours/week.\n\nWhat I automated: [TASK DESCRIPTION]\nTool used: [TOOL/METHOD]\nSetup time: [TIME]\nMonthly cost: [COST]\n\nROI: Paid for itself in [TIMEFRAME]. Here's how to set it up...",
        category: "PROBLEM_SOLUTION" as const,
        tags: ["automation", "efficiency", "roi"],
        useCase: "Automation posts attract efficiency-minded users who are ideal product adopters.",
    },

    // COMPARISON category (5 templates)
    {
        title: "The Tool Comparison",
        body: "I tested [X TOOLS] for [USE CASE] so you don't have to. Here's my honest breakdown:\n\n1. [TOOL A] — Best for [USE CASE], but [DRAWBACK]\n2. [TOOL B] — Great [FEATURE], however [LIMITATION]\n3. [TOOL C] — My pick because [REASON]",
        category: "COMPARISON" as const,
        tags: ["comparison", "value", "informative"],
        useCase: "Comparison posts drive massive engagement and position your product against competitors.",
    },
    {
        title: "The Switching Story",
        body: "Switched from [TOOL A] to [TOOL B] after [TIME]. Here's my experience:\n\nWhy I switched: [REASONS]\nMigration difficulty: [EASY/HARD] — [DETAILS]\nWhat's better: [IMPROVEMENTS]\nWhat I miss: [DRAWBACKS]\nWould I switch back? [ANSWER]\n\nHappy to answer questions!",
        category: "COMPARISON" as const,
        tags: ["switching", "migration", "comparison"],
        useCase: "Switching stories attract users on the fence. Address their exact concerns.",
    },
    {
        title: "The Feature Matrix",
        body: "Made a comparison table for [PRODUCT CATEGORY] since I couldn't find a good one:\n\n| Feature | [Tool A] | [Tool B] | [Tool C] |\n|---------|----------|----------|----------|\n| [Feature 1] | ✅ | ❌ | ✅ |\n| [Feature 2] | ✅ | ✅ | ❌ |\n| Price | $[X] | $[Y] | $[Z] |\n\nFull breakdown and recommendations in comments!",
        category: "COMPARISON" as const,
        tags: ["matrix", "detailed", "research"],
        useCase: "Feature matrices get bookmarked and referenced. Excellent for SEO and long-term visibility.",
    },
    {
        title: "The Price Comparison",
        body: "I analyzed the pricing of every major [TOOL TYPE] on the market:\n\n💰 Under $10/mo: [TOOL 1], [TOOL 2]\n💰 $10-30/mo: [TOOL 3], [TOOL 4]\n💰 $30-100/mo: [TOOL 5], [TOOL 6]\n💰 Enterprise: [TOOL 7]\n\nBest value for money: [YOUR PICK]\nBest for beginners: [YOUR PICK]\nBest overall: [YOUR PICK]",
        category: "COMPARISON" as const,
        tags: ["pricing", "value", "comprehensive"],
        useCase: "Price comparison posts attract buyer-intent users ready to make a decision.",
    },
    {
        title: "The Year-in-Review Comparison",
        body: "Used [TOOL A] for 6 months, then [TOOL B] for 6 months. Here's my verdict:\n\nOnboarding: [A] vs [B] — Winner: [X]\nDaily use: [A] vs [B] — Winner: [X]\nSupport: [A] vs [B] — Winner: [X]\nValue for money: [A] vs [B] — Winner: [X]\n\nOverall winner: [TOOL] — Here's why...",
        category: "COMPARISON" as const,
        tags: ["longterm", "review", "detailed"],
        useCase: "Long-term comparison reviews have the highest trust factor among comparison content.",
    },

    // CASE_STUDY category (5 templates)
    {
        title: "The Revenue Case Study",
        body: "How I went from $0 to $[X]K/month in [TIME]:\n\nStarting point: [SITUATION]\nStrategy: [WHAT I DID]\nTools used: [LIST]\nTimeline: [MILESTONES]\nCurrent MRR: $[X]\n\nKey lesson: [INSIGHT]\n\nWilling to share more details in comments.",
        category: "CASE_STUDY" as const,
        tags: ["revenue", "growth", "case-study"],
        useCase: "Revenue case studies attract ambitious users and create natural product mention opportunities.",
    },
    {
        title: "The Growth Hack Case Study",
        body: "This one tactic grew our [METRIC] by [X]% in [TIME]:\n\nBefore: [STARTING METRIC]\nWhat we did: [DETAILED TACTIC]\nWhy it works: [PSYCHOLOGY/LOGIC]\nAfter: [END METRIC]\nCost: [INVESTMENT]\nROI: [RETURN]\n\nFull playbook below 👇",
        category: "CASE_STUDY" as const,
        tags: ["growth", "tactic", "results"],
        useCase: "Specific growth tactics with numbers always get high engagement and saves.",
    },
    {
        title: "The A/B Test Results",
        body: "We ran an A/B test on [ELEMENT] and the results were surprising:\n\nControl: [VERSION A DESCRIPTION]\nVariant: [VERSION B DESCRIPTION]\nSample size: [N USERS]\nDuration: [TIME]\n\nResult: Variant [won/lost] by [X]%\n\nWhy this matters: [INSIGHT]",
        category: "CASE_STUDY" as const,
        tags: ["data", "testing", "insights"],
        useCase: "Data-driven posts build credibility and attract analytically-minded users.",
    },
    {
        title: "The Failure Post-Mortem",
        body: "Our [PROJECT] failed. Here's the full post-mortem:\n\nThe idea: [DESCRIPTION]\nWhat went wrong: [LIST OF MISTAKES]\nMoney burned: $[AMOUNT]\nTime wasted: [DURATION]\n\nWhat I'd do differently:\n1. [LESSON 1]\n2. [LESSON 2]\n3. [LESSON 3]\n\nHope this saves someone the same pain.",
        category: "CASE_STUDY" as const,
        tags: ["failure", "postmortem", "lessons"],
        useCase: "Failure stories are the most shared content type. Vulnerability builds massive trust.",
    },
    {
        title: "The Customer Acquisition Case Study",
        body: "How I got my first 100 customers without spending a dollar on ads:\n\nChannel 1: [METHOD] — Got [X] customers\nChannel 2: [METHOD] — Got [X] customers\nChannel 3: [METHOD] — Got [X] customers\n\nWhat didn't work: [FAILED CHANNELS]\nTotal timeline: [DURATION]\nKey insight: [TAKEAWAY]",
        category: "CASE_STUDY" as const,
        tags: ["acquisition", "organic", "startup"],
        useCase: "First-100-customers stories are gold for startup communities. Natural product showcase.",
    },

    // AMA category (4 templates)
    {
        title: "The Founder AMA",
        body: "I'm a [ROLE] who [ACHIEVEMENT]. I've been [DOING THIS] for [TIME] and have learned a lot of lessons the hard way. AMA about [TOPIC AREA]!\n\nQuick background:\n- [CREDENTIAL 1]\n- [CREDENTIAL 2]\n- [CREDENTIAL 3]\n\nI'll be answering questions for the next [TIME].",
        category: "AMA" as const,
        tags: ["ama", "founder", "expertise"],
        useCase: "AMAs position you as an authority and create dozens of natural product mention opportunities.",
    },
    {
        title: "The 'I Did X So You Don't Have To'",
        body: "I spent [TIME/MONEY] on [ACTIVITY] so you don't have to. AMA!\n\nWhat I tried: [LIST]\nWhat worked: [WINNERS]\nWhat was a waste: [LOSERS]\nNet result: [OUTCOME]\n\nFire away with questions — no topic off limits.",
        category: "AMA" as const,
        tags: ["experience", "helpful", "ama"],
        useCase: "The 'so you don't have to' frame is irresistible and drives questions that lead to product discussions.",
    },
    {
        title: "The Milestone AMA",
        body: "Just hit [MILESTONE]! Ask me anything about the journey.\n\nTimeline:\n📅 [DATE 1]: [EVENT]\n📅 [DATE 2]: [EVENT]\n📅 [DATE 3]: [EVENT]\n📅 Today: [MILESTONE]\n\nBiggest surprise along the way: [SURPRISE]\nBiggest regret: [REGRET]",
        category: "AMA" as const,
        tags: ["milestone", "celebration", "ama"],
        useCase: "Milestone AMAs create positive energy and naturally showcase your product's role in success.",
    },
    {
        title: "The Industry Insider AMA",
        body: "I've worked in [INDUSTRY] for [X] years. The stuff they don't tell you is wild. AMA!\n\nWhat I've seen: [INTERESTING FACT]\nBiggest misconception: [MYTH]\nWhat's actually changing: [TREND]\n\nI'll answer everything honestly — even the uncomfortable questions.",
        category: "AMA" as const,
        tags: ["insider", "industry", "honest"],
        useCase: "Insider knowledge AMAs attract massive engagement and position you as a domain expert.",
    },

    // DISCUSSION category (5 templates)
    {
        title: "The Future Discussion",
        body: "Where do you think [INDUSTRY/TOPIC] is headed in [TIMEFRAME]?\n\nI'm seeing these trends:\n- [TREND 1]\n- [TREND 2]\n- [TREND 3]\n\nBut I'm curious what the rest of the community thinks. What are you betting on?",
        category: "DISCUSSION" as const,
        tags: ["future", "trends", "discussion"],
        useCase: "Future-focused discussions position you as forward-thinking and attract strategic thinkers.",
    },
    {
        title: "The Controversial Discussion",
        body: "Let's settle this once and for all: [DEBATE TOPIC].\n\nTeam A says: [ARGUMENT]\nTeam B says: [ARGUMENT]\n\nI lean toward [SIDE] because [REASON], but I've seen good points on both sides. Where do you stand?",
        category: "DISCUSSION" as const,
        tags: ["debate", "controversial", "engagement"],
        useCase: "Taking a side in debates drives comments and creates passionate engagement.",
    },
    {
        title: "The 'What Changed Your Mind?' Discussion",
        body: "What's something about [TOPIC] you used to believe but no longer do?\n\nFor me, I used to think [OLD BELIEF]. But after [EXPERIENCE], I realized [NEW UNDERSTANDING]. It completely changed how I approach [ACTIVITY].\n\nWhat's your 'aha' moment?",
        category: "DISCUSSION" as const,
        tags: ["reflection", "growth", "community"],
        useCase: "Reflective discussions build deep connections and surface pain points your product addresses.",
    },
    {
        title: "The Weekly Check-in",
        body: "Weekly [TOPIC] discussion thread! Share:\n\n1. What's working for you right now?\n2. What challenge are you stuck on?\n3. Any resources or tools you discovered this week?\n\nLet's help each other out 🤝",
        category: "DISCUSSION" as const,
        tags: ["community", "weekly", "supportive"],
        useCase: "Regular discussion threads build community habit and create recurring visibility.",
    },
    {
        title: "The Unpopular Truths Thread",
        body: "Let's share some unpopular truths about [INDUSTRY]:\n\nI'll start: [YOUR UNPOPULAR TRUTH]\n\nRules:\n- Be honest, not mean\n- Back up your claim with experience\n- No gatekeeping\n\nWhat's yours?",
        category: "DISCUSSION" as const,
        tags: ["honesty", "truths", "engaging"],
        useCase: "Unpopular truths threads go viral and create intense engagement perfect for brand visibility.",
    },

    // TUTORIAL category (6 templates)
    {
        title: "The Step-by-Step Guide",
        body: "Complete beginner's guide to [TOPIC] (took me [TIME] to figure this out):\n\nStep 1: [ACTION]\nStep 2: [ACTION]\nStep 3: [ACTION]\n\nCommon mistakes to avoid:\n- [MISTAKE 1]\n- [MISTAKE 2]\n\nResults you can expect: [OUTCOMES]",
        category: "TUTORIAL" as const,
        tags: ["tutorial", "educational", "value"],
        useCase: "Comprehensive tutorials get saved, shared, and drive long-term traffic to your profile.",
    },
    {
        title: "The 5-Minute Tutorial",
        body: "You can [ACHIEVE GOAL] in 5 minutes. Here's how:\n\n⏱️ Minute 1: [ACTION]\n⏱️ Minute 2: [ACTION]\n⏱️ Minute 3: [ACTION]\n⏱️ Minute 4: [ACTION]\n⏱️ Minute 5: [ACTION]\n\nDone. No fluff, no BS. Just results.\n\nBonus tip: [ADVANCED TIP]",
        category: "TUTORIAL" as const,
        tags: ["quick", "actionable", "no-fluff"],
        useCase: "Time-boxed tutorials feel achievable and get high save rates.",
    },
    {
        title: "The 'Don't Do This' Tutorial",
        body: "Stop doing [COMMON MISTAKE] when [ACTIVITY]. Do this instead:\n\n❌ Wrong way: [DESCRIPTION]\n✅ Right way: [DESCRIPTION]\n\n❌ Wrong way: [DESCRIPTION]\n✅ Right way: [DESCRIPTION]\n\nI wasted [TIME/MONEY] before figuring this out. Learn from my mistakes.",
        category: "TUTORIAL" as const,
        tags: ["mistakes", "corrective", "educational"],
        useCase: "Corrective content drives engagement through controversy and provides genuine value.",
    },
    {
        title: "The Checklist Post",
        body: "The ultimate [TOPIC] checklist (bookmark this):\n\n□ [ITEM 1] — Why: [REASON]\n□ [ITEM 2] — Why: [REASON]\n□ [ITEM 3] — Why: [REASON]\n□ [ITEM 4] — Why: [REASON]\n□ [ITEM 5] — Why: [REASON]\n□ [ITEM 6] — Why: [REASON]\n□ [ITEM 7] — Why: [REASON]\n\nSave this and thank me later.",
        category: "TUTORIAL" as const,
        tags: ["checklist", "reference", "bookmarkable"],
        useCase: "Checklists have the highest save/bookmark rate of any content format on Reddit.",
    },
    {
        title: "The From-Zero Tutorial",
        body: "How to go from zero to [GOAL] with no experience (step by step):\n\nWeek 1: [FOUNDATION STEPS]\nWeek 2: [BUILDING STEPS]\nWeek 3: [INTERMEDIATE STEPS]\nWeek 4: [ADVANCED STEPS]\n\nBy the end you'll have: [CONCRETE OUTCOME]\n\nTotal cost: $[X] | Time: [Y] hours/week",
        category: "TUTORIAL" as const,
        tags: ["fromzero", "structured", "achievable"],
        useCase: "Zero-to-hero guides target beginners who are most likely to adopt new tools.",
    },
    {
        title: "The 'What Nobody Tells You' Tutorial",
        body: "What nobody tells you about [TOPIC]:\n\n1. [HIDDEN TRUTH 1] — And how to handle it\n2. [HIDDEN TRUTH 2] — Why it matters\n3. [HIDDEN TRUTH 3] — What to do instead\n4. [HIDDEN TRUTH 4] — The real cost\n5. [HIDDEN TRUTH 5] — When to ignore advice\n\nI learned all of this the hard way over [TIME].",
        category: "TUTORIAL" as const,
        tags: ["insider", "hidden", "valuable"],
        useCase: "Hidden knowledge content creates authority and drives engagement through exclusivity.",
    },
]

async function main() {
    console.log("Seeding templates...")

    // Clear existing system templates
    await prisma.template.deleteMany({
        where: { isSystemTemplate: true },
    })

    // Insert all templates
    for (const template of templates) {
        await prisma.template.create({
            data: {
                title: template.title,
                body: template.body,
                category: template.category,
                tags: template.tags,
                useCase: template.useCase,
                isSystemTemplate: true,
                usageCount: Math.floor(Math.random() * 900) + 100,
                avgEngagement: parseFloat((Math.random() * 4 + 1).toFixed(1)),
            },
        })
    }

    console.log(`Seeded ${templates.length} templates`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
