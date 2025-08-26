"use client";

import { AppBrand } from "@/app/_components/app-brand";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, Loader2Icon } from "lucide-react";
import CommentCard from "./comment-card";
import { useComments } from "@/hooks/tanstack/comment";

interface CommentsProps {
  audioId: string;
}

const Comments = ({ audioId }: CommentsProps) => {
  const { comments, isPending } = useComments(audioId);

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2Icon className="animate-spin size-14 text-muted-foreground" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h5 className="font-semibold text-lg">
          {comments?.data?.total || 0} comment
          {(comments?.data?.total || 0) > 1 && "s"}
        </h5>
        <Button variant="secondary">
          Sorted by: Newest <ChevronDownIcon />
        </Button>
      </div>
      <div className="space-y-6">
        {(comments?.data?.comments || []).map((comment, index) => (
          <CommentCard key={index} comment={comment} />
        ))}
      </div>
      <div className="flex justify-center">
        <AppBrand>
          <AppBrand.Icon size={22} strokeWidth={3} />
        </AppBrand>
      </div>
    </div>
  );
};

export default Comments;
