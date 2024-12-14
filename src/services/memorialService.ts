import { supabase } from "@/integrations/supabase/client";

export const createNewMemorial = async () => {
  console.log("Creating new memorial...");
  
  // Get the current user's session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("User must be authenticated to create a memorial");
  }

  // Create the memorial
  const { data: memorialData, error: memorialError } = await supabase
    .from('memorials')
    .insert({ name: "In Loving Memory" })
    .select()
    .single();

  if (memorialError) {
    console.error("Error creating memorial:", memorialError);
    throw memorialError;
  }

  console.log("Memorial created:", memorialData);

  // Create the first collaborator as admin
  const { error: collaboratorError } = await supabase
    .from('memorial_collaborators')
    .insert({
      memorial_id: memorialData.id,
      user_id: session.user.id,
      email: session.user.email,
      role: 'admin',
      invitation_accepted: true
    });

  if (collaboratorError) {
    console.error("Error creating collaborator:", collaboratorError);
    throw collaboratorError;
  }

  console.log("Collaborator created successfully");
  return memorialData;
};