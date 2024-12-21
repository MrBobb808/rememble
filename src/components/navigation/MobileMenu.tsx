import { Button } from "@/components/ui/button";
import { Menu, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavigationButtons } from "./NavigationButtons";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export const MobileMenu = () => {
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] pt-10">
        <div className="flex flex-col gap-4">
          <NavigationButtons />
          <Button
            variant="outline"
            onClick={() => navigate('/director')}
            className="w-full justify-start"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};