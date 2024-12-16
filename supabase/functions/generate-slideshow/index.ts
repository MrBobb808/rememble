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
    const { photos } = await req.json()
    console.log("Received photos for slideshow generation:", photos)

    // TODO: Implement actual video generation with FFmpeg
    // For now, return a mock video URL from Supabase storage
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