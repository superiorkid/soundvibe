"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { TUser } from "@/types/user.type";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type TMenu = {
  href: string;
  label: string;
};

const PersonalStatTabs = () => {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const tabMenus = useMemo<TMenu[]>(() => {
    if (!session?.user) return [];
    const user = session.user as TUser;
    return [
      { href: `/${user.displayUsername}/likes`, label: "Likes" },
      { href: `/${user.displayUsername}/following`, label: "Following" },
      { href: `/${user.displayUsername}/followers`, label: "Followers" },
      { href: `/${user.displayUsername}/comments`, label: "Comments" },
    ];
  }, [session?.user]);

  if (isPending) {
    return (
      <div className="flex gap-2 items-center">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-[122px]" />
        ))}
      </div>
    );
  }

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

export default PersonalStatTabs;
