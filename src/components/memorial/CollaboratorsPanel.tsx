import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InviteDialog } from "./InviteDialog";
import CollaboratorsManagement from "../CollaboratorsManagement";
import { useSearchParams } from "react-router-dom";

export const CollaboratorsPanel = () => {
  const [searchParams] = useSearchParams();
  const memorialId = searchParams.get("id");

  if (!memorialId) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-memorial-blue" />
        <h3 className="font-medium text-gray-800">Collaborators</h3>
      </div>
      
      <div className="flex -space-x-2 mb-4">
        <Avatar className="border-2 border-white">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Avatar className="border-2 border-white">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <Avatar className="border-2 border-white">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>CD</AvatarFallback>
        </Avatar>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full border-2 border-white bg-memorial-gray-light hover:bg-memorial-gray"
        >
          <span className="text-sm font-medium">+3</span>
        </Button>
      </div>

      <div className="space-y-2">
        <InviteDialog memorialId={memorialId} />
        <CollaboratorsManagement memorialId={memorialId} />
      </div>
    </div>
  );
};