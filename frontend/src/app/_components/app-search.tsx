"use client";

// TODO:  optimize it make it reusable
import { Input as BaseInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, { createContext, useContext, useState } from "react";

interface AppSearchProps {
  children: React.ReactNode;
}

interface AppSearchContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppSearchContext = createContext<AppSearchContextType | undefined>(
  undefined
);

const AppSearch = ({ children }: AppSearchProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <AppSearchContext.Provider
      value={{
        isOpen,
        setIsOpen,
        searchQuery,
        setSearchQuery,
        isLoading,
        setIsLoading,
      }}
    >
      <div className="relative w-full">{children}</div>
    </AppSearchContext.Provider>
  );
};

const useAppSearch = () => {
  const context = useContext(AppSearchContext);
  if (context === undefined) {
    throw new Error("useAppSearch must be used within an AppSearch");
  }
  return context;
};

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const SearchInput = (props: SearchInputProps) => {
  const { setIsOpen, setSearchQuery } = useAppSearch();

  return (
    <BaseInput
      {...props}
      className={cn("peer pe-14 h-10", props.className)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      onChange={(e) => setSearchQuery(e.target.value)}
      type="search"
    />
  );
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const SearchButton = ({ children, ...props }: ButtonProps) => {
  const { isLoading } = useAppSearch();

  return (
    <button
      {...props}
      className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 right-4"
      type="submit"
      disabled={isLoading}
    >
      {children}
    </button>
  );
};

const SearchLoading = () => {
  const { isLoading } = useAppSearch();

  if (!isLoading) return null;

  return (
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
  );
};

interface ResultsProps {
  children: React.ReactNode;
}

const SearchResults = ({ children }: ResultsProps) => {
  const { isOpen, searchQuery, isLoading } = useAppSearch();

  if (!isOpen || !searchQuery.trim()) return null;

  return (
    <div className="absolute top-full mt-1 left-0 w-full max-h-60 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg z-20 p-3 text-sm text-gray-800">
      <p className="mb-2 font-semibold">Search for {searchQuery}</p>
      {isLoading ? (
        <div className="flex justify-center p-2">
          <SearchLoading />
        </div>
      ) : (
        <ul>{children}</ul>
      )}
    </div>
  );
};

type ItemProps = React.LiHTMLAttributes<HTMLLIElement>;

const SearchItem = ({ children, ...props }: ItemProps) => {
  return (
    <li className="p-2 rounded hover:bg-gray-100 cursor-pointer" {...props}>
      {children}
    </li>
  );
};

AppSearch.Input = SearchInput;
AppSearch.Button = SearchButton;
AppSearch.Loading = SearchLoading;
AppSearch.Results = SearchResults;
AppSearch.Item = SearchItem;

export default AppSearch;
