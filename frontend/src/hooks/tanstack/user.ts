import { userKeys } from "@/lib/query-keys";
import { getUserByUsername } from "@/server/user";
import { useQuery } from "@tanstack/react-query";

export const useUserByUsername = (username: string) => {
  const { data, isPending, isError } = useQuery({
    queryKey: userKeys.userByUsername(username),
    queryFn: async () => getUserByUsername(username),
    enabled: !!username,
  });

  return { user: data, isPending, isError };
};
