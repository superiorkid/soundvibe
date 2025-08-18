import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AppFooterProps {
  children: ReactNode;
  className?: string;
}

const AppFooter = ({ children, className = "" }: AppFooterProps) => {
  return <footer className={cn("p-4", className)}>{children}</footer>;
};

interface AppFooterBrandProps {
  name: string;
  className?: string;
}
const Brand = ({ name, className = "" }: AppFooterBrandProps) => (
  <p className={cn("mt-2", className)}>
    &copy; {new Date().getFullYear()} {name}. All rights reserved.
  </p>
);

interface AppFooterLanguageProps {
  label: string;
  href?: string;
  className?: string;
}
const Language = ({
  label,
  href = "#",
  className = "",
}: AppFooterLanguageProps) => (
  <p className={cn("mt-1", className)}>
    Language:{" "}
    <a href={href} className="text-blue-600 hover:underline">
      {label}
    </a>
  </p>
);

AppFooter.Brand = Brand;
AppFooter.Language = Language;

export default AppFooter;
