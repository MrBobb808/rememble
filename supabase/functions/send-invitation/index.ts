import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  memorialId: string;
  invitationToken: string;
  role: string;
}

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, memorialId, invitationToken, role }: InvitationRequest = await req.json();

    // Get memorial details
    const { data: memorial } = await supabase
      .from("memorials")
      .select("name")
      .eq("id", memorialId)
      .single();

    if (!memorial) {
      throw new Error("Memorial not found");
    }

    // Generate invitation link
    const inviteLink = `${req.headers.get("origin")}/accept-invitation?token=${invitationToken}&memorial=${memorialId}`;

    // Send email using Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Memorial <onboarding@resend.dev>",
        to: [email],
        subject: `You've been invited to collaborate on a memorial`,
        html: `
          <h2>You've been invited to collaborate</h2>
          <p>You have been invited as a ${role} to collaborate on the memorial "${memorial.name}".</p>
          <p>Click the link below to accept the invitation:</p>
          <a href="${inviteLink}">${inviteLink}</a>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Failed to send email: ${error}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending invitation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);