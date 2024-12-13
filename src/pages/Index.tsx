import Navigation from "@/components/Navigation";
import MemorialHero from "@/components/MemorialHero";
import PhotoGrid from "@/components/PhotoGrid";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Photo {
  id: number;
  url: string;
  caption: string;
  aiReflection?: string;
}

const Index = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [memorialId, setMemorialId] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    createMemorial();
  }, []);

  const createMemorial = async () => {
    try {
      const { data, error } = await supabase
        .from('memorials')
        .insert({ name: "In Loving Memory" })
        .select()
        .single();

      if (error) throw error;
      setMemorialId(data.id);
    } catch (error) {
      console.error('Error creating memorial:', error);
      toast({
        title: "Error creating memorial",
        description: "There was a problem creating the memorial. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePhotoAdd = async (file: File, caption: string) => {
    if (!memorialId) return;

    try {
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('memorial-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('memorial-photos')
        .getPublicUrl(fileName);

      // Generate AI reflection
      const reflectionResponse = await supabase.functions.invoke('generate-reflection', {
        body: { caption, imageContext: "This is a memorial photo" },
      });

      if (reflectionResponse.error) throw reflectionResponse.error;

      // Add photo to memorial_photos table
      const { data: photoData, error: photoError } = await supabase
        .from('memorial_photos')
        .insert({
          memorial_id: memorialId,
          position: photos.length,
          image_url: publicUrl,
          caption,
          ai_reflection: reflectionResponse.data.reflection,
        })
        .select()
        .single();

      if (photoError) throw photoError;

      // Add the new photo to the grid
      const newPhoto: Photo = {
        id: photos.length + 1,
        url: publicUrl,
        caption,
        aiReflection: reflectionResponse.data.reflection,
      };
      
      const updatedPhotos = [...photos, newPhoto];
      setPhotos(updatedPhotos);
      
      // If this was the 25th photo, generate the summary
      if (updatedPhotos.length === 25) {
        const summaryResponse = await supabase.functions.invoke('generate-summary', {
          body: { memorialId },
        });

        if (summaryResponse.error) throw summaryResponse.error;
        setSummary(summaryResponse.data.summary);

        toast({
          title: "Memorial Complete!",
          description: "All memories have been added and a beautiful summary has been generated.",
        });
      } else {
        toast({
          title: "Memory added successfully",
          description: "Your memory has been added to the memorial.",
        });
      }
    } catch (error) {
      console.error('Error adding photo:', error);
      toast({
        title: "Error adding memory",
        description: "There was a problem adding your memory. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    // Implementation for downloading the memorial
    toast({
      title: "Download started",
      description: "Your memorial is being prepared for download.",
    });
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
          {summary && (
            <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-2xl font-playfair text-gray-800 mb-4">Life Summary</h3>
              <p className="text-gray-700 italic">{summary}</p>
              <Button onClick={handleDownload} className="mt-4">
                <Download className="w-4 h-4 mr-2" />
                Download Memorial
              </Button>
            </div>
          )}
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