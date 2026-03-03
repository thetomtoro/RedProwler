interface ProductContext {
    name: string
    description: string
    targetAudience?: string
    keywords: string[]
}

interface LeadContext {
    title?: string
    body: string
    subreddit: string
    author: string
    redditScore: number
    commentCount: number
}

export function getSubredditRecommendationPrompt(product: ProductContext): string {
    return `You are a Reddit marketing expert. Based on the product description below, recommend 10 relevant subreddits where the target audience is likely active.

PRODUCT:
Name: ${product.name}
Description: ${product.description}
Target Audience: ${product.targetAudience || "Not specified"}
Keywords: ${product.keywords.join(", ")}

REQUIREMENTS:
- Recommend subreddits where users discuss problems this product solves
- Include a mix of large (100K+), medium (10K-100K), and niche (<10K) subreddits
- Avoid overly broad subreddits like r/AskReddit
- For each subreddit, explain WHY it's relevant

Respond in JSON format:
{
  "subreddits": [
    {
      "name": "subreddit_name",
      "reason": "Why this subreddit is relevant",
      "subscriberEstimate": "100K+",
      "relevanceScore": 0.9
    }
  ]
}`
}

export function getLeadScoringPrompt(lead: LeadContext, product: ProductContext): string {
    return `You are an expert at identifying sales leads from Reddit posts. Score the following Reddit post for how relevant it is to the given product.

PRODUCT:
Name: ${product.name}
Description: ${product.description}
Keywords: ${product.keywords.join(", ")}

REDDIT POST:
Subreddit: r/${lead.subreddit}
Title: ${lead.title || "N/A"}
Body: ${lead.body}
Score: ${lead.redditScore} | Comments: ${lead.commentCount}

SCORING CRITERIA:
- Is the author asking for a solution this product provides? (high intent)
- Are they expressing frustration with a problem this product solves? (pain point)
- Are they comparing or looking for alternatives? (buying signal)
- Is this just a general discussion with low commercial intent? (low relevance)

Respond in JSON format:
{
  "score": 0.85,
  "reason": "Brief explanation of the score",
  "intentSignals": ["asking_for_recommendation", "pain_point_match"],
  "sentiment": "QUESTION"
}`
}

export function getReplyGenerationPrompt(
    lead: LeadContext,
    product: ProductContext,
    tone: string = "helpful"
): string {
    return `You are a skilled Reddit community member who also happens to know about a relevant product. Write a natural, helpful reply to the following Reddit post.

CONTEXT:
Subreddit: r/${lead.subreddit}
Post Title: ${lead.title || "N/A"}
Post Body: ${lead.body}

YOUR PRODUCT (mention naturally, not as an ad):
Name: ${product.name}
Description: ${product.description}

TONE: ${tone}

RULES:
- Be genuinely helpful first. Address the poster's actual question or pain point.
- If appropriate, mention your product as ONE option among others.
- Never sound like an advertisement. Be authentic and conversational.
- Match the subreddit's culture and communication style.
- Keep it concise (2-4 paragraphs max).
- Include a personal touch or anecdote if relevant.
- DO NOT use phrases like "I stumbled upon" or "full disclosure" — these are overused Reddit marketing clichés.

Write the reply:`
}

export function getConversationStarterPrompt(lead: LeadContext, product: ProductContext): string {
    return `Generate 3 different conversation starters for engaging with this Reddit post. Each should take a different approach.

POST:
Subreddit: r/${lead.subreddit}
Title: ${lead.title || "N/A"}
Body: ${lead.body}

PRODUCT CONTEXT (for natural mentions):
${product.name}: ${product.description}

Generate 3 approaches:
1. HELPFUL: Address their question directly, mention product only if very relevant
2. PERSONAL STORY: Share a relevant experience that leads naturally to the product
3. EDUCATIONAL: Provide value/insight related to their topic, product as supporting resource

Respond in JSON format:
{
  "starters": [
    { "approach": "helpful", "reply": "..." },
    { "approach": "personal_story", "reply": "..." },
    { "approach": "educational", "reply": "..." }
  ]
}`
}

export function getDMTemplatePrompt(lead: LeadContext, product: ProductContext): string {
    return `Write a friendly, non-spammy Reddit DM to this user based on their post. The goal is to start a genuine conversation, not to hard-sell.

THEIR POST:
Subreddit: r/${lead.subreddit}
Title: ${lead.title || "N/A"}
Body: ${lead.body}

YOUR PRODUCT:
${product.name}: ${product.description}

RULES:
- Reference their specific post/question
- Offer genuine help or insight
- Mention product only if highly relevant, and as a casual suggestion
- Keep it short (3-5 sentences)
- End with an open question to encourage reply

Write the DM:`
}

export function getTemplatePersonalizationPrompt(
    templateBody: string,
    product: ProductContext
): string {
    return `Personalize the following Reddit post template for the given product. Keep the template's structure and proven engagement patterns, but customize the content.

TEMPLATE:
${templateBody}

PRODUCT:
Name: ${product.name}
Description: ${product.description}
Target Audience: ${product.targetAudience || "Not specified"}

RULES:
- Maintain the template's format and structure
- Replace generic examples with product-specific ones
- Keep the engaging hooks and question patterns
- Make it sound natural, not templated

Write the personalized post:`
}

export function getProductDescriptionPrompt(url: string, rawText: string): string {
    return `Based on the following product URL and page content, generate a concise product description, target audience, and relevant keywords.

URL: ${url}
Page Content: ${rawText}

Respond in JSON format:
{
  "description": "A 2-3 sentence product description",
  "targetAudience": "Who would benefit from this product",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`
}
