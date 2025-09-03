"use client";

import { useCommentLike } from "@/hooks/tanstack/comment";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { TComment } from "@/types/comment.type";
import { HeartIcon } from "lucide-react";

interface LikeCommentButtonProps {
  comment: TComment;
}

const LikeCommentButton = ({ comment }: LikeCommentButtonProps) => {
  const { data: session } = authClient.useSession();

  const { hasLiked, isPending, toggleLikeMutation } = useCommentLike(
    comment,
    session?.user.id as string,
    comment.audioId
  );

  return (
    <button
      type="button"
      disabled={isPending}
      className="flex flex-col hover:cursor-pointer text-xs space-y-2 font-medium hover:opacity-50"
      onClick={() => toggleLikeMutation()}
    >
      <HeartIcon
        strokeWidth={2}
        size={16}
        className={cn(hasLiked && "fill-rose-500 stroke-rose-500")}
      />
      {comment.likesCount > 0 && <span>{comment.likesCount}</span>}
    </button>
  );
};

export default LikeCommentButton;
