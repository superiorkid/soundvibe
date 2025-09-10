"use client";

import { useAudio } from "@/context/audio-context";
import { useCreateComment } from "@/hooks/tanstack/comment";
import { authClient } from "@/lib/auth-client";
import { getInitials, isAbsoluteUrl } from "@/lib/utils";
import { TComment } from "@/types/comment.type";
import { SendIcon } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface CommentInputProps {
  audioId: string;
  comment?: TComment;
  onSubmitSuccess?: () => void;
}

const CommentInput = ({
  audioId,
  comment,
  onSubmitSuccess,
}: CommentInputProps) => {
  const { data: session } = authClient.useSession();
  const [commentInput, setCommentInput] = useState<string | null>(null);
  const { currentTime } = useAudio();
  const { createCommentMutation, isPending: createCommentPending } =
    useCreateComment({
      audioId,
      onSuccess: () => {
        onSubmitSuccess?.();
        setCommentInput(null);
      },
    });

  return (
    <div className="flex space-x-4 items-center">
      <Avatar>
        <AvatarImage
          src={
            session?.user.image
              ? isAbsoluteUrl(session?.user.image)
                ? session?.user.image
                : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/cover/${session.user.id}`
              : "https://github.com/shadcn.png"
          }
        />
        <AvatarFallback>
          {getInitials(session?.user.name as string)}
        </AvatarFallback>
      </Avatar>
      <Input
        placeholder="Write a comment"
        className="bg-zinc-100 rounded-sm h-8"
        onChange={(event) => setCommentInput(event.target.value)}
        value={commentInput || ""}
        disabled={createCommentPending}
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        disabled={!commentInput || createCommentPending}
        className="h-8 hover:cursor-pointer shadow-none"
        onClick={() =>
          createCommentMutation({
            content: commentInput || "",
            timestamp: !!comment ? comment.timestamp : currentTime,
            parentId: comment?.id,
          })
        }
      >
        <SendIcon size={20} strokeWidth={2} />
      </Button>
    </div>
  );
};

export default CommentInput;
