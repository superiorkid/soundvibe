"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserCardCompact from "@/components/user-card-compact";
import { usePlaylistBySlug } from "@/hooks/tanstack/playlist";
import { TUser } from "@/types/user.type";
import Image from "next/image";
import Link from "next/link";
import { H3 } from "shadcn-typography";

interface DetailUserPlaylistPageProps {
  playlistSlug: string;
}

const DetailUserPlaylistPage = ({
  playlistSlug,
}: DetailUserPlaylistPageProps) => {
  const { playlist, isError, isPending } = usePlaylistBySlug(playlistSlug);

  if (isPending) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <p>Something went wrong.</p>
      </div>
    );
  }

  return (
    <div>
      <header className="flex gap-4 items-center py-7">
        <div className="relative size-20">
          {playlist?.data?.playlistCoverFile ? (
            <Image
              fill
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/cover/${playlist?.data?.id}`}
              alt={`${playlist?.data?.title} cover`}
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
        <H3>
          <Link
            href={`/${playlist?.data?.user.displayUsername}/sets/${playlist?.data?.slug}`}
            className="hover:opacity-50"
          >
            {playlist?.data?.title}
          </Link>
        </H3>
      </header>
      <div>
        <Tabs defaultValue="likes" className="space-y-7">
          <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="likes"
              className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Likes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="likes" className="flex justify-start">
            {playlist?.data?.likes.map((like, index) => (
              <UserCardCompact key={index} user={like.user as TUser} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DetailUserPlaylistPage;
