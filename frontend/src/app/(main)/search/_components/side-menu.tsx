"use client";

import { buttonVariants } from "@/components/ui/button";
import { useSearchMenu } from "@/hooks/use-search-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

const SideMenu = () => {
  const searchMenus = useSearchMenu();

  return (
    <div className="flex flex-col w-[231px] space-y-0.5">
      {searchMenus.map((menu, index) => (
        <Link
          key={index}
          className={cn(
            buttonVariants({
              variant: "ghost",
              className: cn(
                "justify-start ps-4",
                menu.isActive &&
                  "font-medium bg-foreground text-background hover:bg-foreground/75 hover:text-background rounded-sm"
              ),
            })
          )}
          href={menu.href}
        >
          {menu.label}
        </Link>
      ))}
    </div>
  );
};

export default SideMenu;
