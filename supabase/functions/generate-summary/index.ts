import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { memorialId } = await req.json()

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch all photos and captions for this memorial
    const { data: photos, error: fetchError } = await supabaseClient
      .from('memorial_photos')
      .select('caption, ai_reflection')
      .eq('memorial_id', memorialId)
      .order('position')

    if (fetchError) {
      throw new Error(`Error fetching photos: ${fetchError.message}`)
    }

    // Prepare the context for OpenAI
    const memories = photos.map(p => `Memory: ${p.caption}\nReflection: ${p.ai_reflection}`).join('\n\n')

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
            content: "You are a compassionate AI that generates heartfelt summaries of people's lives based on shared memories. Create a warm, meaningful paragraph that captures the essence of their life and impact on others."
          },
          {
            role: "user",
            content: `Based on these shared memories, generate a beautiful summary of this person's life and legacy:\n\n${memories}`
          }
        ],
      }),
    })

    const data = await response.json()
    console.log("OpenAI API Response:", data)

    // Update the memorial with the generated summary
    const { error: updateError } = await supabaseClient
      .from('memorials')
      .update({ 
        summary: data.choices[0].message.content,
        is_complete: true 
      })
      .eq('id', memorialId)

    if (updateError) {
      throw new Error(`Error updating memorial: ${updateError.message}`)
    }

    return new Response(
      JSON.stringify({ summary: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Error generating summary:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})