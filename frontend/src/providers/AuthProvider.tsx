import { useAuth } from "@/hooks/useAuth";
import { createContext, useContext } from "react";

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useCurrentUser() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useCurrentUser must be used inside AuthProvider");
  }

  return context;
}
