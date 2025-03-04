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
      throw new Error('No photos provided for creating the product')
    }

    if (!type || !['photo-book', 'quilt'].includes(type)) {
      throw new Error('Invalid product type specified')
    }

    const encodedKey = btoa(PRINTFUL_API_KEY)
    
    // Create sync product based on product type
    const variantId = type === 'photo-book' ? 438 : 439 // Example variant IDs
    console.log('Creating product with variant ID:', variantId)
    
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
          thumbnail: photos[0].url,
        },
        sync_variants: [
          {
            variant_id: variantId,
            files: photos.map(photo => ({
              type: "default",
              url: photo.url
            })),
          },
        ],
      }),
    })

    if (!productResponse.ok) {
      const errorData = await productResponse.json()
      console.error('Product creation failed:', errorData)
      throw new Error(`Failed to create product: ${errorData.message || 'Unknown error'}`)
    }

    const productData = await productResponse.json()
    console.log('Product created successfully:', productData)

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
    console.error('Error in create-printful-product:', error)
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