"use client";

import { Input } from "@/components/ui/input";
import { useLikesFilter } from "@/context/likes-filter-context";

const LikesFilterInput = () => {
  const { likesQuery, setLikeQuery } = useLikesFilter();

  return (
    <Input
      type="text"
      value={likesQuery ?? ""}
      onChange={(e) => setLikeQuery(e.target.value)}
      placeholder="Filter"
      className="h-8 rounded-sm border border-zinc-300 bg-zinc-200/70 shadow-none w-[271px]"
    />
  );
};

export default LikesFilterInput;
