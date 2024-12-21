import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavigationButtons } from "./NavigationButtons";

export const DesktopNav = () => {
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex items-center gap-2">
      <NavigationButtons />
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/director')}
      >
        <LayoutDashboard className="h-4 w-4 mr-2" />
        Dashboard
      </Button>
    </div>
  );
};