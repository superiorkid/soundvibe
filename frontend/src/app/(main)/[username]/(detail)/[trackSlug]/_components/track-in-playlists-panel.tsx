"use client";

import { buttonVariants } from "@/components/ui/button";
import UserTooltip from "@/components/user-tooltip";
import { useTrackPlaylists } from "@/hooks/tanstack/audio";
import { cn } from "@/lib/utils";
import { AlertTriangleIcon, HeartIcon, Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TrackInPlaylistsPanelProps {
  audioId: string;
}

const TrackInPlaylistsPanel = ({ audioId }: TrackInPlaylistsPanelProps) => {
  const { playlists, isError, isPending, refetch } = useTrackPlaylists({
    audioId,
    limit: 3,
  });

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold uppercase text-sm">in playlist</h1>
        <Link
          href={`/audio/${audioId}/playlists`}
          className="text-xs text-muted-foreground tracking-wide"
        >
          View all
        </Link>
      </div>

      {isPending && (
        <div className="flex items-center justify-center py-6">
          <Loader2Icon className="animate-spin size-5 text-muted-foreground" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-6 text-sm text-muted-foreground">
          <AlertTriangleIcon className="size-5" />
          <p>Failed to load playlists</p>
          <button
            onClick={() => refetch()}
            className="text-xs underline underline-offset-2 hover:text-foreground"
          >
            Try again
          </button>
        </div>
      )}

      {!isPending && !isError && playlists?.data?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Not in any playlists yet.
        </p>
      )}

      {!isPending &&
        !isError &&
        playlists &&
        (playlists?.data || []).length > 0 && (
          <div className="space-y-4">
            {playlists.data?.map((playlist) => (
              <div key={playlist.id} className="flex gap-3 items-start">
                <div className="relative size-14 shrink-0 rounded-md overflow-hidden">
                  {playlist.playlistCoverFile ? (
                    <Image
                      fill
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/cover/${playlist.id}`}
                      alt={`${playlist.title} cover`}
                      className="object-cover"
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-600/70 to-yellow-400/70 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
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

                <div className="text-sm space-y-1.5 flex-1">
                  <div>
                    <UserTooltip user={playlist.user}>
                      <h1 className="font-bold text-muted-foreground hover:cursor-pointer hover:opacity-50">
                        {playlist.user.displayUsername}
                      </h1>
                    </UserTooltip>
                    <p className="font-semibold hover:cursor-pointer hover:opacity-50">
                      <Link
                        href={`/${playlist.user.displayUsername}/sets/${playlist.slug}`}
                      >
                        {playlist.title}
                      </Link>
                    </p>
                  </div>

                  <Link
                    href={`/${playlist.user.displayUsername}/sets/${playlist.slug}/likes`}
                    className={cn(
                      buttonVariants({
                        className: cn("text-xs items-center gap-1"),
                        variant: "ghost",
                        size: "sm",
                      })
                    )}
                  >
                    <HeartIcon
                      className="fill-muted-foreground size-3"
                      strokeWidth={2}
                    />
                    <span className="font-medium text-muted-foreground">
                      {playlist.likeCount}
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default TrackInPlaylistsPanel;
