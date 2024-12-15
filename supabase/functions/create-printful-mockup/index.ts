import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const PRINTFUL_API_KEY = Deno.env.get('PRINTFUL_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!PRINTFUL_API_KEY) {
      throw new Error('Printful API key not configured')
    }

    const { type, photos, variantId } = await req.json()
    console.log('Received request:', { type, photoCount: photos?.length, variantId })

    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      throw new Error('No photos provided for creating the mockup')
    }

    if (!type || !['photo-book', 'quilt'].includes(type)) {
      throw new Error('Invalid product type specified')
    }

    if (!variantId) {
      throw new Error('No variant ID specified')
    }

    const encodedKey = btoa(PRINTFUL_API_KEY)
    
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

    const mockupData = await mockupResponse.json()
    console.log('Printful API response:', mockupData)

    if (!mockupResponse.ok) {
      const errorMessage = mockupData.error?.message || mockupData.error || 'Unknown error from Printful API'
      console.error('Printful API error:', errorMessage)
      throw new Error(errorMessage)
    }

    return new Response(
      JSON.stringify({
        mockupUrl: mockupData.result?.mockups?.[0]?.mockup_url,
        result: mockupData.result,
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
        status: 400,
      },
    )
  }
})