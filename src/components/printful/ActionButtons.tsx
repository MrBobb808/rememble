import { ArrowLeft, Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onBack: () => void;
  onAction: () => void;
  isLoading: boolean;
  mockupUrl: string | null;
}

export const ActionButtons = ({ onBack, onAction, isLoading, mockupUrl }: ActionButtonsProps) => {
  return (
    <div className="flex gap-4">
      <Button
        variant="outline"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <Button
        onClick={onAction}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {mockupUrl ? 'Processing...' : 'Generating Preview...'}
          </>
        ) : (
          <>
            {mockupUrl ? (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Proceed to Checkout
              </>
            ) : (
              'Generate Preview'
            )}
          </>
        )}
      </Button>
    </div>
  );
};