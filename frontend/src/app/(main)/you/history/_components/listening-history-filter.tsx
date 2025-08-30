"use client";

import { Input } from "@/components/ui/input";
import { useHistoryFilter } from "@/context/history-filter-context";

const ListeningHistoryFilter = () => {
  const { historyQuery, setHistoryQuery } = useHistoryFilter();

  return (
    <Input
      type="text"
      value={historyQuery ?? ""}
      onChange={(e) => setHistoryQuery(e.target.value)}
      placeholder="Filter"
      className="h-8 rounded-sm border border-zinc-300 bg-zinc-200/70 shadow-none w-[271px]"
    />
  );
};

export default ListeningHistoryFilter;
