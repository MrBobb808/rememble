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
    const { captions } = await req.json()
    console.log("Received data for tribute generation:", captions)

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Format the input data for the prompt
    const formattedMemories = captions.map(c => ({
      contributor: c.contributor || 'Anonymous',
      memory: c.caption
    }));

    // Create a structured prompt
    const systemPrompt = `You are a compassionate AI tasked with creating a heartfelt memorial tribute. 
    Create two sections:
    1. A deeply personal tribute summary that references specific contributors and their shared memories
    2. A structured memorial poem with exactly 4 stanzas of 4 lines each

    The tribute summary should:
    - Reference contributors by name
    - Mention specific memories they shared
    - Capture the essence of who the person was to their loved ones
    - Be approximately 200 words

    The poem should:
    - Be structured in exactly 4 stanzas
    - Have exactly 4 lines per stanza
    - Use metaphor and imagery
    - Reflect the person's impact and legacy
    - Be emotionally resonant`;

    const userPrompt = `Here are the memories shared by loved ones:
    ${formattedMemories.map(m => `${m.contributor} shared: "${m.memory}"`).join('\n')}

    Please create:
    1. A heartfelt tribute summary referencing these specific memories and contributors
    2. A memorial poem in 4 stanzas`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    const data = await response.json()
    console.log("OpenAI API Response:", data)

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('No tribute generated')
    }

    // Split the response into summary and poem sections
    const content = data.choices[0].message.content
    const [summary, poem] = content.split('\n\n').filter(Boolean)

    return new Response(
      JSON.stringify({ summary, poem }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-tribute function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})