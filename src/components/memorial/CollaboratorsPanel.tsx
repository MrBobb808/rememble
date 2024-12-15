import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InviteDialog } from "./InviteDialog";
import CollaboratorsManagement from "../CollaboratorsManagement";
import { useSearchParams } from "react-router-dom";
import { useCollaborators } from "@/hooks/useCollaborators";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const CollaboratorsPanel = () => {
  const [searchParams] = useSearchParams();
  const memorialId = searchParams.get("id");
  const [isAdmin, setIsAdmin] = useState(false);
  const { collaborators } = useCollaborators(memorialId || "");

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !memorialId) return;

      const { data: userRole } = await supabase
        .from("memorial_collaborators")
        .select("role")
        .eq("memorial_id", memorialId)
        .eq("user_id", user.id)
        .single();

      setIsAdmin(userRole?.role === "admin");
    };

    checkUserRole();
  }, [memorialId]);

  if (!memorialId) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-memorial-blue" />
        <h3 className="font-medium text-gray-800">Collaborators</h3>
      </div>
      
      <div className="flex -space-x-2 mb-4">
        {collaborators.slice(0, 3).map((collaborator, index) => (
          <Avatar key={index} className="border-2 border-white">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>{collaborator.email.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        ))}
        {collaborators.length > 3 && (
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full border-2 border-white bg-memorial-gray-light hover:bg-memorial-gray"
          >
            <span className="text-sm font-medium">+{collaborators.length - 3}</span>
          </Button>
        )}
      </div>

      {isAdmin && (
        <div className="space-y-2">
          <InviteDialog memorialId={memorialId} />
          <CollaboratorsManagement memorialId={memorialId} />
        </div>
      )}
    </div>
  );
};