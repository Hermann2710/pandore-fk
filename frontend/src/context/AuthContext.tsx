"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "@/lib/api";
import type { User } from "@/types";

// Auth state lives in React Context — never in localStorage.
// The JWT is in HTTP-only cookies (backend), so we only need
// to know *who* the user is, not their token.
interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  setUser: () => {},
  refetch: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    if (u) localStorage.setItem("pandore_user", JSON.stringify(u));
    else localStorage.removeItem("pandore_user");
  }, []);

  const refetch = useCallback(async () => {
    try {
      const { data } = await authApi.me();
      setUser(data);
    } catch {
      // Keep cached user if available — cookies may be cross-site blocked
      const cached = localStorage.getItem("pandore_user");
      if (cached) setUserState(JSON.parse(cached));
      else setUserState(null);
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  // On mount, verify the JWT cookie with the backend.
  // Single source of truth — no localStorage involved.
  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, refetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
