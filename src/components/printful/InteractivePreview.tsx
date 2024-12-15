import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface InteractivePreviewProps {
  mockupUrl: string | null;
  isLoading: boolean;
}

export const InteractivePreview = ({ mockupUrl, isLoading }: InteractivePreviewProps) => {
  const [currentView, setCurrentView] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (mockupUrl) {
      // In a real implementation, we'd fetch multiple preview angles
      // For now, we'll just use the same mockup for different views
      setPreviewUrls([mockupUrl, mockupUrl, mockupUrl]);
    }
  }, [mockupUrl]);

  if (isLoading) {
    return (
      <Card className="p-6 mb-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </Card>
    );
  }

  if (!mockupUrl) return null;

  return (
    <Card className="p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Interactive Preview</h2>
      <div className="relative">
        <img 
          src={previewUrls[currentView]} 
          alt={`Preview view ${currentView + 1}`}
          className="w-full rounded-lg shadow-lg"
        />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setCurrentView((prev) => (prev > 0 ? prev - 1 : previewUrls.length - 1))}
            className="rounded-full"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setCurrentView((prev) => (prev < previewUrls.length - 1 ? prev + 1 : 0))}
            className="rounded-full"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {previewUrls.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              currentView === index ? "bg-memorial-blue" : "bg-gray-300"
            }`}
            onClick={() => setCurrentView(index)}
          />
        ))}
      </div>
    </Card>
  );
};