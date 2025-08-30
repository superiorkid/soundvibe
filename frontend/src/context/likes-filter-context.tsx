"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { createContext, useContext, useState } from "react";

type LikesFilterContextType = {
  likesQuery: string | null;
  setLikeQuery: (track: string | null) => void;
  debouncedQuery: string | null;
};

const LikesFilterContext = createContext<LikesFilterContextType | undefined>(
  undefined
);

export const LikesFilterContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [likesQuery, setLikeQuery] = useState<string | null>(null);
  const debouncedQuery = useDebounce(likesQuery, 300);

  return (
    <LikesFilterContext.Provider
      value={{ likesQuery, setLikeQuery, debouncedQuery }}
    >
      {children}
    </LikesFilterContext.Provider>
  );
};

export const useLikesFilter = () => {
  const context = useContext(LikesFilterContext);
  if (!context) {
    throw new Error(
      "useLikesFilter must be used within a LikesFilterContextProvider"
    );
  }
  return context;
};
