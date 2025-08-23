"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Loader2Icon,
  HeartIcon,
  PlayIcon,
  Repeat2Icon,
  MessageSquareTextIcon,
  EllipsisIcon,
} from "lucide-react";
import { TUser } from "@/types/user.type";
import { useRecentLiked } from "@/hooks/tanstack/audio";
import UserTooltip from "@/components/user-tooltip";

const LikedTracksPanel = () => {
  const { likedTracks, isPending } = useRecentLiked(3);
  const total = likedTracks?.data?.total || 0;

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2Icon className="animate-spin size-5 text-muted-foreground" />
      </div>
    );
  }

  if (!likedTracks?.data?.recent?.length) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold uppercase text-xs">0 likes</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          You haven’t liked any tracks yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold uppercase text-xs">
          {total} like{total > 1 && "s"}
        </h1>
        <Link
          href="/you/likes"
          className={cn(
            buttonVariants({
              className: "text-xs text-muted-foreground tracking-wide",
              variant: "ghost",
              size: "sm",
            })
          )}
        >
          view all
        </Link>
      </div>

      <div className="space-y-4">
        {likedTracks.data.recent.map((track, index) => (
          <div key={index} className="flex gap-3 group relative">
            <div className="size-14 relative shrink-0">
              {track.audio?.coverFile ? (
                <Image
                  fill
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/audio/cover/${track.audioId}`}
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
                <UserTooltip user={track.audio?.user as TUser}>
                  <h2 className="font-semibold tracking-wide text-muted-foreground hover:cursor-pointer hover:opacity-50">
                    {track.audio?.artist}
                  </h2>
                </UserTooltip>
                <p className="font-medium line-clamp-1">{track.audio?.title}</p>
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
                  {track.audio?.likesCount}
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
              <Button size="sm">
                <HeartIcon size={14} />
              </Button>
              <Button size="sm">
                <EllipsisIcon size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikedTracksPanel;
