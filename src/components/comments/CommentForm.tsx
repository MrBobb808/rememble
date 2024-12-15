import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { validateUUID } from "@/utils/validation";

interface CommentFormProps {
  photoId: string;
}

const CommentForm = ({ photoId }: CommentFormProps) => {
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!validateUUID(photoId)) {
      console.error('Invalid photo ID format:', photoId);
      toast({
        title: "Error",
        description: "Invalid photo reference. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      toast({
        title: "Error",
        description: "You must be logged in to comment",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // First, verify the photo exists
      const { data: photoExists, error: photoError } = await supabase
        .from('memorial_photos')
        .select('id')
        .eq('id', photoId)
        .single();

      if (photoError || !photoExists) {
        throw new Error('Photo not found. It may have been deleted.');
      }

      const { data, error } = await supabase
        .from('memorial_image_comments')
        .insert({
          photo_id: photoId,
          content: newComment.trim(),
          user_id: userData.user.id
        })
        .select()
        .single();

      if (error) throw error;

      setNewComment("");
      toast({
        title: "Success",
        description: "Your comment has been added",
      });
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="min-h-[80px]"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  );
};

export default CommentForm;