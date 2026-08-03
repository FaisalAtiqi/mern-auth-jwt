import { deleteSession } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { GetSessionsResponse } from "@shared/types/session";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => deleteSession(sessionId),

    // Remove the session from the UI immediately
    onMutate: async (sessionId) => {
      // Stop any running session requests
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.sessions });

      // Save current cache in case we need to roll back
      const previousSessions = queryClient.getQueryData<GetSessionsResponse>(
        QUERY_KEYS.sessions,
      );

      // Optimistically remove the session
      queryClient.setQueryData(
        QUERY_KEYS.sessions,
        (cache: GetSessionsResponse | undefined) => {
          if (!cache) return undefined;

          const sessions = cache.sessions.filter((s) => s.id !== sessionId);

          return {
            sessions,
            total: sessions.length,
          };
        },
      );

      return { previousSessions };
    },

    // Restore cache if the request fails
    onError: (_, __, context) => {
      if (context?.previousSessions) {
        queryClient.setQueryData(QUERY_KEYS.sessions, context.previousSessions);
      }

      toast.error("Failed to delete session", {
        description: "Please try again.",
      });
    },

    // Re-sync with the server
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.sessions,
      });
    },

    onSuccess: () => {
      toast.success("Session revoked", {
        description: "The device has been signed out.",
      });
    },
  });
}

export default useDeleteSession;
