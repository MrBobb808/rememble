import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Send, Info } from "lucide-react";

export const FamilySurveyLink = () => {
  const { toast } = useToast();
  const formLink = "https://docs.google.com/forms/d/e/1FAIpQLSc5CwIITQhRsARoYv1K_BQT-tGZl6F3gyADo1MV6wa52CPX-g/viewform?usp=dialog";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(formLink);
      toast({
        title: "Link copied",
        description: "The survey link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the link manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-memorial-blue" />
          Family Survey Link
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Share this survey with families to gather important information about their loved ones.
          The responses will help create more personalized and meaningful memorials.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleCopyLink}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Survey Link
          </Button>
          
          <Button
            variant="default"
            className="flex-1"
            onClick={() => window.open(formLink, '_blank')}
          >
            <Send className="mr-2 h-4 w-4" />
            Open Survey
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};