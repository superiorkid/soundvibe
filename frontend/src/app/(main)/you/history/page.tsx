import { HistoryFilterContextProvider } from "@/context/history-filter-context";
import { getQueryClient } from "@/lib/query-client";
import { listeningHistoryKeys } from "@/lib/query-keys";
import { getSession } from "@/server/auth";
import { getListehingHistory } from "@/server/listening-history";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ClearListeningHistoryDropdown from "./_components/clear-listening-history-dropdown";
import HistoryList from "./_components/history-list";
import ListeningHistoryFilter from "./_components/listening-history-filter";

const YourListeningHistoryPage = async () => {
  const session = await getSession();
  const userId = session?.user.id;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: listeningHistoryKeys.audioWithLimit({
      userId: userId as string,
      take: 25,
    }),
    queryFn: async () =>
      getListehingHistory({ take: 25, userId: userId as string }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HistoryFilterContextProvider>
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-lg">Recently played:</h2>
          <div className="flex gap-2 items-center">
            <ClearListeningHistoryDropdown />
            <ListeningHistoryFilter />
          </div>
        </div>

        <div className="mt-6">
          <HistoryList userId={userId as string} />
        </div>
      </HistoryFilterContextProvider>
    </HydrationBoundary>
  );
};

export default YourListeningHistoryPage;
