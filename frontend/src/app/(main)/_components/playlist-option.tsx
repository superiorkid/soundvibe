"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import AddToPlaylist from "./add-to-playlist";
import CreatePlaylist from "./create-playlist";

const PlaylistOption = () => {
  const [tabsActive, setTabsActive] = useState<
    "add-playlist" | "create-playlist"
  >("add-playlist");

  return (
    <>
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setTabsActive("add-playlist")}
          className={cn(
            "text-lg font-semibold transition-all duration-200 ease-in-out px-4 py-2 rounded-t-lg",
            "border-b-2",
            tabsActive === "add-playlist"
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground/80 hover:border-foreground/30"
          )}
        >
          Add to playlist
        </button>
        <button
          onClick={() => setTabsActive("create-playlist")}
          className={cn(
            "text-lg font-semibold transition-all duration-200 ease-in-out px-4 py-2 rounded-t-lg",
            "border-b-2",
            tabsActive === "create-playlist"
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground/80 hover:border-foreground/30"
          )}
        >
          Create a playlist
        </button>
      </div>

      <div className="mt-2">
        {tabsActive === "add-playlist" ? <AddToPlaylist /> : <CreatePlaylist />}
      </div>
    </>
  );
};

export default PlaylistOption;
