import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, memorialId, invitationToken, role } = await req.json();
    console.log("Received invitation request:", { email, memorialId, role });

    // For testing purposes, we'll just log the invitation details
    console.log("Would send email to:", email);
    console.log("Memorial ID:", memorialId);
    console.log("Invitation Token:", invitationToken);
    console.log("Role:", role);

    // In production, you would send an actual email here
    // const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    // await resend.emails.send({...})

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Invitation would be sent to ${email} (disabled for testing)` 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error("Error in send-invitation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
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