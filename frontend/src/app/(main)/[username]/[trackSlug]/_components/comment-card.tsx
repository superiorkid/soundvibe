import CommentInput from "@/components/comment-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import UserTooltip from "@/components/user-tooltip";
import { useActiveCommentCard } from "@/context/active-comment-card-context";
import { authClient } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils";
import { TComment } from "@/types/comment.type";
import { TUser } from "@/types/user.type";
import { formatDistance } from "date-fns";
import Link from "next/link";
import DeleteCommentDropdown from "./delete-comment-dropdown";
import LikeCommentButton from "./like-comment-button";
import { useCommentLike } from "@/hooks/tanstack/comment";
import { Badge } from "@/components/ui/badge";
import { HeartIcon } from "lucide-react";

interface CommentCardProps {
  comment: TComment;
}

const CommentCard = ({ comment }: CommentCardProps) => {
  const { data: session } = authClient.useSession();
  const user = session?.user as TUser;
  const { activeId, setActiveId } = useActiveCommentCard();
  const isActive = activeId === comment.id;

  const { hasLikedByAuthor } = useCommentLike(
    comment,
    session?.user.id as string,
    comment.audioId
  );

  const handleReplyClick = () => {
    if (isActive) {
      setActiveId(null);
    } else {
      setActiveId(comment.id);
    }
  };

  const handleSubmitSuccess = () => {
    setActiveId(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-4 w-full">
          <Avatar>
            <AvatarImage
              src={comment.user.image ?? "https://github.com/shadcn.png"}
            />
            <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3 w-full">
            <div>
              <h3 className="text-sm">
                <UserTooltip user={user}>
                  <Link
                    href={`/${user.displayUsername}`}
                    className="font-semibold hover:opacity-50"
                  >
                    {comment.user.name}
                  </Link>
                </UserTooltip>{" "}
                &#8226;{" "}
                <span className="text-muted-foreground text-xs">
                  {formatDistance(new Date(comment.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </span>
                {hasLikedByAuthor && (
                  <>
                    {" "}
                    &#8226;{" "}
                    <span className="text-xs text-pink-500 font-medium">
                      Liked by author
                    </span>
                  </>
                )}
              </h3>
              <p className="text-sm">{comment.content}</p>
            </div>

            <div className="flex gap-1 items-center">
              <Button
                variant="link"
                size="sm"
                onClick={handleReplyClick}
                className="text-xs tracking-wide font-medium"
              >
                {isActive ? "Cancel" : "Reply"}
              </Button>

              {session?.user.id === comment.userId && (
                <DeleteCommentDropdown
                  audioId={comment.audioId}
                  commentId={comment.id}
                />
              )}
            </div>

            {isActive && (
              <CommentInput
                audioId={comment.audioId}
                comment={comment}
                onSubmitSuccess={handleSubmitSuccess}
              />
            )}
          </div>
        </div>
        <LikeCommentButton comment={comment} />
      </div>

      {comment.replies?.length > 0 && (
        <div className="ml-10 space-y-3 pl-4">
          {comment.replies.map((reply: TComment) => (
            <CommentCard key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
