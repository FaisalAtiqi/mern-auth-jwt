export const QUERY_KEYS = {
  user: ["user"],
  sessions: ["sessions"],
  verifyEmail: (code: string) => ["verifyEmail", code],
} as const;
