import type { QueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";

export function clearAuthState(queryClient: QueryClient) {
  // User is now signed out
  queryClient.setQueryData(QUERY_KEYS.user, null);

  // Remove authenticated data
  queryClient.removeQueries({
    queryKey: QUERY_KEYS.sessions,
  });
}
