import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MemorialHeader } from "@/components/memorial/MemorialHeader";
import { MemorialContent } from "@/components/memorial/MemorialContent";

interface Photo {
  id: number;
  url: string;
  caption: string;
  aiReflection?: string;
}

const Memorial = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [memorialId, setMemorialId] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access memorials",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const id = searchParams.get("id");
    if (id) {
      setMemorialId(id);
    } else {
      createMemorial();
    }
  };

  const createMemorial = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create a memorial",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const { data: memorialData, error: memorialError } = await supabase
        .from('memorials')
        .insert({ name: "In Loving Memory" })
        .select()
        .single();

      if (memorialError) throw memorialError;

      const { error: collaboratorError } = await supabase
        .from('memorial_collaborators')
        .insert({
          memorial_id: memorialData.id,
          user_id: user.id,
          email: user.email,
          role: 'admin',
          invitation_accepted: true
        });

      if (collaboratorError) throw collaboratorError;

      setMemorialId(memorialData.id);
      
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