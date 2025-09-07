"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAddAudioPlaylist } from "@/hooks/tanstack/playlist";
import { TPlaylist } from "@/types/playlist-type";
import Image from "next/image";
import Link from "next/link";

interface PlaylistCardMiniProps {
  playlist: TPlaylist;
  isAudioExistInPlaylist: boolean;
  audioId: string;
}

const PlaylistCardMini = ({
  playlist,
  isAudioExistInPlaylist,
  audioId,
}: PlaylistCardMiniProps) => {
  const { audioToPlaylistToggle, isPending } = useAddAudioPlaylist({
    playlist,
    audioId,
  });

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="relative size-12">
          {playlist.playlistCoverFile ? (
            <Image
              fill
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/playlists/cover/${playlist.id}`}
              alt={`${playlist.title} cover`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              decoding="async"
              loading="lazy"
              className="object-cover rounded-md"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/70 to-yellow-400/70 flex items-center justify-center">
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
        </div>
        <div className="space-y-0.5">
          <Link
            href={`/playlist/${playlist.id}`}
            className="text-sm font-semibold line-clamp-1 hover:underline"
          >
            {playlist.title}
          </Link>
          <p className="text-sm text-muted-foreground">
            {playlist.audioCount || 0}{" "}
            {playlist.audioCount === 1 ? "song" : "songs"}
          </p>
        </div>
      </div>

      <div>
        {playlist.type === "private" && (
          <Badge className="uppercase rounded-none mr-2 opacity-50 tracking-wide">
            private
          </Badge>
        )}
        <Button
          size="sm"
          className="rounded-sm text-sm font-semibold hover:cursor-pointer hover:opacity-50"
          variant={isAudioExistInPlaylist ? "outline" : "secondary"}
          onClick={() => audioToPlaylistToggle()}
          disabled={isPending}
        >
          {isAudioExistInPlaylist ? "Added" : "Add to playlist"}
        </Button>
      </div>
    </div>
  );
};

export default PlaylistCardMini;
