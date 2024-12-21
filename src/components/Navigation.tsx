import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { HelpDialog } from "./navigation/HelpDialog";
import { PrintfulDialog } from "./memorial/PrintfulDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./navigation/MobileMenu";
import { DesktopNav } from "./navigation/DesktopNav";

const Navigation = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  
  const currentMemorialId = searchParams.get("id");

  const { data: memorial } = useQuery({
    queryKey: ['memorial', currentMemorialId],
    queryFn: async () => {
      if (!currentMemorialId) return null;
      
      const { data, error } = await supabase
        .from('memorials')
        .select('*')
        .eq('id', currentMemorialId)
        .single();
      
      if (error) {
        console.error('Error fetching memorial:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!currentMemorialId
  });

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b h-12">
      <div className="container mx-auto h-full px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {memorial?.name && <span className="text-sm font-medium">{memorial.name}</span>}
        </div>

        <div className="flex items-center gap-2">
          <DesktopNav />
          <UserMenu />
          <MobileMenu />
        </div>

        <HelpDialog 
          open={isHelpOpen} 
          onOpenChange={setIsHelpOpen}
        />
        
        <PrintfulDialog
          open={isPrintDialogOpen}
          onOpenChange={setIsPrintDialogOpen}
        />
      </div>
    </div>
  );
};

export default Navigation;