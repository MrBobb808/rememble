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

  // Fetch photos whenever memorialId changes
  useEffect(() => {
    const fetchPhotos = async () => {
      if (!memorialId) return;

      try {
        const { data, error } = await supabase
          .from('memorial_photos')
          .select('*')
          .eq('memorial_id', memorialId)
          .order('position', { ascending: true });

        if (error) throw error;

        if (data) {
          console.log('Fetched photos:', data);
          const formattedPhotos = data.map(photo => ({
            id: photo.position,
            url: photo.image_url,
            caption: photo.caption,
            aiReflection: photo.ai_reflection
          }));
          setPhotos(formattedPhotos);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
        toast({
          title: "Error fetching photos",
          description: "There was a problem loading your memories.",
          variant: "destructive",
        });
      }
    };

    fetchPhotos();
  }, [memorialId, supabase, toast]);

  useEffect(() => {
    const initializeMemorial = async () => {
      try {
        const id = searchParams.get("id");
        if (id) {
          setMemorialId(id);
        } else {
          const memorial = await createNewMemorial("development-user");
          setMemorialId(memorial.id);
          toast({
            title: "Memorial created",
            description: "Your memorial has been created successfully.",
          });
        }
      } catch (error) {
        console.error('Error initializing memorial:', error);
        toast({
          title: "Error creating memorial",
          description: "There was a problem creating the memorial. Please try again.",
          variant: "destructive",
        });
      }
    };

    initializeMemorial();
  }, [searchParams, toast]);

  const handlePhotoAdd = async (file: File, caption: string) => {
    if (!memorialId) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('memorial-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('memorial-photos')
        .getPublicUrl(fileName);

      // Generate AI reflection
      const { data: reflectionData, error: reflectionError } = await supabase.functions
        .invoke('generate-reflection', {
          body: { caption, imageContext: "This is a memorial photo" },
        });

      if (reflectionError) throw reflectionError;

      // Save photo metadata to database
      const { data: photoData, error: photoError } = await supabase
        .from('memorial_photos')
        .insert({
          memorial_id: memorialId,
          position: photos.length,
          image_url: publicUrl,
          caption,
          ai_reflection: reflectionData.reflection,
        })
        .select()
        .single();

      if (photoError) throw photoError;

      // Update local state
      const newPhoto = {
        id: photos.length,
        url: publicUrl,
        caption,
        aiReflection: reflectionData.reflection,
      };
      
      setPhotos(prevPhotos => [...prevPhotos, newPhoto]);

      toast({
        title: "Memory added successfully",
        description: "Your memory has been added to the memorial.",
      });
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