"use client";

import { Input as BaseInput } from "@/components/ui/input";
import { useSearchEverything } from "@/hooks/tanstack/search";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { TSearchEverything } from "@/types/search.type";
import { AudioLinesIcon, ListVideoIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState } from "react";

interface AppSearchProps {
  children: React.ReactNode;
}

interface AppSearchContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  results: TSearchEverything[];
  isLoading: boolean;
  isError: boolean;
}

const AppSearchContext = createContext<AppSearchContextType | undefined>(
  undefined
);

const AppSearch = ({ children }: AppSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedQuery = useDebounce(searchQuery, 400);

  const {
    searchResults,
    isPending: isLoading,
    isError,
  } = useSearchEverything({
    keyword: debouncedQuery,
    limit: 2,
  });

  return (
    <AppSearchContext.Provider
      value={{
        isOpen,
        setIsOpen,
        searchQuery,
        setSearchQuery,
        results: searchResults?.data ?? [],
        isLoading,
        isError,
      }}
    >
      <div className="relative w-full">{children}</div>
    </AppSearchContext.Provider>
  );
};

const useAppSearch = () => {
  const context = useContext(AppSearchContext);
  if (!context) {
    throw new Error("useAppSearch must be used within an AppSearch");
  }
  return context;
};

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const SearchInput = (props: SearchInputProps) => {
  const { setIsOpen, setSearchQuery, searchQuery } = useAppSearch();

  return (
    <BaseInput
      {...props}
      className={cn("peer pe-14 h-9", props.className)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      onChange={(e) => setSearchQuery(e.target.value)}
      type="search"
      value={searchQuery}
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

const SearchResults = () => {
  const { isOpen, searchQuery, isLoading, results, isError } = useAppSearch();

  if (!isOpen || !searchQuery.trim()) return null;

  return (
    <div className="absolute top-full mt-1 left-0 w-full max-h-60 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg z-20 p-3 text-sm text-gray-800">
      <p className="mb-2 font-semibold">Search for &quot;{searchQuery}&quot;</p>

      {isLoading ? (
        <div className="flex justify-center p-2">
          <SearchLoading />
        </div>
      ) : isError ? (
        <p className="text-red-500">Something went wrong</p>
      ) : results.length > 0 ? (
        <ul>
          {results.map((r) => (
            <SearchItem key={r.id} result={r} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No results found</p>
      )}
    </div>
  );
};

interface ItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  result: TSearchEverything;
}

const SearchItem = ({ result, ...props }: ItemProps) => {
  const router = useRouter();
  const { setIsOpen, setSearchQuery } = useAppSearch();

  const handleClick = () => {
    let href: string | null = null;

    if (result.type === "user") {
      href = `/${result.slug}`;
    }

    if (result.type === "playlist") {
      href = `/${result.username}/sets/${result.slug}`;
    }

    if (result.type === "track") {
      href = `/${result.username}/${result.slug}`;
    }

    router.push(href || "#");
    setSearchQuery("");
    setIsOpen(false);
  };

  return (
    <li
      className="p-2 rounded hover:bg-gray-100 cursor-pointer flex items-center gap-2"
      onClick={handleClick}
      {...props}
    >
      <div className="relative size-6 rounded-md overflow-hidden">
        {result.cover ? (
          <Image
            fill
            src={result.cover}
            alt="cover"
            className="object-cover"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/70 to-yellow-400/70 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-80"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
        )}
      </div>
      <span>{result.title}</span>

      {result.type === "user" && (
        <UserIcon className="ml-auto" size={16} strokeWidth={2} />
      )}
      {result.type === "track" && (
        <AudioLinesIcon className="ml-auto" size={16} strokeWidth={2} />
      )}
      {result.type === "playlist" && (
        <ListVideoIcon className="ml-auto" size={16} strokeWidth={2} />
      )}
    </li>
  );
};

AppSearch.Input = SearchInput;
AppSearch.Button = SearchButton;
AppSearch.Loading = SearchLoading;
AppSearch.Results = SearchResults;
AppSearch.Item = SearchItem;

export default AppSearch;
