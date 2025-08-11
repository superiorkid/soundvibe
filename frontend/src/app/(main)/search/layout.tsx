import React from "react";
import SideMenu from "./_components/side-menu";

interface SearchLayoutProps {
  children: React.ReactNode;
}

const SearchLayout = ({ children }: SearchLayoutProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-bold pl-4">Search</h3>
      <div className="flex gap-6 pr-7">
        <div className="w-[310px]">
          <SideMenu />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default SearchLayout;
