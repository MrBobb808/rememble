import Navigation from "@/components/Navigation";
import PhotoGrid from "@/components/PhotoGrid";
import MemorialProgress from "@/components/MemorialProgress";
import RecentActivity from "@/components/RecentActivity";
import MemorialSummary from "@/components/MemorialSummary";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Photo {
  id: number;
  url: string;
  caption: string;
  aiReflection?: string;
}

const Memorial = () => {
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('memorial-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('memorial-photos')
        .getPublicUrl(fileName);

      const reflectionResponse = await supabase.functions.invoke('generate-reflection', {
        body: { caption, imageContext: "This is a memorial photo" },
      });

      if (reflectionResponse.error) throw reflectionResponse.error;

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

      const newPhoto: Photo = {
        id: photos.length + 1,
        url: publicUrl,
        caption,
        aiReflection: reflectionResponse.data.reflection,
      };
      
      const updatedPhotos = [...photos, newPhoto];
      setPhotos(updatedPhotos);
      
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

  const handleShare = () => {
    toast({
      title: "Share memorial",
      description: "Share this memorial with loved ones.",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your memorial is being prepared for download.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-memorial-blue-light to-white">
      <Navigation />
      
      <main className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-4xl font-playfair text-gray-800 mb-4 animate-fade-in">
            Share Your Cherished Memories
          </h2>
          <p className="text-gray-600 mb-8 animate-fade-in delay-100">
            Join us in celebrating a life well-lived by sharing your favorite memories
          </p>
          
          <MemorialProgress 
            photosCount={photos.length}
            onShare={handleShare}
            onDownload={handleDownload}
          />

          <MemorialSummary 
            summary={summary}
            onDownload={handleDownload}
          />
        </div>

        <div className="grid lg:grid-cols-[1fr,300px] gap-8">
          <PhotoGrid photos={photos} onPhotoAdd={handlePhotoAdd} />
          <aside>
            <RecentActivity photos={photos} />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Memorial;