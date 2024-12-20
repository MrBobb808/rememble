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
    const { caption, imageContext, memorialId } = await req.json()
    console.log("Generating reflection for memorial:", memorialId)

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch survey data if available
    const { data: surveyData } = await supabaseClient
      .from('memorial_surveys')
      .select('*')
      .eq('memorial_id', memorialId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Construct prompt based on available data
    let promptContext = `Generate a thoughtful and meaningful reflection about this memorial photo.`
    
    if (surveyData) {
      promptContext += `\n\nContext about ${surveyData.name}:
      - Key Memories: ${surveyData.key_memories || 'Not provided'}
      - Family Messages: ${surveyData.family_messages || 'Not provided'}
      - Personality Traits: ${surveyData.personality_traits || 'Not provided'}`

      if (surveyData.preferred_tone) {
        promptContext += `\n\nPlease maintain a ${surveyData.preferred_tone} tone in the reflection.`
      }
    }

    promptContext += `\n\nPhoto Context:
    - Caption: "${caption}"
    ${imageContext ? `- Visual Context: ${imageContext}` : ''}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a compassionate AI assistant helping to enhance memorial photos with thoughtful reflections. Generate meaningful additions that complement the provided information while maintaining a respectful and empathetic tone."
          },
          {
            role: "user",
            content: promptContext
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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-reflection function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})