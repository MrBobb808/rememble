import { Clock, Image as ImageIcon } from "lucide-react";

interface ActivityProps {
  photos: Array<{ id: number; url: string; caption: string }>;
}

const RecentActivity = ({ photos }: ActivityProps) => {
  return (
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
              <div className="mt-1">
                <ImageIcon className="w-4 h-4 text-memorial-blue" />
              </div>
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
            <ImageIcon className="w-8 h-8 text-memorial-gray-dark/30 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Click a tile to share a cherished memory
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;