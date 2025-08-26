"use client";

import { createContext, useContext, useState } from "react";

type ActiveCommentCardContextType = {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
};

const ActiveCommentCardContext = createContext<ActiveCommentCardContextType>({
  activeId: null,
  setActiveId: () => {},
});

// Context provider component
export const ActiveCommentCardProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <ActiveCommentCardContext.Provider value={{ activeId, setActiveId }}>
      {children}
    </ActiveCommentCardContext.Provider>
  );
};

export const useActiveCommentCard = () => {
  const context = useContext(ActiveCommentCardContext);
  if (!context) {
    throw new Error(
      "useActiveCommentCard must be used within an ActiveCommentCardProvider"
    );
  }
  return context;
};
