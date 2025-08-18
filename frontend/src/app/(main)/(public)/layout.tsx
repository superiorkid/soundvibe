import AppFooter from "@/app/_components/app-footer";
import React from "react";
import SidebarMenu from "./_components/sidebar-menu";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="flex space-x-10 mt-5">
      <div className="flex-1">{children}</div>

      <aside className="w-96 space-y-8">
        <SidebarMenu />

        <AppFooter className="text-sm text-gray-700">
          <AppFooter.Brand name="SoundVibe" />
          <AppFooter.Language label="English (US)" />
        </AppFooter>
      </aside>
    </div>
  );
};

export default PublicLayout;
