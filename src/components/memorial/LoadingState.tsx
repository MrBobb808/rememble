import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  console.log("LoadingState component rendered");
  return (
    <div className="min-h-screen bg-gradient-to-b from-memorial-beige-light to-white">
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-memorial-blue mb-4" />
          <p className="text-memorial-gray-dark">Loading memorial...</p>
        </div>
      </main>
    </div>
  );
};