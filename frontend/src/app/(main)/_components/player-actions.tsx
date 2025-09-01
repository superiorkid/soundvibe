"use client";

import CommentInput from "@/components/comment-input";
import { RepostAction } from "@/components/repost-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { useLike } from "@/hooks/tanstack/audio";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { TAudio } from "@/types/audio.type";
import {
  CheckIcon,
  CopyIcon,
  EllipsisIcon,
  HeartIcon,
  MessageSquareTextIcon,
  PlayIcon,
  Repeat2Icon,
  UploadIcon,
} from "lucide-react";
import CopyAudioLink from "./copy-audio-link";

type PlayerActionsProps = {
  showComment?: boolean;
  containerClassName?: string;
  audio: TAudio;
};

export function PlayerActions({
  showComment = true,
  containerClassName,
  audio,
}: PlayerActionsProps) {
  const { data: session } = authClient.useSession();
  const { toggleLikeMutation, isPending, hasLiked } = useLike(
    audio,
    session?.user.id as string
  );

  return (
    <div
      className={cn(
        containerClassName,
        showComment ? "space-y-4" : "space-y-0"
      )}
    >
      {showComment && <CommentInput audioId={audio.id} />}

      <div className="flex justify-between items-center">
        <div className="flex space-x-3.5 items-center">
          <Button
            variant="secondary"
            size="sm"
            disabled={isPending}
            className={cn(
              "hover:cursor-pointer hover:opacity-50",
              hasLiked && "text-red-500"
            )}
            onClick={() => toggleLikeMutation()}
          >
            <HeartIcon
              strokeWidth={2}
              size={16}
              className={cn("mr-1", hasLiked && "fill-red-500 stroke-red-500")}
            />
            {audio.likesCount > 0 && audio.likesCount}
            <span className="sr-only">
              {hasLiked ? "Dislike" : "Like"} Track
            </span>
          </Button>
          <RepostAction audio={audio} userId={session?.user.id as string}>
            {({ hasReposted, isPending, toggleRepost }) => (
              <Button
                variant="secondary"
                onClick={toggleRepost}
                disabled={isPending}
                className="flex items-center gap-1 hover:opacity-50 hover:cursor-pointer"
              >
                <Repeat2Icon
                  strokeWidth={2}
                  size={16}
                  className={cn(hasReposted && "stroke-rose-500")}
                />
                {audio.repostsCount > 0 && (
                  <span className={cn(hasReposted && "text-rose-500")}>
                    {audio.repostsCount}
                  </span>
                )}
              </Button>
            )}
          </RepostAction>
          <Button variant="secondary" size="icon">
            <UploadIcon strokeWidth={2} size={16} />
          </Button>
          <CopyAudioLink
            url={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${audio.user.displayUsername}/${audio.slug}`}
          >
            {({ onClick, copied }) => (
              <Button
                variant="secondary"
                size="sm"
                onClick={onClick}
                className="hover:cursor-pointer"
              >
                {copied ? (
                  <CheckIcon strokeWidth={2} size={16} />
                ) : (
                  <CopyIcon strokeWidth={2} size={16} />
                )}
              </Button>
            )}
          </CopyAudioLink>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="hover:cursor-pointer hover:opacity-50"
              >
                <EllipsisIcon strokeWidth={2} size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="hover:cursor-pointer">
                Add to Next Up
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:cursor-pointer">
                Add to Playlist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex space-x-3 items-center text-xs text-muted-foreground">
          <Label>
            <PlayIcon
              size={12}
              className="fill-muted-foreground stroke-muted-foreground"
              strokeWidth={2}
            />
            {audio.playsCount > 0 && audio.playsCount}
          </Label>
          <Label>
            <MessageSquareTextIcon size={12} strokeWidth={3} />
            {audio.commentsCount > 0 && <span>{audio.commentsCount}</span>}
          </Label>
        </div>
      </div>
    </div>
  );
}
