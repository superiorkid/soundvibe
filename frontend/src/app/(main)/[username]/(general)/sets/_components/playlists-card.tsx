"use client";

import TrackVisualizer from "@/app/(main)/_components/track-visualizer";
import TrackCardCompact from "@/components/track-card-compact";
import { Button } from "@/components/ui/button";
import { TAudio } from "@/types/audio.type";
import { TPlaylist } from "@/types/playlist-type";
import { formatDistance } from "date-fns";
import { PauseIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import PlaylistActions from "../../../(detail)/sets/[setSlug]/_components/playlist-actions";
import { useAudio } from "@/context/audio-context";

interface PlaylistsCardProps {
  playlist: TPlaylist;
}

const PlaylistsCard = ({ playlist }: PlaylistsCardProps) => {
  const [activeAudio, setActiveAudio] = useState<TAudio>(
    playlist.audios.at(0)?.audio as TAudio
  );
  const [showAll, setShowAll] = useState<boolean>(false);

  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const handlePlay = () => {
    if (!activeAudio) return;

    if (currentTrack?.id === activeAudio.id) {
      togglePlay();
    } else {
      playTrack(activeAudio);
    }
  };

  const minLimit = 5;
  const visibleAudios = showAll
    ? playlist.audios
    : playlist.audios.slice(0, minLimit);

  return (
    <div className="flex gap-6">
      <div className="relative size-40">
        {playlist.playlistCoverFile ? (
          <Image
            fill
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/cover/${playlist.id}`}
            alt="track image"
            className="object-cover"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
      <div className="flex-1 space-y-5">
        <div className="flex justify-between">
          <div className="flex gap-3 items-center">
            <Button
              type="button"
              size="icon"
              className="rounded-full size-11 hover:cursor-pointer hover:opacity-50"
              onClick={handlePlay}
            >
              {currentTrack?.id === activeAudio?.id && isPlaying ? (
                <PauseIcon className="size-5 fill-background" />
              ) : (
                <PlayIcon className="size-5 fill-background" />
              )}
            </Button>
            <div className="-space-y-0.5">
              <p className="text-sm text-muted-foreground font-semibold tracking-tight">
                {playlist.user.name}
              </p>
              <h1 className="text-lg font-bold">{playlist.title}</h1>
            </div>
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {formatDistance(new Date(playlist.createdAt), new Date(), {
              addSuffix: true,
            })}
          </span>
        </div>
        <TrackVisualizer audio={activeAudio} />
        <div className="space-y-2">
          {visibleAudios.map((audio, index) => (
            <TrackCardCompact
              key={index}
              index={index}
              audio={audio.audio}
              onPlay={(selected) => setActiveAudio(selected)}
            />
          ))}

          {playlist.audios.length > minLimit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="hover:cursor-pointer"
            >
              {showAll
                ? "Show Less"
                : `View ${playlist.audios.length - minLimit} More Tracks`}
            </Button>
          )}
        </div>

        <PlaylistActions playlist={playlist} />
      </div>
    </div>
  );
};

export default PlaylistsCard;
