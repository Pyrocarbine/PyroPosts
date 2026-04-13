import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request): Promise<Response> {
    const { content } = await req.json(); 
    if (!content) {
        return new Response(JSON.stringify({ error: "Content is required" }), { status: 400 });
    }
    const chatCompletion = await client.chat.completions.create({
        messages: [{ role: 'user', content: `Your goal is to create a 3-4 sentence intorudction/summar for the following blog post content. 
            Focus on the main points and key takeaways, and provide a concise overview that captures the essence of the post. 
            Do not include any personal opinions or additional information that is not present in the original content.
            The following are the html content of this blog post: \n\n${content}` }],
        model: 'gpt-5-nano',
    });
    return new Response(JSON.stringify({ summary: chatCompletion.choices[0].message.content }), { status: 200 });
}
