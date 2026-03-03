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
