import OpenAI, { OpenAIError } from 'openai';
import { streamText } from 'ai';
import { google } from "@ai-sdk/google"
import { generateText } from "ai"

export const maxDuration = 30;
export async function POST(req: Request) {

  try {
    const { text } = await generateText({
      model: google('models/gemini-pro'),
      prompt: 'Write a vegetarian lasagna recipe for 4 people.',
    });

    return Response.json({ text })
  } catch (error) {
    console.log(error)

    if (error instanceof OpenAIError) {
      const { stack, message } = error
      return Response.json({ stack, message }, { status: 500 })
    } else {
      return Response.json(error)
    }
  }
}

