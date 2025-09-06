"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const OtherUserPlaylistPanel = () => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold uppercase text-xs">
          playlists from this user
        </h1>
        <Link
          href="#"
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
      </div>

      <div className="space-y-4">playlist card here</div>
    </div>
  );
};

export default OtherUserPlaylistPanel;
