"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { createContext, useContext, useState } from "react";

type FollowingFilterContextType = {
  followingQuery: string | null;
  setFollowingQuery: (keyword: string | null) => void;
  debouncedQuery: string | null;
};

const FollowingFilterContext = createContext<
  FollowingFilterContextType | undefined
>(undefined);

export const FollowingFilterContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [followQuery, setFollowQuery] = useState<string | null>(null);
  const debouncedQuery = useDebounce(followQuery, 300);

  return (
    <FollowingFilterContext.Provider
      value={{
        debouncedQuery,
        setFollowingQuery: setFollowQuery,
        followingQuery: followQuery,
      }}
    >
      {children}
    </FollowingFilterContext.Provider>
  );
};

export const useFollowingFilter = () => {
  const context = useContext(FollowingFilterContext);
  if (!context) {
    throw new Error(
      "useFollowingFilter must be used within a FollowingFilterContext"
    );
  }
  return context;
};
