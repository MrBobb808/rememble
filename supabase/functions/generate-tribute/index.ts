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
    console.log("Received captions for tribute generation:", captions)

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant tasked with creating a heartfelt tribute for a completed memorial. Generate both a personalized tribute summary and a structured poem based on the provided memories. The summary should reference specific contributors and their shared memories. The poem should be structured in clear stanzas."
          },
          {
            role: "user",
            content: `Create a heartfelt tribute and poem based on these memories:\n\n${captions.map(c => c).join('\n')}\n\nGenerate two sections:\n1. A deeply personal tribute summary that references specific contributors and their memories, highlighting the impact and legacy of the loved one.\n2. A structured poem (3-4 stanzas, 4 lines each) capturing the essence of their life and the shared memories.`
          }
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

    // Parse the response to separate summary and poem
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