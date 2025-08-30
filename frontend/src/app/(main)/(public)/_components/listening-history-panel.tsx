"use client";

import { buttonVariants } from "@/components/ui/button";
import { useListeningHistory } from "@/hooks/tanstack/listening-history";
import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import TrackCardMini from "./track-card-mini";

interface ListeningHistoryPanelProps {
  userId: string;
}

const ListeningHistoryPanel = ({ userId }: ListeningHistoryPanelProps) => {
  const { data, isError, isPending } = useListeningHistory({ userId, take: 3 });

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2Icon className="animate-spin size-5 text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <h1 className="font-semibold uppercase text-xs">listening history</h1>
        <p className="text-error text-sm mt-2">
          Failed to load listening history. Please try again later.
        </p>
      </div>
    );
  }

  const history = data?.data || [];

  return (
    <div className="space-y-2 p-4">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold uppercase text-xs">listening history</h1>
        <Link
          href="/you/history"
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

      {history.length === 0 ? (
        <p className="text-muted-foreground text-sm italic mt-2">
          No listening history yet. Start playing some tracks!
        </p>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <TrackCardMini key={index} audio={item.audio} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListeningHistoryPanel;
