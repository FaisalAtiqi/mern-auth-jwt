import { deleteAllSessions } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { GetSessionsResponse } from "@shared/types/session";

function useDeleteAllSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllSessions,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.sessions,
      });

      const previousSessions = queryClient.getQueryData<GetSessionsResponse>(
        QUERY_KEYS.sessions,
      );

      queryClient.setQueryData(
        QUERY_KEYS.sessions,
        (cache: GetSessionsResponse | undefined) => {
          if (!cache) return undefined;

          const currentSession = cache.sessions.filter((s) => s.isCurrent);

          return {
            sessions: currentSession,
            total: currentSession.length,
          };
        },
      );

      return { previousSessions };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousSessions) {
        queryClient.setQueryData(QUERY_KEYS.sessions, context.previousSessions);
      }

      toast.error("Failed to revoke sessions");
    },

    onSuccess: () => {
      toast.success("Other sessions revoked");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.sessions,
      });
    },
  });
}

export default useDeleteAllSessions;
