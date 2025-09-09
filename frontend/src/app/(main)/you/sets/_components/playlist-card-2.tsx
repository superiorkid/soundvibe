"use client";

import { Badge } from "@/components/ui/badge";
import { useLikePlaylist } from "@/hooks/tanstack/playlist";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { TPlaylist } from "@/types/playlist-type";
import { HeartIcon, LockIcon, UserPlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PlaylistCard2Props {
  playlist: TPlaylist;
}

const PlaylistCard2 = ({ playlist }: PlaylistCard2Props) => {
  const { data: session } = authClient.useSession();
  const playlistFirstAudio = playlist.audios[0]?.audio ?? null;

  const { hasLikedPlaylist, isPending, likePlaylistToggle } = useLikePlaylist({
    playlist,
    userId: session?.user.id as string,
  });

  return (
    <div className="aspect-square space-y-1.5">
      <div className="h-full relative rounded-sm overflow-hidden hover:cursor-pointer group">
        {playlistFirstAudio && playlistFirstAudio.coverFile ? (
          <Image
            fill
            src={
              playlistFirstAudio
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/audio/cover/${playlistFirstAudio.id}`
                : "https://unsplash.com/photos/an-abstract-background-of-multicolored-lines-and-swirls-TIv00yVBYtI"
            }
            alt={`${playlist.title} image`}
            className="absolute inset-0 object-cover z-0 transition-opacity hover:brightness-75"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-amber-600/70 to-yellow-400/70 flex items-center justify-center transition-opacity group-hover:opacity-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
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

        <div className="hidden group-hover:block">
          <div className="absolute bottom-4 right-4 z-50 flex gap-6 items-center">
            <button
              className="hover:cursor-pointer hover:opacity-50"
              disabled={isPending}
              onClick={() => likePlaylistToggle()}
            >
              <HeartIcon
                size={16}
                strokeWidth={2}
                className={cn(
                  "fill-foreground stroke-foreground",
                  hasLikedPlaylist && "fill-rose-500 stroke-rose-500"
                )}
              />
            </button>
            <button className="hover:cursor-pointer hover:opacity-50">
              <UserPlusIcon size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        <Badge
          className="absolute top-2 right-1 font-medium"
          variant="secondary"
        >
          {playlist.audioCount} track{playlist.audioCount > 1 && "s"}
        </Badge>
      </div>

      <div className="text-sm">
        <div className="flex gap-1 items-center">
          {session?.user.id !== playlist.userId && (
            <HeartIcon size={12} strokeWidth={2} className="fill-foreground" />
          )}

          {playlist.type === "private" && (
            <LockIcon size={12} strokeWidth={2} />
          )}
          <Link
            href={`/${playlist?.user.displayUsername}/sets/${playlist.slug}`}
            className="font-semibold tracking-wide line-clamp-1 hover:opacity-50 hover:cursor-pointer"
          >
            <span>{playlist.title}</span>
          </Link>
        </div>
        <Link
          href={`/${playlist?.user.displayUsername}`}
          className="font-medium text-muted-foreground line-clamp-1 hover:opacity-50 hover:cursor-pointer"
        >
          {playlist.user.displayUsername}
        </Link>
      </div>
    </div>
  );
};

export default PlaylistCard2;
