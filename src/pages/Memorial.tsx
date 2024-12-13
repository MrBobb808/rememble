import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { MemorialHeader } from "@/components/memorial/MemorialHeader";
import { MemorialContent } from "@/components/memorial/MemorialContent";
import { useMemorialAuth } from "@/hooks/useMemorialAuth";
import { createNewMemorial } from "@/services/memorialService";
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
  const [searchParams] = useSearchParams();
  const { supabase } = useMemorialAuth();

  // Fetch photos whenever memorialId changes
  useEffect(() => {
    const fetchPhotos = async () => {
      if (!memorialId) return;

      const { data, error } = await supabase
        .from('memorial_photos')
        .select('*')
        .eq('memorial_id', memorialId)
        .order('position', { ascending: true });

      if (error) {
        console.error('Error fetching photos:', error);
        return;
      }

      if (data) {
        const formattedPhotos = data.map(photo => ({
          id: photo.position,
          url: photo.image_url,
          caption: photo.caption,
          aiReflection: photo.ai_reflection
        }));
        setPhotos(formattedPhotos);
      }
    };

    fetchPhotos();
  }, [memorialId, supabase]);

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

  // Set up real-time subscription for photos
  useEffect(() => {
    if (!memorialId) return;

    const channel = supabase
      .channel('memorial_photos_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'memorial_photos',
          filter: `memorial_id=eq.${memorialId}`
        },
        async (payload) => {
          console.log('Photo change detected:', payload);
          // Refetch photos when changes occur
          const { data, error } = await supabase
            .from('memorial_photos')
            .select('*')
            .eq('memorial_id', memorialId)
            .order('position', { ascending: true });

          if (error) {
            console.error('Error fetching photos:', error);
            return;
          }

          if (data) {
            const formattedPhotos = data.map(photo => ({
              id: photo.position,
              url: photo.image_url,
              caption: photo.caption,
              aiReflection: photo.ai_reflection
            }));
            setPhotos(formattedPhotos);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [memorialId, supabase]);

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

      toast({
        title: "Memory added successfully",
        description: "Your memory has been added to the memorial.",
      });

      // The photos will be updated automatically through the real-time subscription
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