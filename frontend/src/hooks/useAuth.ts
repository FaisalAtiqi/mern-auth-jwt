import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getUser } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { GetUserResponse } from "@shared/types/User";

export function useAuth(
  options?: Omit<
    UseQueryOptions<GetUserResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  const { data: user, ...rest } = useQuery({
    ...options,
    queryKey: QUERY_KEYS.user,
    queryFn: getUser,
    staleTime: Infinity,
  });

  return { user, ...rest };
}
