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

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8 animate-fade-in delay-200">
      <div className="flex items-center justify-between mb-4">
        <div className="text-left">
          <h3 className="text-lg font-medium text-gray-800">Memorial Progress</h3>
          <p className="text-sm text-gray-600">{photosCount}/25 memories shared</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onShare} variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button onClick={onDownload} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default MemorialProgress;