import CommentInput from "@/components/comment-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import UserTooltip from "@/components/user-tooltip";
import { useActiveCommentCard } from "@/context/active-comment-card-context";
import { useDeleteComment } from "@/hooks/tanstack/comment";
import { authClient } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils";
import { TComment } from "@/types/comment.type";
import { TUser } from "@/types/user.type";
import { formatDistance } from "date-fns";
import { HeartIcon } from "lucide-react";
import Link from "next/link";
import DeleteCommentDropdown from "./delete-comment-dropdown";

interface CommentCardProps {
  comment: TComment;
}

const CommentCard = ({ comment }: CommentCardProps) => {
  const { data: session } = authClient.useSession();
  const user = session?.user as TUser;
  const { activeId, setActiveId } = useActiveCommentCard();
  const isActive = activeId === comment.id;

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
                {/* at{" "}
                <span className="text-muted-foreground font-medium">
                  {comment.timestamp}
                </span>{" "} */}
                &#8226;{" "}
                <span className="text-muted-foreground text-xs">
                  {formatDistance(new Date(comment.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </span>
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
        <button
          type="button"
          className="flex flex-col hover:cursor-pointer text-xs space-y-2 font-medium hover:opacity-50"
        >
          <HeartIcon strokeWidth={2} size={16} />
          <span>2</span>
        </button>
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
