import { supabase } from "@/integrations/supabase/client";

export const createNewMemorial = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required to create a memorial");
  }

  try {
    // Create a new memorial
    const { data: memorialData, error: memorialError } = await supabase
      .from("memorials")
      .insert({
        name: "Untitled Memorial",
      })
      .select()
      .single();

    if (memorialError) {
      console.error("Error creating memorial:", memorialError);
      throw new Error(memorialError.message);
    }

    if (!memorialData) {
      throw new Error("No memorial data returned");
    }

    // Add the creator as an admin collaborator
    const { error: collaboratorError } = await supabase
      .from("memorial_collaborators")
      .insert({
        memorial_id: memorialData.id,
        user_id: userId,
        email: (await supabase.auth.getUser()).data.user?.email || "",
        role: "admin",
        invitation_accepted: true,
      });

    if (collaboratorError) {
      console.error("Error creating collaborator:", collaboratorError);
      // Clean up the memorial if collaborator creation fails
      await supabase.from("memorials").delete().eq("id", memorialData.id);
      throw new Error(collaboratorError.message);
    }

    console.log("Memorial and admin collaborator created successfully");
    return memorialData;
  } catch (error: any) {
    console.error("Error in createNewMemorial:", error);
    throw new Error(error.message || "Failed to create memorial");
  }
};