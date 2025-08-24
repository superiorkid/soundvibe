"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TMenu } from "@/types/menu-type";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";

const TrackStatTabs = () => {
  const pathname = usePathname();
  const { trackSlug, username } = useParams<{
    username: string;
    trackSlug: string;
  }>();

  const tabMenus = useMemo<TMenu[]>(
    () => [
      {
        href: `/${username}/${trackSlug}/likes`,
        label: "Likes",
        isActive: pathname === `/${username}/${trackSlug}/likes`,
      },
      {
        href: `/${username}/${trackSlug}/reposts`,
        label: "Reposts",
        isActive: pathname === `/${username}/${trackSlug}/reposts`,
      },
      {
        href: `/${username}/${trackSlug}/sets`,
        label: "In Playlists",
        isActive: pathname === `/${username}/${trackSlug}/sets`,
      },
      {
        href: `/${username}/${trackSlug}/recommended`,
        label: "Related Tracks",
        isActive: pathname === `/${username}/${trackSlug}/recommended`,
      },
    ],
    [pathname, trackSlug, username]
  );

  return (
    <Tabs value={pathname} className="pb-3.5">
      <TabsList className="text-foreground h-auto border-none gap-2 rounded-none border-b bg-transparent px-0 py-0.5 flex space-x-1">
        {tabMenus.map((menu) => (
          <TabsTrigger
            asChild
            key={menu.href}
            value={menu.href}
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <Link href={menu.href}>{menu.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default TrackStatTabs;
