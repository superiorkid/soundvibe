import { cn } from "@/lib/utils";
import { ActivityIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface AppBrandProps {
  children: React.ReactNode;
}

const AppBrand = ({ children }: AppBrandProps) => {
  return <div className="text-2xl font-bold">{children}</div>;
};

interface AppBrandLinkProps extends AppBrandProps {
  href: string;
  className?: string;
}

const AppLink = ({ children, href, className }: AppBrandLinkProps) => {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

interface AppBrandIconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}
const AppIcon = (props?: AppBrandIconProps) => {
  const {
    className = "mr-3 inline-flex",
    size = 40,
    strokeWidth = 2,
  } = props || {};
  return (
    <ActivityIcon
      size={size}
      strokeWidth={strokeWidth}
      className={cn(className)}
    />
  );
};

AppBrand.Link = AppLink;
AppBrand.Icon = AppIcon;

export { AppBrand };
export type { AppBrandIconProps, AppBrandLinkProps, AppBrandProps };
