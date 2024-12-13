import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl, caption } = await req.json()
    console.log("Generating reflection for:", { imageUrl, caption })

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: "You are a compassionate AI that generates thoughtful, warm reflections for memorial photos. Keep responses brief (2-3 sentences) and focus on the emotional connection and memories."
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
                image_url: imageUrl
              }
            ]
          }
        ],
      }),
    })

    const data = await response.json()
    console.log("OpenAI API Response:", data)

    return new Response(
      JSON.stringify({ reflection: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Error generating reflection:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})