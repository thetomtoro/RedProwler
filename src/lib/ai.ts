import Anthropic from "@anthropic-ai/sdk"

let client: Anthropic | null = null

function getClient() {
    if (!client) {
        client = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        })
    }
    return client
}

export async function createMessage(
    model: string,
    systemPrompt: string,
    userMessage: string,
    maxTokens = 1024
): Promise<string> {
    const maxRetries = 3
    let lastError: Error | null = null

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await getClient().messages.create({
                model,
                max_tokens: maxTokens,
                system: systemPrompt,
                messages: [{ role: "user", content: userMessage }],
            })

            const textBlock = response.content.find((block) => block.type === "text")
            return textBlock?.text ?? ""
        } catch (error) {
            lastError = error as Error
            if (attempt < maxRetries - 1) {
                const delay = Math.pow(2, attempt) * 1000
                await new Promise((resolve) => setTimeout(resolve, delay))
            }
        }
    }

    throw lastError
}

export function createStreamingResponse(
    model: string,
    systemPrompt: string,
    userMessage: string,
    maxTokens = 2048
) {
    const stream = new ReadableStream({
        async start(controller) {
            try {
                const response = await getClient().messages.create({
                    model,
                    max_tokens: maxTokens,
                    system: systemPrompt,
                    messages: [{ role: "user", content: userMessage }],
                    stream: true,
                })

                for await (const event of response) {
                    if (
                        event.type === "content_block_delta" &&
                        event.delta.type === "text_delta"
                    ) {
                        controller.enqueue(new TextEncoder().encode(event.delta.text))
                    }
                }
                controller.close()
            } catch (error) {
                console.error("AI streaming error:", error)
                controller.enqueue(
                    new TextEncoder().encode(
                        "\n\n__ERROR__AI generation failed. Please try again."
                    )
                )
                controller.close()
            }
        },
    })

    return new Response(stream, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Transfer-Encoding": "chunked",
        },
    })
}
