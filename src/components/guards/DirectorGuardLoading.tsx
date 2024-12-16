import { Loader2 } from "lucide-react";

export const DirectorGuardLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-memorial-beige-light to-white">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-memorial-blue mx-auto mb-4" />
        <p className="text-memorial-gray-dark">Checking access...</p>
      </div>
    </div>
  );
};