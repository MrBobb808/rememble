import { supabase } from "@/integrations/supabase/client";
import { CollaboratorRole } from "@/types/collaborator";
import { validateUUID } from "@/utils/validation";

export const createCollaborator = async (memorialId: string, email: string, role: CollaboratorRole) => {
  if (!validateUUID(memorialId)) {
    throw new Error("Invalid memorial ID");
  }

  const { data: newCollaborator, error: collaboratorError } = await supabase
    .from("memorial_collaborators")
    .insert({
      memorial_id: memorialId,
      email,
      role,
    })
    .select()
    .single();

  if (collaboratorError) {
    console.error("Error creating collaborator:", collaboratorError);
    throw new Error(collaboratorError.message);
  }

  return newCollaborator;
};

export const sendInvitation = async (
  email: string,
  memorialId: string,
  invitationToken: string,
  role: CollaboratorRole
) => {
  const { error: inviteError } = await supabase.functions.invoke("send-invitation", {
    body: {
      email,
      memorialId,
      invitationToken,
      role,
    },
  });

  if (inviteError) {
    console.error("Error sending invitation:", inviteError);
    throw new Error(inviteError.message);
  }
};

export const logInviteActivity = async (memorialId: string, email: string, role: CollaboratorRole) => {
  await supabase.from('memorial_activity_log').insert({
    memorial_id: memorialId,
    action_type: 'invite_sent',
    target_email: email,
    target_role: role,
  });
};