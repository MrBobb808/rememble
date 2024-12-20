import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { memorialId, name, keyMemories, familyMessages, personalityTraits, preferredTone } = await req.json()
    console.log("Received survey submission for memorial:", memorialId)

    // Store the survey response
    const { data: surveyData, error: surveyError } = await supabaseClient
      .from('memorial_surveys')
      .insert({
        memorial_id: memorialId,
        name,
        key_memories: keyMemories,
        family_messages: familyMessages,
        personality_traits: personalityTraits,
        preferred_tone: preferredTone
      })
      .select()
      .single()

    if (surveyError) {
      console.error("Error storing survey:", surveyError)
      throw surveyError
    }

    console.log("Survey stored successfully:", surveyData)

    return new Response(
      JSON.stringify({ success: true, data: surveyData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Error in handle-survey-submission:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})