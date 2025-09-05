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
          <Image
            fill
            src="https://images.unsplash.com/photo-1507808973436-a4ed7b5e87c9?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="playlist detail image"
            className="object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default PlaylistDetailHeader;
