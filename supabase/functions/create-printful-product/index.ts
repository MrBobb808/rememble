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
    const { type, photos } = await req.json()

    if (!PRINTFUL_API_KEY) {
      throw new Error('Printful API key not configured')
    }

    const encodedKey = btoa(PRINTFUL_API_KEY)
    
    // Create mockup task based on product type
    const variantId = type === 'photo-book' ? 1234 : 5678 // Replace with actual Printful variant IDs
    
    const mockupResponse = await fetch("https://api.printful.com/mockup-generator/create-task", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${encodedKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variant_ids: [variantId],
        files: photos.map((photo: any) => ({
          type: "default",
          url: photo.url
        })),
      }),
    })

    const mockupData = await mockupResponse.json()

    // Create sync product
    const productResponse = await fetch("https://api.printful.com/store/products", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${encodedKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sync_product: {
          name: type === 'photo-book' ? "Memorial Photo Book" : "Memorial Quilt",
          thumbnail: mockupData.mockups[0].mockup_url,
        },
        sync_variants: [
          {
            variant_id: variantId,
            files: photos.map((photo: any) => ({
              type: "default",
              url: photo.url
            })),
          },
        ],
      }),
    })

    const productData = await productResponse.json()

    return new Response(
      JSON.stringify({
        checkoutUrl: `https://www.printful.com/dashboard/sync-products/${productData.result.id}`,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})