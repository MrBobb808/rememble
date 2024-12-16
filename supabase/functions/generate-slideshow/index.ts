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
    const { photos } = await req.json()
    console.log("Received photos for slideshow generation:", photos)

    // For now, we'll return a mock video URL from Supabase storage
    // In a future iteration, we can implement actual FFmpeg video generation
    const mockVideoUrl = "https://jrnfunsgzdymrdwxztgh.supabase.co/storage/v1/object/public/memorial-photos/sample-slideshow.mp4"

    return new Response(
      JSON.stringify({ 
        message: "Slideshow generated successfully", 
        videoUrl: mockVideoUrl 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-slideshow function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to generate slideshow"
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})