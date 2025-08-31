import { TMenu } from "@/types/menu-type";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export function useMainMenu() {
  const pathname = usePathname();

  const menus = useMemo<TMenu[]>(
    () => [
      {
        href: "/feed",
        label: "Feed",
        isActive: pathname === "/feed",
      },
      {
        href: "/you/library",
        label: "Library",
        isActive: pathname.includes("you"),
      },
    ],
    [pathname]
  );

  return menus;
}
