import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Photo } from "@/types/photo";

export const useMemorialData = (memorialId: string | null) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPhotos = async () => {
      console.log("Fetching photos for memorialId:", memorialId);
      
      if (!memorialId) {
        console.log("No memorialId provided");
        return;
      }

      try {
        const { data, error } = await supabase
          .from('memorial_photos')
          .select('*')
          .eq('memorial_id', memorialId)
          .order('position', { ascending: true });

        if (error) {
          console.error('Error fetching photos:', error);
          throw error;
        }

        if (data) {
          console.log('Fetched photos data:', data);
          const formattedPhotos = data.map(photo => ({
            id: String(photo.position),
            url: photo.image_url,
            caption: photo.caption,
            aiReflection: photo.ai_reflection,
            contributorName: photo.contributor_name,
            relationship: photo.relationship
          }));
          console.log('Formatted photos:', formattedPhotos);
          setPhotos(formattedPhotos);
        }
      } catch (error: any) {
        console.error('Error in fetchPhotos:', error);
        toast({
          title: "Error fetching photos",
          description: "There was a problem loading your memories.",
          variant: "destructive",
        });
      }
    };

    fetchPhotos();
  }, [memorialId, toast]);

  const handlePhotoAdd = async (file: File, caption: string, contributorName: string, relationship: string, position: number) => {
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

      const { data: reflectionData, error: reflectionError } = await supabase.functions
        .invoke('generate-reflection', {
          body: { caption, imageContext: "This is a memorial photo" },
        });

      if (reflectionError) throw reflectionError;

      // Check if position is already taken
      const { data: existingPhoto } = await supabase
        .from('memorial_photos')
        .select('position')
        .eq('memorial_id', memorialId)
        .eq('position', position)
        .single();

      if (existingPhoto) {
        toast({
          title: "Position already taken",
          description: "Please choose another position for your photo.",
          variant: "destructive",
        });
        return;
      }

      const { data: photoData, error: photoError } = await supabase
        .from('memorial_photos')
        .insert({
          memorial_id: memorialId,
          position,
          image_url: publicUrl,
          caption,
          ai_reflection: reflectionData.reflection,
          contributor_name: contributorName,
          relationship: relationship
        })
        .select()
        .single();

      if (photoError) throw photoError;

      const newPhoto: Photo = {
        id: String(position),
        url: publicUrl,
        caption,
        aiReflection: reflectionData.reflection,
        contributorName,
        relationship
      };
      
      setPhotos(prevPhotos => [...prevPhotos, newPhoto]);

      toast({
        title: "Memory added successfully",
        description: "Your memory has been added to the memorial.",
      });
    } catch (error: any) {
      console.error('Error adding photo:', error);
      toast({
        title: "Error adding memory",
        description: error.message || "There was a problem adding your memory. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    photos,
    summary,
    handlePhotoAdd,
  };
};