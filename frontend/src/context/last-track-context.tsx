"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type LastTrackContextType = {
  lastTrack: string | null;
  setLastTrack: (track: string | null) => void;
};

const LastTrackContext = createContext<LastTrackContextType | undefined>(
  undefined
);

export function LastTrackProvider({ children }: { children: React.ReactNode }) {
  const [lastTrack, _setLastTrack] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lastTrack");
    if (stored) {
      _setLastTrack(stored);
    }
  }, []);

  const setLastTrack = (track: string | null) => {
    if (track === null) {
      localStorage.removeItem("lastTrack");
    } else {
      localStorage.setItem("lastTrack", track);
    }
    _setLastTrack(track);
  };

  return (
    <LastTrackContext.Provider value={{ lastTrack, setLastTrack }}>
      {children}
    </LastTrackContext.Provider>
  );
}

export function useLastTrack() {
  const ctx = useContext(LastTrackContext);
  if (!ctx)
    throw new Error("useLastTrack must be used inside LastTrackProvider");
  return ctx;
}
