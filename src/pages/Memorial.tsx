import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { MemorialHeader } from "@/components/memorial/MemorialHeader";
import { MemorialContent } from "@/components/memorial/MemorialContent";
import { useMemorialAuth } from "@/hooks/useMemorialAuth";
import { createNewMemorial } from "@/services/memorialService";

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
  const [searchParams] = useSearchParams();
  const { supabase } = useMemorialAuth();

  useEffect(() => {
    const initializeMemorial = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const id = searchParams.get("id");
      if (id) {
        setMemorialId(id);
      } else {
        try {
          const memorial = await createNewMemorial(user.id);
          setMemorialId(memorial.id);
          toast({
            title: "Memorial created",
            description: "Your memorial has been created successfully.",
          });
        } catch (error) {
          console.error('Error creating memorial:', error);
          toast({
            title: "Error creating memorial",
            description: "There was a problem creating the memorial. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    initializeMemorial();
  }, [searchParams, toast, supabase.auth]);

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
      
      setPhotos([...photos, newPhoto]);
      
      if (photos.length === 24) {
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
    <div className="min-h-screen bg-gradient-to-b from-memorial-beige-light to-white">
      <Navigation />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <MemorialHeader
            photosCount={photos.length}
            memorialId={memorialId}
            onShare={handleShare}
            onDownload={handleDownload}
          />
          
          <MemorialContent
            photos={photos}
            summary={summary}
            onPhotoAdd={handlePhotoAdd}
            onDownload={handleDownload}
          />
        </div>
      </main>
    </div>
  );
};

export default Memorial;