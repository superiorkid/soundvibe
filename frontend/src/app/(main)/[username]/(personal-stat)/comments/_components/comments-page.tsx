"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, Loader2Icon } from "lucide-react";
import React from "react";
import RecentCommentCard from "../../../(general)/_components/recent-comment-card";
import { useRecentComment } from "@/hooks/tanstack/user";

interface CommentsPageProps {
  username: string;
}

const CommentsPage = ({ username }: CommentsPageProps) => {
  const { comments, isError, isPending } = useRecentComment({
    limit: 25,
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
    <div className="space-y-6 mt-6">
      {comments.data.map((comment, index) => (
        <RecentCommentCard comment={comment} key={index} />
      ))}
    </div>
  );
};

export default CommentsPage;
