import { getSessions } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { GetSessionsResponse } from "@shared/types/session";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

/**
 * Fetches the user's active sessions.
 */
export function useSessions(
  options?: Omit<
    UseQueryOptions<GetSessionsResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    ...options,

    queryKey: QUERY_KEYS.sessions,
    queryFn: getSessions,

    // Consider data fresh for 1 minute.
    staleTime: 1000 * 60,

    // Auto-refresh every 30s when multiple sessions exist.
    refetchInterval: (query) => {
      const totalSessions = query.state.data?.total ?? 0;
      return totalSessions > 1 ? 1000 * 30 : false;
    },
  });
}
