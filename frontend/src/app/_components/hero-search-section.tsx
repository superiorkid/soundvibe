"use client";

import { SearchIcon } from "lucide-react";
import { useState } from "react";
import AppSearch from "./app-search";
import { Button } from "@/components/ui/button";

const HeroSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 flex flex-col justify-center w-[823px] mx-auto h-full">
      <AppSearch>
        <AppSearch.Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search music..."
          className="bg-zinc-100"
        />
        <AppSearch.Loading />
        <AppSearch.Button
          onClick={() => console.log(`search for`, searchQuery)}
        >
          <SearchIcon className="h-5 w-5" />
        </AppSearch.Button>
        <AppSearch.Results>
          <AppSearch.Item>Recent Search 1</AppSearch.Item>
          <AppSearch.Item>Recent Search 2</AppSearch.Item>
        </AppSearch.Results>
      </AppSearch>
      <div className="space-y-4 flex flex-col items-center">
        <h3 className="text-2xl font-bold tracking-tight">
          Hear what&quot;s trending for free in the SoundVibe community
        </h3>
        <Button size="lg" className="font-semibold rounded-none h-11">
          Explore trending playlist
        </Button>
      </div>
    </div>
  );
};

export default HeroSearch;
