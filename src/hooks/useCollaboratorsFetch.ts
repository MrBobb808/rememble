import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useCollaboratorsState } from "./useCollaboratorsState";

export const useCollaboratorsFetch = (memorialId: string) => {
  const { setCollaborators, setIsLoading } = useCollaboratorsState();
  const { toast } = useToast();

  const fetchCollaborators = async () => {
    if (!memorialId) {
      console.log("No memorialId provided to useCollaborators");
      setIsLoading(false);
      return;
    }

    console.log("Fetching collaborators for memorial:", memorialId);
    try {
      const { data, error } = await supabase
        .from("memorial_collaborators")
        .select("*")
        .eq("memorial_id", memorialId);

      if (error) {
        console.error("Error fetching collaborators:", error);
        toast({
          title: "Error fetching collaborators",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log("Fetched collaborators:", data);
      setCollaborators(data || []);
    } catch (error) {
      console.error("Unexpected error fetching collaborators:", error);
      toast({
        title: "Error fetching collaborators",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborators();

    const channel = supabase
      .channel("collaborators-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "memorial_collaborators",
          filter: `memorial_id=eq.${memorialId}`,
        },
        (payload) => {
          console.log("Collaborators change detected:", payload);
          fetchCollaborators();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [memorialId]);

  return { fetchCollaborators };
};