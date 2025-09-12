import { TPlaylist } from "@/types/playlist-type";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PlaylistCardSecondaryProps {
  playlist: TPlaylist;
}

const PlaylistCardSecondary = ({ playlist }: PlaylistCardSecondaryProps) => {
  return (
    <div className="flex gap-2">
      <div className="relative size-12 rounded-md overflow-hidden">
        {playlist.playlistCoverFile ? (
          <Image
            fill
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/cover/${playlist.id}`}
            alt={`${playlist.title} cover`}
            className="object-cover"
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
              aria-label="Playlist icon"
              className="opacity-80"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 text-sm">
        <p className="font-medium text-muted-foreground">
          <Link
            href={`/${playlist.user.displayUsername}`}
            className="hover:opacity-70"
          >
            {playlist.user.name}
          </Link>
        </p>
        <p className="font-medium">
          <Link
            href={`/${playlist.user.displayUsername}/sets/${playlist.slug}`}
            className="hover:opacity-70"
          >
            {playlist.title}
          </Link>
        </p>

        {playlist.likeCount > 0 && (
          <Link
            href={`/${playlist.user.displayUsername}/sets/${playlist.slug}/likes`}
            className="hover:opacity-70 flex items-center gap-1 mt-1 text-muted-foreground"
          >
            <HeartIcon
              className="fill-muted-foreground stroke-muted-foreground"
              size={12}
              aria-hidden="true"
            />
            <span>{playlist.likeCount}</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default PlaylistCardSecondary;
