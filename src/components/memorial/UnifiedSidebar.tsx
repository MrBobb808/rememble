import { Users, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InviteDialog } from "./InviteDialog";
import CollaboratorsManagement from "../CollaboratorsManagement";
import { useSearchParams } from "react-router-dom";

interface Photo {
  id: number;
  url: string;
  caption: string;
}

interface UnifiedSidebarProps {
  photos: Photo[];
}

const UnifiedSidebar = ({ photos }: UnifiedSidebarProps) => {
  const [searchParams] = useSearchParams();
  const memorialId = searchParams.get("id");

  if (!memorialId) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6">
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

      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-memorial-blue" />
          <h3 className="font-medium text-gray-800">Recent Activity</h3>
        </div>
        <div className="space-y-4">
          {photos.length > 0 ? (
            photos.slice(-3).map((photo, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 text-sm text-gray-600 animate-fade-in"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={photo.url} />
                  <AvatarFallback>PH</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="line-clamp-2">{photo.caption}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {index === 0 ? "Just now" : index === 1 ? "Yesterday" : "Last week"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <Clock className="w-8 h-8 text-memorial-gray-dark/30 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Click a tile to share a cherished memory
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedSidebar;