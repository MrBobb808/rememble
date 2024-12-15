import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { validateUUID } from "@/utils/validation";
import { useToast } from "@/components/ui/use-toast";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  likes: number;
  isLiked: boolean;
}

export const useComments = (photoId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { toast } = useToast();

  const fetchComments = async () => {
    const { data: commentsData, error } = await supabase
      .from('memorial_image_comments')
      .select(`
        id,
        content,
        created_at,
        user_id,
        memorial_comment_likes(count)
      `)
      .eq('photo_id', photoId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      return;
    }

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    const { data: userLikes } = await supabase
      .from('memorial_comment_likes')
      .select('comment_id')
      .eq('user_id', user.user.id);

    const likedCommentIds = new Set(userLikes?.map(like => like.comment_id) || []);

    const formattedComments = commentsData?.map(comment => ({
      ...comment,
      likes: comment.memorial_comment_likes[0]?.count || 0,
      isLiked: likedCommentIds.has(comment.id)
    })) || [];

    setComments(formattedComments);
  };

  useEffect(() => {
    if (validateUUID(photoId)) {
      fetchComments();
    } else {
      console.error('Invalid photo ID format:', photoId);
    }

    // Subscribe to real-time updates
    const channel = supabase
      .channel('comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'memorial_image_comments',
          filter: `photo_id=eq.${photoId}`
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [photoId]);

  return { comments };
};