import { useMemo } from "react";

import type { UserData } from "../models/authResponse";

function readStoredUser(): UserData | null {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as UserData;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

function getPrimaryRole(user: UserData | null): string | null {
  return user?.role?.name ?? user?.role?.name ?? null;
}

export function useAuthSession() {
  const token = localStorage.getItem("token");

  const user = useMemo(() => readStoredUser(), []);

  const primaryRole = getPrimaryRole(user);

  const isAdmin = primaryRole?.toLowerCase() === "admin";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return {
    token,
    user,
    primaryRole,
    isAdmin,
    isAuthenticated: Boolean(token),
    logout,
  };
}