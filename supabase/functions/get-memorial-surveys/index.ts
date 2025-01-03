import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function isValidUUID(uuid: string): boolean {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { memorial_id } = await req.json()
    console.log("Processing request for memorial:", memorial_id)

    // Validate UUID
    if (!memorial_id || !isValidUUID(memorial_id)) {
      console.error("Invalid memorial ID:", memorial_id)
      return new Response(
        JSON.stringify({ error: "Invalid or missing memorial_id" }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Query the database
    const { data: surveys, error: surveyError } = await supabaseClient
      .from('memorial_surveys')
      .select('*, memorials!memorial_surveys_memorial_id_fkey(name)')
      .eq('memorial_id', memorial_id)
      .order('created_at', { ascending: false })

    if (surveyError) {
      console.error("Error fetching surveys:", surveyError)
      return new Response(
        JSON.stringify({ error: surveyError.message }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Successfully retrieved ${surveys?.length ?? 0} surveys`)

    return new Response(
      JSON.stringify({ success: true, data: surveys }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Unexpected error:", error)
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})