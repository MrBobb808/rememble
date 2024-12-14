import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-memorial-beige-light to-white">
      <main className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-memorial-blue" />
        </div>
      </main>
    </div>
  );
};