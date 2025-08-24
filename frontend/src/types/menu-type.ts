import { LucideIcon } from "lucide-react";

export type TMenu = {
  href: string;
  label: string;
  isActive?: boolean;
  icon?: LucideIcon;
};
