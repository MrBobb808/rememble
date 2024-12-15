import { Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearchParams } from "react-router-dom";
import { Photo } from "@/types/photo";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UnifiedSidebarProps {
  photos: Photo[];
}

const UnifiedSidebar = ({ photos }: UnifiedSidebarProps) => {
  const [searchParams] = useSearchParams();
  const memorialId = searchParams.get("id");

  // Fetch all contributors for this memorial
  const { data: contributors = [] } = useQuery({
    queryKey: ['memorial-contributors', memorialId],
    queryFn: async () => {
      if (!memorialId) return [];
      const { data, error } = await supabase
        .from('memorial_photos')
        .select('contributor_name, relationship')
        .eq('memorial_id', memorialId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Remove duplicates based on contributor name
      return Array.from(new Map(
        data.map(item => [item.contributor_name, item])
      ).values());
    },
    enabled: !!memorialId
  });

  if (!memorialId) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-memorial-blue" />
          <h3 className="font-medium text-gray-800">Contributors</h3>
        </div>
        
        <div className="space-y-4">
          {contributors.map((contributor, index) => (
            <div 
              key={`${contributor.contributor_name}-${index}`}
              className="flex items-center gap-3"
            >
              <Avatar className="w-8 h-8 border-2 border-white">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  {contributor.contributor_name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {contributor.contributor_name}
                </p>
                <p className="text-xs text-gray-500">
                  {contributor.relationship}
                </p>
              </div>
            </div>
          ))}
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
                key={photo.id} 
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
                No recent activity
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedSidebar;