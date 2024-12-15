import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import CommentItem from "./CommentItem";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface CommentsListProps {
  photoId: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  likes: number;
  isLiked: boolean;
}

const CommentsList = ({ photoId }: CommentsListProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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

    fetchComments();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

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
      console.log('Attempting to insert comment with:', {
        photo_id: photoId,
        content: newComment.trim(),
        user_id: userData.user.id
      });

      const { error } = await supabase
        .from('memorial_image_comments')
        .insert({
          photo_id: photoId,
          content: newComment.trim(),
          user_id: userData.user.id
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setNewComment("");
      toast({
        title: "Success",
        description: "Your comment has been added",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
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

      <div className="space-y-2 mt-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            id={comment.id}
            content={comment.content}
            createdAt={comment.created_at}
            userId={comment.user_id}
            likes={comment.likes}
            isLiked={comment.isLiked}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentsList;