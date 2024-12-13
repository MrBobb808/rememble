import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "./ui/button";
import { UserMenu } from "./navigation/UserMenu";
import { HelpDialog } from "./navigation/HelpDialog";
import { ActionButtons } from "./navigation/ActionButtons";

const Navigation = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-playfair text-gray-800">Memories</div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsHelpOpen(true)}
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Help
          </Button>
          <ActionButtons />
          <UserMenu />
        </div>
      </div>

      <HelpDialog isOpen={isHelpOpen} onOpenChange={setIsHelpOpen} />
    </div>
  );
};

export default Navigation;