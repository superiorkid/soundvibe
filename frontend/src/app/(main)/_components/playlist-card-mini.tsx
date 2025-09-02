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
          <Image
            fill
            src={
              playlist.coverUrl ||
              "https://images.unsplash.com/photo-1507808973436-a4ed7b5e87c9?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt={`${playlist.title} cover`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            decoding="async"
            loading="lazy"
            className="object-cover rounded-md"
          />
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
