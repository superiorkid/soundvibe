"use client";

import { Button } from "@/components/ui/button";
import UserTooltip from "@/components/user-tooltip";
import { useLike } from "@/hooks/tanstack/audio";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { TAudio } from "@/types/audio.type";
import { TUser } from "@/types/user.type";
import {
  EllipsisIcon,
  HeartIcon,
  MessageSquareTextIcon,
  PlayIcon,
  Repeat2Icon,
} from "lucide-react";
import Image from "next/image";
import React from "react";

interface TrackCardMiniProps {
  audio: TAudio;
}

const TrackCardMini = ({ audio }: TrackCardMiniProps) => {
  const { data: session } = authClient.useSession();
  const { hasLiked, isPending, toggleLikeMutation } = useLike(
    audio,
    session?.user.id as string
  );

  return (
    <div className="flex gap-3 group relative">
      <div className="size-14 relative shrink-0">
        {audio?.coverFile ? (
          <Image
            fill
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/audio/cover/${audio.id}`}
            alt="track image"
            className="object-cover rounded-md"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/70 to-yellow-400/70 flex items-center justify-center rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-80"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 text-sm space-y-1.5">
        <div>
          <UserTooltip user={audio?.user as TUser}>
            <h2 className="font-semibold tracking-wide text-muted-foreground hover:cursor-pointer hover:opacity-50 capitalize">
              {audio?.artist}
            </h2>
          </UserTooltip>
          <p className="font-medium line-clamp-1 capitalize">{audio?.title}</p>
        </div>
        <div className="flex items-center space-x-2.5 text-muted-foreground">
          <button className="flex items-center gap-0.5">
            <PlayIcon
              size={12}
              className="fill-muted-foreground stroke-muted-foreground"
            />
            3.15M
          </button>
          <button className="flex items-center gap-0.5">
            <HeartIcon
              size={12}
              className="fill-muted-foreground stroke-muted-foreground"
            />
            {audio?.likesCount}
          </button>
          <button className="flex items-center gap-0.5">
            <Repeat2Icon size={14} strokeWidth={3} />
            12.2K
          </button>
          <button className="flex items-center gap-0.5">
            <MessageSquareTextIcon size={12} strokeWidth={3} />
            502
          </button>
        </div>
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          size="sm"
          variant="secondary"
          className="hover:cursor-pointer"
          onClick={() => toggleLikeMutation()}
        >
          <HeartIcon
            size={14}
            className={cn(
              "fill-foreground stroke-foreground",
              hasLiked && "fill-red-500 stroke-red-500"
            )}
          />
        </Button>
        <Button size="sm" variant="secondary" className="hover:cursor-pointer">
          <EllipsisIcon
            size={14}
            strokeWidth={2}
            className={cn("fill-foreground stroke-foreground")}
          />
        </Button>
      </div>
    </div>
  );
};

export default TrackCardMini;
