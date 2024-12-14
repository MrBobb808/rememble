import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link, Shield, Eye, Copy, Check } from "lucide-react";

interface LinkGeneratorProps {
  memorialId: string;
  isComplete?: boolean;
}

export const LinkGenerator = ({ memorialId, isComplete = false }: LinkGeneratorProps) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const generateLink = async (type: 'collaborator' | 'viewer') => {
    try {
      // Check if memorial is complete for viewer links
      if (type === 'viewer' && !isComplete) {
        toast({
          title: "Cannot generate viewer link",
          description: "All photo tiles must be filled before generating a viewer link.",
          variant: "destructive",
        });
        return;
      }

      const { data: link, error } = await supabase
        .from('memorial_links')
        .insert({
          memorial_id: memorialId,
          type,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      const baseUrl = window.location.origin;
      const fullLink = `${baseUrl}/memorial/${type}?token=${link.token}`;

      await navigator.clipboard.writeText(fullLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);

      toast({
        title: "Link generated successfully",
        description: "The link has been copied to your clipboard.",
      });
    } catch (error: any) {
      console.error('Error generating link:', error);
      toast({
        title: "Error generating link",
        description: error.message || "There was a problem generating the link.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={() => generateLink('collaborator')}
      >
        <Shield className="mr-2 h-4 w-4" />
        Generate Collaborator Link
      </Button>
      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={() => generateLink('viewer')}
        disabled={!isComplete}
      >
        <Eye className="mr-2 h-4 w-4" />
        Generate Viewer Link
        {!isComplete && <span className="ml-2 text-xs text-gray-500">(Fill all tiles first)</span>}
      </Button>
    </div>
  );
};