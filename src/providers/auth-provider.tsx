
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { apiRequest, ApiError } from "@/lib/api";

export type UserRole = "customer" | "owner" | "admin";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isEmailVerified: boolean;
  status: "active" | "blocked";
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  refreshUser: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

async function fetchCurrentUser(): Promise<AuthUser> {
  try {
    const response = await apiRequest<AuthUser>("/users/me");

    if (!response.data) {
      throw new Error("User profile was not returned.");
    }

    return response.data;
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) {
      throw error;
    }
  }

  // Access token expired. Attempt to refresh the session.
  await apiRequest("/auth/refresh", {
    method: "POST",
  });

  // Retry fetching the current user with the new access token.
  const response = await apiRequest<AuthUser>("/users/me");

  if (!response.data) {
    throw new Error("User profile was not returned.");
  }

  return response.data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const currentUser = await fetchCurrentUser();

      setUser(currentUser);

      return currentUser;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await apiRequest("/auth/logout", {
      method: "POST",
    });

    setUser(null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();

        if (isMounted) {
          setUser(currentUser);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    refreshUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
