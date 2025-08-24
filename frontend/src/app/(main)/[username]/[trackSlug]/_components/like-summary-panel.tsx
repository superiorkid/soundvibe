"use client";

import { useUsersWhoLikedAudio } from "@/hooks/tanstack/audio";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface LikeSummaryPanelProps {
  username: string;
  audioSlug: string;
}

const LikeSummaryPanel = ({ username, audioSlug }: LikeSummaryPanelProps) => {
  const { isPending, usersWhoLiked } = useUsersWhoLikedAudio({
    slug: audioSlug,
    limit: 9,
  });
  const total = usersWhoLiked?.data?.total;
  const result = usersWhoLiked?.data?.result;

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2Icon className="animate-spin size-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold uppercase text-sm">
          {total} like{(total || 0) > 1 && "s"}
        </h1>
        <Link
          href={`/${username}/${audioSlug}/likes`}
          className="text-xs text-muted-foreground tracking-wide"
        >
          View all
        </Link>
      </div>
      <div className="flex -space-x-[1.4rem]">
        {result?.map((like, index) => (
          <Image
            key={index}
            className="ring-background rounded-full ring-2"
            src={like.user?.image ?? "https://github.com/shadcn.png"}
            width={60}
            height={60}
            alt={`${like.user?.name} image`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ))}
      </div>
    </div>
  );
};

export default LikeSummaryPanel;
