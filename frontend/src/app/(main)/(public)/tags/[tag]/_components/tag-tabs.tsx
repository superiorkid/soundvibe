"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type TMenu = {
  href: string;
  label: string;
};

const TagTabs = ({ tag }: { tag: string }) => {
  const pathname = usePathname();

  const tabMenus = useMemo<TMenu[]>(
    () => [
      {
        href: `/tags/${tag}`,
        label: "Recent tracks",
      },
      {
        href: `/tags/${tag}/popular-tracks`,
        label: "Popular tracks",
      },
      {
        href: `/tags/${tag}/playlists`,
        label: "Playlists",
      },
    ],
    [tag]
  );

  return (
    <Tabs value={pathname}>
      <TabsList className="h-auto rounded-none bg-transparent p-0">
        {tabMenus.map((menu) => (
          <TabsTrigger
            key={menu.href}
            asChild
            value={menu.href}
            className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-semibold text-base"
          >
            <Link href={menu.href}>{menu.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default TagTabs;
