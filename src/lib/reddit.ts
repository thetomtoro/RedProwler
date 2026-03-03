interface RedditPost {
    id: string
    name: string
    title: string
    selftext: string
    author: string
    subreddit: string
    permalink: string
    score: number
    num_comments: number
    created_utc: number
    link_flair_text?: string
}

interface RedditComment {
    id: string
    name: string
    body: string
    author: string
    subreddit: string
    permalink: string
    score: number
    created_utc: number
    link_title?: string
}

interface RedditListing<T> {
    kind: string
    data: {
        after: string | null
        children: Array<{
            kind: string
            data: T
        }>
    }
}

class RedditClient {
    private accessToken: string | null = null
    private tokenExpiresAt = 0
    private requestCount = 0
    private windowStart = 0
    private readonly maxRequestsPerMinute = 60

    private async ensureToken(): Promise<string> {
        const now = Date.now()
        if (this.accessToken && now < this.tokenExpiresAt) {
            return this.accessToken
        }

        const clientId = process.env.REDDIT_CLIENT_ID!
        const clientSecret = process.env.REDDIT_CLIENT_SECRET!
        const userAgent = process.env.REDDIT_USER_AGENT || "RedProwler/1.0"

        const response = await fetch("https://www.reddit.com/api/v1/access_token", {
            method: "POST",
            headers: {
                Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": userAgent,
            },
            body: "grant_type=client_credentials",
        })

        if (!response.ok) {
            throw new Error(`Reddit auth failed: ${response.status}`)
        }

        const data = await response.json()
        this.accessToken = data.access_token
        this.tokenExpiresAt = now + (data.expires_in - 60) * 1000
        return this.accessToken!
    }

    private async throttle(): Promise<void> {
        const now = Date.now()
        if (now - this.windowStart > 60000) {
            this.requestCount = 0
            this.windowStart = now
        }
        if (this.requestCount >= this.maxRequestsPerMinute) {
            const waitTime = 60000 - (now - this.windowStart)
            await new Promise((resolve) => setTimeout(resolve, waitTime))
            this.requestCount = 0
            this.windowStart = Date.now()
        }
        this.requestCount++
    }

    private async request<T>(endpoint: string): Promise<T> {
        await this.throttle()
        const token = await this.ensureToken()
        const userAgent = process.env.REDDIT_USER_AGENT || "RedProwler/1.0"

        const response = await fetch(`https://oauth.reddit.com${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "User-Agent": userAgent,
            },
        })

        if (!response.ok) {
            throw new Error(`Reddit API error: ${response.status} ${response.statusText}`)
        }

        return response.json()
    }

    async fetchSubredditPosts(
        subreddit: string,
        limit = 25,
        after?: string
    ): Promise<{ posts: RedditPost[]; after: string | null }> {
        const params = new URLSearchParams({ limit: limit.toString(), sort: "new" })
        if (after) params.set("after", after)

        const listing = await this.request<RedditListing<RedditPost>>(
            `/r/${subreddit}/new?${params}`
        )

        return {
            posts: listing.data.children.map((c) => c.data),
            after: listing.data.after,
        }
    }

    async fetchSubredditComments(
        subreddit: string,
        limit = 25
    ): Promise<RedditComment[]> {
        const listing = await this.request<RedditListing<RedditComment>>(
            `/r/${subreddit}/comments?limit=${limit}`
        )

        return listing.data.children.map((c) => c.data)
    }

    async searchPosts(
        query: string,
        subreddit?: string,
        limit = 25
    ): Promise<RedditPost[]> {
        const params = new URLSearchParams({
            q: query,
            limit: limit.toString(),
            sort: "new",
            type: "link",
        })
        if (subreddit) params.set("restrict_sr", "true")

        const path = subreddit
            ? `/r/${subreddit}/search?${params}`
            : `/search?${params}`

        const listing = await this.request<RedditListing<RedditPost>>(path)
        return listing.data.children.map((c) => c.data)
    }
}

export const redditClient = new RedditClient()

export type { RedditPost, RedditComment }
