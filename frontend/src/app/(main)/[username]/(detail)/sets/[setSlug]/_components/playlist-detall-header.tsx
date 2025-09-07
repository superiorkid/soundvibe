"use client";

import { randomGradient } from "@/lib/random-gradient";
import { formatTime } from "@/lib/utils";
import { TPlaylist } from "@/types/playlist-type";
import { formatDistance } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { H2 } from "shadcn-typography";

interface PlaylistDetailHeaderProps {
  playlist: TPlaylist;
}

const PlaylistDetailHeader = ({ playlist }: PlaylistDetailHeaderProps) => {
  const [bgGradient] = useState(randomGradient());

  const totalAudioTime = useMemo(
    () => playlist.audios.reduce((acc, item) => acc + item.audio.duration, 0),
    [playlist.audios]
  );

  return (
    <header
      className="h-[385px] p-6 flex justify-between"
      style={{ background: bgGradient }}
    >
      <div className="flex flex-col justify-between">
        <div className="-space-y-2">
          <H2 className="border-none font-bold max-w-xl text-3xl bg-foreground text-background inline-block px-2 capitalize">
            {playlist?.title}
          </H2>
          <br />
          <h3 className="font-medium text-zinc-400 hover:text-zinc-600 text-lg bg-foreground inline-block px-2 hover:cursor-pointer">
            <Link href={`/${playlist.user.displayUsername}`}>
              {playlist?.user.displayUsername ?? "Unknown Artist"}
            </Link>
          </h3>
        </div>
        <div className="w-32 h-32 p-5 bg-foreground text-background rounded-full flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold">{playlist.audioCount}</span>
          <span className="tet-lg font-medium">
            Track{playlist.audioCount > 1 && "s"}
          </span>
          <span className="text-xs text-zinc-300">
            {formatTime(totalAudioTime)}
          </span>
        </div>
      </div>
      <div className="flex gap-4">
        <p className="text-muted-foreground text-sm tracking-wide">
          Updated{" "}
          {formatDistance(new Date(playlist.updatedAt as Date), new Date(), {
            addSuffix: true,
          })}
        </p>
        <div className="relative aspect-square rounded-md overflow-hidden">
          {playlist.playlistCoverFile ? (
            <Image
              fill
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/playlists/cover/${playlist.id}`}
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
                width="64"
                height="64"
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
      </div>
    </header>
  );
};

export default PlaylistDetailHeader;
