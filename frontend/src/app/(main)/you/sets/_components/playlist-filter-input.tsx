"use client";

import { Input } from "@/components/ui/input";
import React from "react";

const PlaylistFilterInput = () => {
  return (
    <Input
      type="text"
      placeholder="Filter"
      className="h-8 rounded-sm border border-zinc-300 bg-zinc-200/70 shadow-none w-[271px]"
    />
  );
};

export default PlaylistFilterInput;
