import { Button } from "@/components/ui/button";
import { Download, Heart } from "lucide-react";

interface MemorialSummaryProps {
  summary: string;
  onDownload: () => void;
}

const MemorialSummary = ({ summary, onDownload }: MemorialSummaryProps) => {
  if (!summary) return null;

  return (
    <div className="mt-8 p-8 bg-white rounded-lg shadow-sm border border-memorial-blue animate-fade-in">
      <Heart className="w-8 h-8 text-memorial-blue mx-auto mb-4" />
      <h3 className="text-2xl font-playfair text-gray-800 mb-4">Life Summary</h3>
      <p className="text-gray-700 italic leading-relaxed">{summary}</p>
      <Button onClick={onDownload} className="mt-6">
        <Download className="w-4 h-4 mr-2" />
        Download Memorial
      </Button>
    </div>
  );
};

export default MemorialSummary;