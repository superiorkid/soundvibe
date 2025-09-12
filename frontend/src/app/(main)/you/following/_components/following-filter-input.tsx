"use client";

import { Input } from "@/components/ui/input";
import { useFollowingFilter } from "@/context/following-filter-context";
import React from "react";

const FollowingFilterInput = () => {
  const { followingQuery, setFollowingQuery } = useFollowingFilter();

  return (
    <Input
      type="text"
      value={followingQuery ?? ""}
      onChange={(e) => setFollowingQuery(e.target.value)}
      placeholder="Filter"
      className="h-8 rounded-sm border border-zinc-300 bg-zinc-200/70 shadow-none w-[271px]"
    />
  );
};

export default FollowingFilterInput;
