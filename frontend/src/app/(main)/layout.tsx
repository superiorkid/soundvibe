import React from "react";

import AudioPlayer from "../_components/audio-player";
import MainNavigation from "./_components/main-navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <div className="grid min-h-[100dvh] grid-rows-[auto_1fr_auto] pb-20">
        <MainNavigation />
        <main className="mt-5">{children}</main>
      </div>
      <AudioPlayer />
    </>
  );
};

export default MainLayout;
