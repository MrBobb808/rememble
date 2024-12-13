import Navigation from "@/components/Navigation";
import MemorialHero from "@/components/MemorialHero";
import PhotoGrid from "@/components/PhotoGrid";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Photo {
  id: number;
  url: string;
  caption: string;
  aiReflection?: string;
}

const Index = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const { toast } = useToast();

  const handlePhotoAdd = async (file: File, caption: string, aiReflection: string) => {
    try {
      // Create a temporary URL for the uploaded file
      const url = URL.createObjectURL(file);
      
      // Add the new photo to the grid
      const newPhoto: Photo = {
        id: photos.length + 1,
        url,
        caption,
        aiReflection,
      };
      
      setPhotos([...photos, newPhoto]);
      
      toast({
        title: "Memory added successfully",
        description: "Your memory has been added to the memorial.",
      });
    } catch (error) {
      toast({
        title: "Error adding memory",
        description: "There was a problem adding your memory. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-memorial-blue-light to-white">
      <Navigation />
      <MemorialHero
        name="In Loving Memory"
        dates="A Life Beautiful"
        photoUrl="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1920"
      />
      
      <main className="container mx-auto py-16 px-4">
        <div className="max-w-prose mx-auto text-center mb-12">
          <h2 className="text-4xl font-playfair text-gray-800 mb-4">
            Cherished Memories
          </h2>
          <p className="text-gray-600">
            Join us in celebrating a life well-lived by sharing your favorite memories
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,300px] gap-8">
          <PhotoGrid photos={photos} onPhotoAdd={handlePhotoAdd} />
          
          <aside className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {photos.length > 0 ? (
                  photos.slice(-3).map((photo, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      A new memory was added {index === 0 ? "just now" : index === 1 ? "yesterday" : "last week"}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No recent activity</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Index;