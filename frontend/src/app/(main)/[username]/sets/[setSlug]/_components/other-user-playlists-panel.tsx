"use client";

import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { TUser } from "@/types/user.type";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const OtherUserPlaylistPanel = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as TUser;

  if (isPending) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold uppercase text-xs">
          playlists from this user
        </h1>
        <Link
          href="#"
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
        {(session?.user as TUser).playlists.map((playlist, index) => (
          <div key={index} className="flex gap-2">
            <div className="relative size-12">
              {playlist.playlistCoverFile ? (
                <Image
                  fill
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/playlists/cover/${playlist.id}`}
                  alt={`${playlist.title} cover`}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                  decoding="async"
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
            <div className="flex-1 text-sm">
              <p className="font-medium text-muted-foreground hover:cursor-pointer hover:opacity-50">
                <Link href={`/${user.displayUsername}`}>{user.username}</Link>
              </p>
              <p className="font-medium hover:cursor-pointer hover:opacity-50">
                <Link href={`/${user.displayUsername}/sets/${playlist.slug}`}>
                  {playlist.title}
                </Link>
              </p>
              {playlist.likeCount > 0 && (
                <Link
                  href={`/${user.displayUsername}/sets/${playlist.slug}/likes`}
                  className="hover:opacity-50"
                >
                  <div className="flex items-center gap-1">
                    <HeartIcon
                      className="fill-muted-foreground stroke-muted-foreground"
                      size={12}
                    />
                    <span>{playlist.likeCount}</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OtherUserPlaylistPanel;
