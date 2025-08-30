"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { createContext, useContext, useState } from "react";

type HistoryFilterContextType = {
  historyQuery: string | null;
  setHistoryQuery: (track: string | null) => void;
  debouncedQuery: string | null;
};

const HistoryFilterContext = createContext<
  HistoryFilterContextType | undefined
>(undefined);

export const HistoryFilterContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [historyQuery, setHistoryQuery] = useState<string | null>(null);
  const debouncedQuery = useDebounce(historyQuery, 300);

  return (
    <HistoryFilterContext.Provider
      value={{ historyQuery, setHistoryQuery, debouncedQuery }}
    >
      {children}
    </HistoryFilterContext.Provider>
  );
};

export const useHistoryFilter = () => {
  const context = useContext(HistoryFilterContext);
  if (!context) {
    throw new Error(
      "useHistoryFilter must be used within a HistoryFilterContextProvider"
    );
  }
  return context;
};
