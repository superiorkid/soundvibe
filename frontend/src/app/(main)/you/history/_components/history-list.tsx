"use client";

import TrackCard from "@/app/(main)/_components/track-card";
import { useHistoryFilter } from "@/context/history-filter-context";
import { useListeningHistory } from "@/hooks/tanstack/listening-history";
import { TAudio } from "@/types/audio.type";

interface HistoryListProps {
  userId: string;
}

const HistoryList = ({ userId }: HistoryListProps) => {
  const { debouncedQuery } = useHistoryFilter();

  const { data, isError, isPending } = useListeningHistory({
    query: debouncedQuery ?? "",
    take: 25,
    userId,
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-red-500">
        <p className="text-lg font-semibold">Something went wrong</p>
        <p className="text-sm">
          We couldn’t load your listening history. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <p className="text-lg font-medium">No listening history yet</p>
        <p className="text-sm">Your recently played tracks will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.data.map((item, index) => (
        <TrackCard
          key={index}
          audio={item.audio as TAudio}
          showActionText={false}
        />
      ))}
    </div>
  );
};

export default HistoryList;
