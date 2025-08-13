import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { H2 } from "shadcn-typography";

interface TrackStatsLayoutProps {
  children: React.ReactNode;
}

const TrackStatsLayout = ({ children }: TrackStatsLayoutProps) => {
  return (
    <div className="mt-6 space-y-9">
      <div className="flex gap-6 items-center">
        <div className="relative size-30 overflow-hidden">
          <Image
            fill
            src="https://images.unsplash.com/photo-1524650359799-842906ca1c06?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="track image"
            loading="lazy"
            decoding="async"
            className="object-cover rounded-lg"
          />
        </div>
        <H2 className="border-none hover:opacity-80">
          <Link href="/username/track-title">
            Q o d ë s ft. ATHENA - Poison
          </Link>
        </H2>
      </div>
      <div className="space-y-5">
        <Tabs defaultValue="tab-1">
          <TabsList className="text-foreground h-auto border-none gap-2 rounded-none border-b bg-transparent px-0 py-0.5 flex space-x-6">
            <TabsTrigger
              value="likes"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Likes
            </TabsTrigger>
            <TabsTrigger
              value="reposts"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Reposts
            </TabsTrigger>
            <TabsTrigger
              value="sets"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              In Playlists
            </TabsTrigger>
            <TabsTrigger
              value="recommended"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Related Tracks
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
};

export default TrackStatsLayout;
