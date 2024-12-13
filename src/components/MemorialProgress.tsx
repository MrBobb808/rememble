import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

interface MemorialProgressProps {
  photosCount: number;
  onShare: () => void;
  onDownload: () => void;
}

const MemorialProgress = ({ photosCount, onShare, onDownload }: MemorialProgressProps) => {
  const progress = (photosCount / 25) * 100;

  const getEncouragingMessage = () => {
    if (photosCount === 0) return "Start by adding your first memory";
    if (photosCount < 10) return "You're doing great! Keep adding memories";
    if (photosCount < 20) return "The memorial is coming together beautifully";
    if (photosCount < 25) return "Almost there! Just a few more memories to add";
    return "Memorial complete! Thank you for sharing these precious memories";
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="text-left">
          <h3 className="text-lg font-medium text-gray-800">Memorial Progress</h3>
          <p className="text-sm text-gray-600">{photosCount}/25 memories shared</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onShare} variant="outline" size="sm" className="bg-white">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button onClick={onDownload} variant="outline" size="sm" className="bg-white">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      <Progress value={progress} className="h-1.5" />
      <p className="text-sm text-gray-600 mt-2">{getEncouragingMessage()}</p>
    </div>
  );
};

export default MemorialProgress;