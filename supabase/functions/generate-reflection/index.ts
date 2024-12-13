import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0'

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

    if (!imageUrl) {
      throw new Error('Image URL is required')
    }

    // Clean the URL by removing any trailing colons
    const cleanImageUrl = imageUrl.replace(/:+$/, '')

    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    console.log('Generating reflection for image:', cleanImageUrl)
    console.log('Caption:', caption)

    const response = await openai.createChatCompletion({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Please provide a thoughtful and empathetic reflection about this memorial photo. Consider the caption: "${caption}". Your reflection should be personal and touching, about 2-3 sentences long.`
            },
            {
              type: "image_url",
              image_url: {
                url: cleanImageUrl,
                detail: "low"
              }
            }
          ]
        }
      ],
      max_tokens: 300,
    })

    const reflection = response.data.choices[0]?.message?.content || ''
    console.log('Generated reflection:', reflection)

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
    console.error('Error:', error)
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