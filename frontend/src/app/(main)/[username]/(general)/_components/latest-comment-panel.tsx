"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecentComment } from "@/hooks/tanstack/user";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { TUser } from "@/types/user.type";
import { AlertTriangleIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import RecentCommentCard from "./recent-comment-card";

interface LatestCommentPanelProps {
  usernameProps?: string;
}

const LatestCommentPanel = (props?: LatestCommentPanelProps) => {
  const { usernameProps } = props || {};

  const { data: session, isPending: sessionPending } = authClient.useSession();

  const username = usernameProps || (session?.user as TUser)?.displayUsername;

  const { comments, isError, isPending } = useRecentComment({
    limit: 3,
    username,
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2Icon className="animate-spin size-5 text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-2 p-4 border border-destructive/20 rounded-lg bg-destructive/10">
        <AlertTriangleIcon className="size-5 text-destructive mb-2" />
        <h2 className="font-semibold text-destructive text-sm">
          Failed to load comments
        </h2>
        <p className="text-sm text-muted-foreground">
          Unable to load your comments. Please try again later
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!comments?.data?.length) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold uppercase text-xs">0 comments</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          You haven&apos;t commented on any tracks yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold uppercase text-xs">Latest comments</h1>
        {sessionPending ? (
          <Skeleton className="h-8 w-52" />
        ) : (
          <Link
            href={`/${(session?.user as TUser).displayUsername}/comments`}
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
        )}
      </div>
      <div className="space-y-4">
        {comments.data.map((comment, index) => (
          <RecentCommentCard comment={comment} key={index} />
        ))}
      </div>
    </div>
  );
};

export default LatestCommentPanel;
