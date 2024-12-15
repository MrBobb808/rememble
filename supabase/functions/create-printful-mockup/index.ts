import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const PRINTFUL_API_KEY = Deno.env.get('PRINTFUL_API_KEY')

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
    if (!PRINTFUL_API_KEY) {
      throw new Error('Printful API key not configured')
    }

    const { type, photos } = await req.json()
    console.log('Received request:', { type, photoCount: photos?.length })

    // Validate input
    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      throw new Error('No photos provided for creating the mockup')
    }

    if (!type || !['photo-book', 'quilt'].includes(type)) {
      throw new Error('Invalid product type specified')
    }

    const encodedKey = btoa(PRINTFUL_API_KEY)
    
    // Create mockup task based on product type
    const variantId = type === 'photo-book' ? 438 : 439 // Example variant IDs
    console.log('Creating mockup with variant ID:', variantId)
    
    const mockupResponse = await fetch("https://api.printful.com/mockup-generator/create-task", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${encodedKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variant_ids: [variantId],
        files: photos.map(photo => ({
          type: "default",
          url: photo.url
        })),
      }),
    })

    if (!mockupResponse.ok) {
      const errorData = await mockupResponse.json()
      console.error('Mockup creation failed:', errorData)
      throw new Error(`Failed to create mockup: ${errorData.message || 'Unknown error'}`)
    }

    const mockupData = await mockupResponse.json()
    console.log('Mockup created successfully:', mockupData)

    return new Response(
      JSON.stringify({
        mockupUrl: mockupData.result.mockups[0].mockup_url,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in create-printful-mockup:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})