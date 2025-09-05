"use client";

import CopyToClipboard from "@/app/(main)/_components/copy-to-clipboard";
import MoreActionDropdown from "@/app/(main)/_components/more-action.dropdown";
import { useLike } from "@/hooks/tanstack/audio";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { TAudio } from "@/types/audio.type";
import {
  CheckIcon,
  CopyIcon,
  EllipsisIcon,
  HeartIcon,
  Repeat2Icon,
  UploadIcon,
} from "lucide-react";
import { RepostAction } from "./repost-button";

interface TrackCardCompactActionsProps {
  audio: TAudio;
}

const TrackCardCompactActions = ({ audio }: TrackCardCompactActionsProps) => {
  const { data: session } = authClient.useSession();

  const { toggleLikeMutation, isPending, hasLiked } = useLike(
    audio,
    session?.user.id as string
  );

  return (
    <div className="flex space-x-9 items-center">
      <button
        className="hover:cursor-pointer hover:opacity-50"
        disabled={isPending}
        onClick={() => toggleLikeMutation()}
      >
        <HeartIcon
          strokeWidth={2}
          size={16}
          className={cn(
            "stroke-foreground fill-foreground",
            hasLiked && "fill-red-500 stroke-red-500"
          )}
        />
      </button>
      <RepostAction audio={audio} userId={session?.user.id as string}>
        {({ hasReposted, isPending, toggleRepost }) => (
          <button
            className="hover:cursor-pointer hover:opacity-50"
            disabled={isPending}
            onClick={toggleRepost}
          >
            <Repeat2Icon
              strokeWidth={2}
              size={16}
              className={cn(
                "stroke-foreground",
                hasReposted && "stroke-rose-500"
              )}
            />
          </button>
        )}
      </RepostAction>
      <button className="hover:cursor-pointer hover:opacity-50">
        <UploadIcon strokeWidth={2} size={16} className="stroke-foreground" />
      </button>
      <CopyToClipboard
        text={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${audio.user.displayUsername}/${audio.slug}`}
      >
        {({ onClick, copied }) => (
          <button
            onClick={onClick}
            className="hover:cursor-pointer hover:opacity-50"
          >
            {copied ? (
              <CheckIcon
                strokeWidth={2}
                size={16}
                className="stroke-foreground"
              />
            ) : (
              <CopyIcon
                strokeWidth={2}
                size={16}
                className="stroke-foreground"
              />
            )}
          </button>
        )}
      </CopyToClipboard>
      <MoreActionDropdown audio={audio}>
        <button className="hover:cursor-pointer hover:opacity-50">
          <EllipsisIcon
            strokeWidth={2}
            size={16}
            className="stroke-foreground"
          />
        </button>
      </MoreActionDropdown>
    </div>
  );
};

export default TrackCardCompactActions;
