import { useComments } from "@/hooks/useComments";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { validateUUID } from "@/utils/validation";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CommentsListProps {
  photoId: string;
}

const CommentsList = ({ photoId }: CommentsListProps) => {
  const { comments } = useComments(photoId);

  if (!validateUUID(photoId)) {
    console.error('Invalid photo ID format:', photoId);
    return null;
  }

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
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
      </ScrollArea>
      <div className="pt-4 border-t">
        <CommentForm photoId={photoId} />
      </div>
    </div>
  );
};

export default CommentsList;