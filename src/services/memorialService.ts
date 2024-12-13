import { supabase } from "@/integrations/supabase/client";

// Using a fixed UUID for development testing
const DEVELOPMENT_USER_ID = "00000000-0000-0000-0000-000000000000";

export const createNewMemorial = async (userId: string) => {
  console.log("Creating new memorial...");
  
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

  const { error: collaboratorError } = await supabase
    .from('memorial_collaborators')
    .insert({
      memorial_id: memorialData.id,
      user_id: DEVELOPMENT_USER_ID,
      email: "development@example.com",
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