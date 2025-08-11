import { usePathname } from "next/navigation";
import { useMemo } from "react";

type TMenu = {
  href: string;
  label: string;
  isActive: boolean;
};

export function useMainMenu() {
  const pathname = usePathname();

  const menus = useMemo<TMenu[]>(
    () => [
      {
        href: "/discover",
        label: "Home",
        isActive: pathname === "/discover",
      },
      {
        href: "/feed",
        label: "Feed",
        isActive: pathname === "/feed",
      },
      {
        href: "/library",
        label: "Library",
        isActive: pathname === "/library",
      },
    ],
    [pathname]
  );

  return menus;
}
