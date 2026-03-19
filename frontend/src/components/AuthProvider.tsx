"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearAuth, getToken, getUser, saveAuth, type PublicUser } from "../lib/auth";

type AuthState = {
  token: string | null;
  user: PublicUser | null;
  setAuth: (token: string, user: PublicUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<PublicUser | null>(null);

  useEffect(() => {
    setToken(getToken());
    setUser(getUser());
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      token,
      user,
      setAuth: (t, u) => {
        saveAuth(t, u);
        setToken(t);
        setUser(u);
      },
      logout: () => {
        clearAuth();
        setToken(null);
        setUser(null);
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

