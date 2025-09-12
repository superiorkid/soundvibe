"use client";

import { authClient } from "@/lib/auth-client";
import { Loader2Icon } from "lucide-react";
import LikedTracksPanel from "./liked-tracks-panel";
import ListeningHistoryPanel from "./listening-history-panel";
import SuggestedUsersPanel from "./suggested-users-panel";

const SidebarMenu = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="p-4 flex justify-center">
        <Loader2Icon size={35} strokeWidth={2} className="animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <>
      <SuggestedUsersPanel />
      <LikedTracksPanel />
      <ListeningHistoryPanel userId={session.user.id} />
    </>
  );
};

export default SidebarMenu;
