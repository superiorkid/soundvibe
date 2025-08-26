"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTopFans } from "@/hooks/tanstack/audio";
import { getInitials } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";

interface FanRankPanelProps {
  audioId: string;
}

const FanRankPanel = ({ audioId }: FanRankPanelProps) => {
  const [filter, setFilter] = useState<number>(0);
  const { isPending, topFans } = useTopFans({
    audioId,
    days: filter,
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2Icon className="animate-spin size-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      <h1 className="font-semibold uppercase text-sm">Fans</h1>
      <Tabs
        value={String(filter)}
        onValueChange={(val) => setFilter(Number(val))}
      >
        <TabsList className="bg-background">
          <TabsTrigger
            value="0"
            className="text-xs data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Top
          </TabsTrigger>
          <TabsTrigger
            value="7"
            className="text-xs data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            First
          </TabsTrigger>
        </TabsList>

        <div className="space-y-4">
          <p className="tracking-wide text-muted-foreground text-xs">
            {filter === 7
              ? "Fans who played this track in the first 7 days:"
              : "Fans who have played this track the most:"}
          </p>
          <div className="space-y-3">
            {(topFans?.data || []).map((fan, index) => (
              <div key={index} className="flex px-2 gap-2">
                <div className="flex gap-3">
                  <Label className="text-sm">{index + 1}</Label>
                  <Avatar className="size-9">
                    <AvatarImage
                      src={fan.user.image ?? "https://github.com/shadcn.png"}
                    />
                    <AvatarFallback>
                      {getInitials(fan.user.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <Label className="text-sm">{fan.user.name}</Label>
                  <Label className="text-zinc-500 text-xs tracking-wide">
                    {fan.plays} play{fan.plays > 1 && "s"}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default FanRankPanel;
