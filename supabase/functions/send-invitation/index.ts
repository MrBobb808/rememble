import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, memorialId, invitationToken, role } = await req.json();
    
    // Validate inputs
    if (!email || !memorialId || !invitationToken || !role) {
      console.error("Missing required fields:", { email, memorialId, invitationToken, role });
      throw new Error("Missing required fields for invitation");
    }

    // Log the invitation details
    console.log("Processing invitation request:", {
      email,
      memorialId,
      invitationToken,
      role,
      timestamp: new Date().toISOString()
    });

    // For testing, we're just logging the invitation
    // In production, you would send an actual email here
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Invitation would be sent to ${email}`,
        details: {
          email,
          memorialId,
          invitationToken,
          role,
          timestamp: new Date().toISOString()
        }
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error("Error processing invitation:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});