import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Heart } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface CommentItemProps {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  likes: number;
  isLiked: boolean;
}

const CommentItem = ({ id, content, createdAt, userId, likes, isLiked }: CommentItemProps) => {
  const [likeCount, setLikeCount] = useState(likes);
  const [hasLiked, setHasLiked] = useState(isLiked);
  const [isLiking, setIsLiking] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      if (hasLiked) {
        await supabase
          .from('memorial_comment_likes')
          .delete()
          .match({ comment_id: id, user_id: userId });
        setLikeCount(prev => prev - 1);
      } else {
        await supabase
          .from('memorial_comment_likes')
          .insert({ comment_id: id, user_id: userId });
        setLikeCount(prev => prev + 1);
      }
      setHasLiked(!hasLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="flex gap-3 py-3 group">
      <Avatar className="w-8 h-8">
        <AvatarImage src="/placeholder.svg" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm text-gray-600">{content}</p>
        <div className="flex items-center gap-4 mt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-8 px-2 transition-all duration-200 ${hasLiked ? 'text-red-500' : 'text-gray-500 opacity-0 group-hover:opacity-100'}`}
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart className={`w-4 h-4 mr-1 ${hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span className="text-xs">{likeCount}</span>
          </Button>
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;