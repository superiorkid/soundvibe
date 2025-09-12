"use client";

import { useTrackReposted } from "@/hooks/tanstack/audio";
import { isAbsoluteUrl } from "@/lib/utils";
import { AlertTriangleIcon, Loader2Icon, UsersIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface RepostsSummaryPanelProps {
  audioId: string;
}

const RepostsSummaryPanel = ({ audioId }: RepostsSummaryPanelProps) => {
  const { isError, isPending, refetch, reposts } = useTrackReposted({
    audioId,
    limit: 9,
  });

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold uppercase text-sm">
          {reposts?.data?.length ? `${reposts.data.length} reposts` : "Reposts"}
        </h1>
        <Link
          href={`/audio/${audioId}/reposts`}
          className="text-xs text-muted-foreground tracking-wide"
        >
          View all
        </Link>
      </div>

      <div className="flex justify-start">
        {isPending && (
          <div className="flex items-center justify-center py-6 gap-2">
            <Loader2Icon className="animate-spin text-muted-foreground" />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-6 gap-2 text-center text-muted-foreground">
            <AlertTriangleIcon className="size-6" />
            <p className="text-sm">Failed to load reposts.</p>
            <button
              onClick={() => refetch()}
              className="text-xs underline underline-offset-2 hover:text-foreground"
            >
              Try again
            </button>
          </div>
        )}

        {!isPending && !isError && reposts?.data?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 gap-2 text-muted-foreground">
            <UsersIcon className="size-6" />
            <p className="text-sm">No reposts yet.</p>
          </div>
        )}

        {!isPending && !isError && (reposts?.data || []).length > 0 && (
          <div className="-space-x-[1.4rem] flex">
            {(reposts?.data || []).map((repost) => (
              <Link href={`/${repost.user?.displayUsername}`} key={repost.id}>
                <Image
                  className="ring-background rounded-full ring-2"
                  src={
                    repost.user?.image
                      ? isAbsoluteUrl(repost.user?.image)
                        ? repost.user?.image
                        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/cover/${repost.user.id}`
                      : "https://github.com/shadcn.png"
                  }
                  width={60}
                  height={60}
                  alt={repost.user?.name as string}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepostsSummaryPanel;
