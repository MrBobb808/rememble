import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { caption } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Changed from gpt-4o to gpt-4o-mini for faster results
      messages: [
        {
          role: "system",
          content: "You are a compassionate assistant helping to enhance memorial photos with thoughtful reflections. Generate a brief, meaningful addition that complements the provided caption without changing its original sentiment.",
        },
        {
          role: "user",
          content: `Photo caption: "${caption}"\nPlease generate a thoughtful, brief reflection (2-3 sentences) that enhances this memory while maintaining a respectful and compassionate tone.`,
        },
      ],
      max_tokens: 150,
    });

    const reflection = completion.choices[0].message.content;

    return new Response(JSON.stringify({ reflection }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating reflection:", error);
    return new Response(JSON.stringify({ error: "Failed to generate reflection" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}