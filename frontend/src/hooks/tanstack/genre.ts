import { genreKeys } from "@/lib/query-keys";
import { findAllGenre } from "@/server/genre";
import { useQuery } from "@tanstack/react-query";

export function useGenres() {
  const { data: genres, isPending } = useQuery({
    queryKey: genreKeys.all,
    queryFn: async () => findAllGenre(),
  });

  return { genres, isPending };
}
