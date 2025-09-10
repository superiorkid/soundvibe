"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type TMenu = {
  href: string;
  label: string;
};

const UserStatTabs = () => {
  const pathname = usePathname();

  const tabMenus = useMemo<TMenu[]>(
    () => [
      { href: "/you/likes", label: "Likes" },
      { href: "/you/sets", label: "Playlists" },
      { href: "/you/following", label: "Following" },
      { href: "/you/history", label: "History" },
    ],
    []
  );

  return (
    <Tabs value={pathname}>
      <TabsList className="h-auto rounded-none bg-transparent p-0">
        {tabMenus.map((menu) => (
          <TabsTrigger
            key={menu.href}
            asChild
            value={menu.href}
            className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none 2xl:text-2xl font-semibold text-xl"
          >
            <Link href={menu.href}>{menu.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default UserStatTabs;
