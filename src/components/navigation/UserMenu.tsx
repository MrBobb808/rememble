import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { data: profile } = useProfile();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear any local storage items
      localStorage.removeItem('memorial-auth-token');
      localStorage.removeItem('memorial_data');

      // Show success toast
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });

      // Navigate to auth page
      navigate("/auth");
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: error.message || "There was a problem signing out.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{profile?.full_name || 'Loading...'}</p>
          <p className="text-xs text-muted-foreground break-all">
            {profile?.id || 'Loading...'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {profile?.relationship || 'Loading...'}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};