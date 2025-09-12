"use client";

import { usePathname } from "next/navigation";
import React from "react";

interface TagHeaderProps {
  tag: string;
}

const TagHeader = ({ tag }: TagHeaderProps) => {
  const pathname = usePathname();

  const headerLabel = () => {
    if (pathname.includes("playlists")) {
      return `Playlists tagged #${tag}`;
    } else if (pathname.includes("popular-tracks")) {
      return `Popular tracks tagged #${tag}`;
    } else {
      return `New tracks tagged #${tag}`;
    }
  };

  return (
    <div className="h-[90px] flex items-center">
      <h1 className="text-2xl font-semibold">{headerLabel()}</h1>
    </div>
  );
};

export default TagHeader;
