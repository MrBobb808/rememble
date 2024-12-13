import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, caption } = await req.json();
    console.log("Generating reflection for:", { imageUrl, caption });

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a compassionate AI that generates thoughtful, warm reflections for memorial photos. Keep responses brief (2-3 sentences) and focus on the emotional connection and memories shown in both the image and caption."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Generate a warm, thoughtful reflection for this memorial photo. Caption: "${caption}"`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await openAIResponse.json();
    console.log("OpenAI API Response:", data);

    if (!data.choices?.[0]?.message?.content) {
      console.error("Unexpected OpenAI response format:", data);
      throw new Error("Invalid response format from OpenAI");
    }

    const reflection = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ reflection }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error generating reflection:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});