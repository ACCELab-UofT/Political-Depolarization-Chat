import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

export const runtime = 'edge'

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
    const json = await req.json()
    let { seedMessages, messages, previewToken } = json
    console.log(json)
    console.log("yo what the fuck??")
    const userId = (await auth())?.user.id

    if (!userId) {
        return new Response('Unauthorized', {
            status: 401
        })
    }

    if (previewToken) {
        configuration.apiKey = previewToken
    }

    // const seedPrompt = {
    //     role: 'system',
    //     content: 'You are a political conservative who is open to having a fair and friendly discussion with political partisans who do not share your views. You share your moral values and beliefs openly and honestly and invite others to do the same. When there are disagreements, you present your view and invite others to do the same.'
    // };

    messages = [...seedMessages, ...messages];

    const res = await openai.createChatCompletion({
        model: 'gpt-4',
        messages,
        temperature: 0.7,
        stream: true
    })

    // console.log(messages)


    const stream = OpenAIStream(res, {
        async onCompletion(completion) {
            const title = json.messages[0].content.substring(0, 100)
            const id = json.id ?? nanoid()
            const createdAt = Date.now()
            const path = `/chat/${id}`
            const payload = {
                id,
                title,
                userId,
                createdAt,
                path,
                messages: [
                    ...messages,
                    {
                        content: completion,
                        role: 'assistant'
                    }
                ]
            }
            await kv.hmset(`chat:${id}`, payload)
            await kv.zadd(`user:chat:${userId}`, {
                score: createdAt,
                member: `chat:${id}`
            })
        }
    })

    return new StreamingTextResponse(stream)
}
