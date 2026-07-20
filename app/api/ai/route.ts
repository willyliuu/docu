import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { prompt, action, context } = await req.json();

    let systemMessage = 'You are a helpful AI writing assistant embedded in a markdown editor. Return ONLY the requested markdown content. Do not include introductory or concluding remarks (like "Here is the summary:" or "Sure!").';
    
    if (action === 'summarize') {
      systemMessage += ' Summarize the provided text concisely while preserving the main ideas. Keep it as markdown.';
    } else if (action === 'fix_grammar') {
      systemMessage += ' Fix the grammar, spelling, and punctuation of the provided text. Keep the original tone and markdown formatting.';
    } else if (action === 'continue') {
      systemMessage += ' Continue writing the next logical paragraph or section based on the context provided. Write in the same tone and format as the context.';
    } else if (action === 'explain') {
      systemMessage += ' Explain the provided code or text clearly and concisely.';
    }

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemMessage,
      prompt: `Context (the full note for reference):\n${context || '(No context)'}\n\nSelected Text to act upon:\n${prompt}`
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('AI Route Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process AI request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
