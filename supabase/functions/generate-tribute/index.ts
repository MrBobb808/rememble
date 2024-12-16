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
      memory: c.caption,
      relationship: c.relationship || 'Friend'
    }));

    // Create a more structured prompt
    const systemPrompt = `You are a compassionate writer creating heartfelt memorial tributes. 
    Create two sections:
    1. A deeply personal tribute summary (200-250 words) that:
       - References specific contributors by name and their relationship
       - Mentions specific memories they shared
       - Weaves together the memories into a cohesive narrative
       - Uses warm, empathetic language

    2. A memorial poem with exactly 4 stanzas that:
       - Has exactly 4 lines per stanza
       - Uses consistent rhythm and imagery
       - References specific shared memories
       - Reflects the person's impact on others
       - Has clear stanza breaks (use double line breaks)`;

    const userPrompt = `Here are the memories shared by loved ones:
    ${formattedMemories.map(m => `${m.contributor} (${m.relationship}) shared: "${m.memory}"`).join('\n')}

    Please create:
    1. A tribute summary that weaves these memories together
    2. A structured memorial poem in 4 stanzas`;

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