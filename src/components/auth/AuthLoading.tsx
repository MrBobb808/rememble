import { Loader2 } from "lucide-react";

export const AuthLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-memorial-beige-light">
      <Loader2 className="w-8 h-8 animate-spin text-memorial-blue" />
    </div>
  );
};