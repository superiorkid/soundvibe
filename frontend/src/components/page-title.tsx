import { cn } from "@/lib/utils";
import React from "react";

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

const PageTitle = ({ children, className }: PageTitleProps) => {
  return <h1 className={cn("text-2xl font-bold", className)}>{children}</h1>;
};

export default PageTitle;
