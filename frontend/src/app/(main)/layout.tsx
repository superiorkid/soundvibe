import { ActiveCommentCardProvider } from "@/context/active-comment-card-context";
import { LastTrackProvider } from "@/context/last-track-context";
import React from "react";
import AudioPlayer from "../_components/audio-player";
import MainNavigation from "./_components/main-navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <LastTrackProvider>
      <ActiveCommentCardProvider>
        <div className="grid min-h-[100dvh] grid-rows-[auto_1fr_auto] pb-20">
          <MainNavigation />
          <main>{children}</main>
        </div>
        <AudioPlayer />
      </ActiveCommentCardProvider>
    </LastTrackProvider>
  );
};

export default MainLayout;
