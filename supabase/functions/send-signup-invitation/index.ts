import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InviteRequest {
  email: string;
  token: string;
  role: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, token, role }: InviteRequest = await req.json();
    
    // Construct the signup URL
    const signupUrl = `${req.headers.get("origin")}/auth?token=${token}`;
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Memories <onboarding@resend.dev>",
        to: [email],
        subject: "You've been invited to join a memorial",
        html: `
          <h2>You've been invited to join a memorial</h2>
          <p>You've been invited as a ${role}. Click the link below to join:</p>
          <p><a href="${signupUrl}">Join Memorial</a></p>
          <p>This link will expire in 7 days.</p>
        `,
      }),
    });

    const data = await res.json();
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: res.ok ? 200 : 400,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});