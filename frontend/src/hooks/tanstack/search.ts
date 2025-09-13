import { searchKeys } from "@/lib/query-keys";
import { searchEverything } from "@/server/search";
import { useQuery } from "@tanstack/react-query";

export function useSearchEverything(params: {
  keyword: string;
  limit?: number;
}) {
  const {
    data: searchResults,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: searchKeys.seachEverything(params),
    queryFn: async () => searchEverything(params),
    enabled: !!params.keyword,
  });

  return { searchResults, isPending, isError, refetch };
}
