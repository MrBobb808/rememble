import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl, caption } = await req.json()
    console.log("Received request with caption:", caption)
    console.log("Image URL:", imageUrl)

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a compassionate AI assistant helping to enhance memorial photos with thoughtful reflections. Generate a brief, meaningful reflection that complements the provided caption without changing its original sentiment."
          },
          {
            role: "user",
            content: `Please provide a thoughtful and empathetic reflection about this memorial photo. Consider the caption: "${caption}". Your reflection should be personal and touching, about 2-3 sentences long.`
          }
        ],
        max_tokens: 300,
      }),
    })

    const data = await response.json()
    console.log("OpenAI API Response:", data)

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('No reflection generated')
    }

    const reflection = data.choices[0].message.content
    console.log("Generated reflection:", reflection)

    return new Response(
      JSON.stringify({ reflection }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error in generate-reflection function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})