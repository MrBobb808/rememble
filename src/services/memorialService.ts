import { supabase } from "@/integrations/supabase/client";

export const createNewMemorial = async (userId: string) => {
  const { data: memorialData, error: memorialError } = await supabase
    .from('memorials')
    .insert({ name: "In Loving Memory" })
    .select()
    .single();

  if (memorialError) throw memorialError;

  const { error: collaboratorError } = await supabase
    .from('memorial_collaborators')
    .insert({
      memorial_id: memorialData.id,
      user_id: userId,
      email: userId,
      role: 'admin',
      invitation_accepted: true
    });

  if (collaboratorError) throw collaboratorError;

  return memorialData;
};