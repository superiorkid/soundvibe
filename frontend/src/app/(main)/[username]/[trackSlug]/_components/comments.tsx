"use client";

import { AppBrand } from "@/app/_components/app-brand";
import { CommentFilterEnum } from "@/enums/comment-filter-enum";
import { useComments } from "@/hooks/tanstack/comment";
import { Loader2Icon } from "lucide-react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { Suspense } from "react";
import CommentCard from "./comment-card";
import CommentFilterDropdown from "./comment-filter-dropdown";

interface CommentsProps {
  audioId: string;
}

const Comments = ({ audioId }: CommentsProps) => {
  const [commentFilter] = useQueryState(
    "comment-filter",
    parseAsStringEnum<CommentFilterEnum>(
      Object.values(CommentFilterEnum)
    ).withDefault(CommentFilterEnum.newest)
  );

  const { comments, isPending } = useComments({
    audioId,
    filter: commentFilter,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h5 className="font-semibold text-lg">
          {comments?.data?.total || 0} comment
          {(comments?.data?.total || 0) > 1 && "s"}
        </h5>
        <Suspense>
          <CommentFilterDropdown />
        </Suspense>
      </div>

      <div className="space-y-6">
        {isPending ? (
          <div className="flex justify-center">
            <Loader2Icon />
          </div>
        ) : (
          (comments?.data?.comments || []).map((comment, index) => (
            <CommentCard key={index} comment={comment} />
          ))
        )}
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
