import { QueryClient } from "@tanstack/react-query";

const isDev = import.meta.env.DEV;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: isDev ? false : 3,
    },
  },
});

export default queryClient;
