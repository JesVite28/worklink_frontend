import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { UserData } from "../modules/auth/models/authResponse";

import {
  logout as logoutRequest,
  me,
} from "../modules/auth/services/authService";

export type UserRole =
  | "admin"
  | "cliente"
  | "freelancer"
  | "empresa";

interface SessionUpdatedDetail {
  token: string;
  user: UserData;
}

interface AuthContextValue {
  token: string | null;
  user: UserData | null;
  primaryRole: UserRole | null;

  isAuthenticated: boolean;
  isInitializing: boolean;

  isAdmin: boolean;
  isClient: boolean;
  isFreelancer: boolean;
  isCompany: boolean;

  refreshSession: () => Promise<void>;
  updateUser: (user: UserData) => void;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext =
  createContext<AuthContextValue | null>(
    null,
  );

function readStoredUser(): UserData | null {
  const storedUser =
    localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(
      storedUser,
    ) as UserData;
  } catch {
    localStorage.removeItem("user");

    return null;
  }
}

function readStoredToken(): string | null {
  return localStorage.getItem("token");
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [
    token,
    setToken,
  ] = useState<string | null>(
    readStoredToken,
  );

  const [
    user,
    setUser,
  ] = useState<UserData | null>(
    readStoredUser,
  );

  const [
    isInitializing,
    setIsInitializing,
  ] = useState(true);

  const clearSession =
    useCallback(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setToken(null);
      setUser(null);
    }, []);

  const updateUser =
    useCallback(
      (
        updatedUser: UserData,
      ) => {
        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser),
        );

        setUser(updatedUser);
      },
      [],
    );

  const refreshSession =
    useCallback(async () => {
      const storedToken =
        readStoredToken();

      if (!storedToken) {
        clearSession();
        return;
      }

      try {
        const authenticatedUser =
          await me();

        localStorage.setItem(
          "user",
          JSON.stringify(
            authenticatedUser,
          ),
        );

        setToken(storedToken);
        setUser(authenticatedUser);
      } catch (error) {
        console.error(
          "No fue posible restaurar la sesión:",
          error,
        );

        clearSession();
      }
    }, [clearSession]);

  const logout =
    useCallback(async () => {
      const storedToken =
        readStoredToken();

      /*
       * Se inicia la petición antes de eliminar
       * el token para que Axios pueda enviarlo.
       */
      const logoutPromise =
        storedToken
          ? logoutRequest()
          : null;

      /*
       * La sesión se elimina inmediatamente.
       * La interfaz ya no espera al backend.
       */
      clearSession();

      if (!logoutPromise) {
        return;
      }

      try {
        await logoutPromise;
      } catch (error) {
        console.error(
          "La sesión se cerró localmente, pero el servidor no respondió:",
          error,
        );
      }
    }, [clearSession]);

  useEffect(() => {
    async function initializeSession() {
      try {
        await refreshSession();
      } finally {
        setIsInitializing(false);
      }
    }

    void initializeSession();
  }, [refreshSession]);

  useEffect(() => {
    function handleSessionUpdated(
      event: Event,
    ) {
      const customEvent =
        event as CustomEvent<SessionUpdatedDetail>;

      const session =
        customEvent.detail;

      if (
        !session?.token ||
        !session.user
      ) {
        return;
      }

      localStorage.setItem(
        "token",
        session.token,
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          session.user,
        ),
      );

      setToken(session.token);
      setUser(session.user);
    }

    function handleSessionExpired() {
      clearSession();
    }

    function handleStorageChange(
      event: StorageEvent,
    ) {
      if (
        event.key === "token" ||
        event.key === "user"
      ) {
        setToken(
          readStoredToken(),
        );

        setUser(
          readStoredUser(),
        );
      }
    }

    window.addEventListener(
      "auth:session-updated",
      handleSessionUpdated,
    );

    window.addEventListener(
      "auth:session-expired",
      handleSessionExpired,
    );

    window.addEventListener(
      "storage",
      handleStorageChange,
    );

    return () => {
      window.removeEventListener(
        "auth:session-updated",
        handleSessionUpdated,
      );

      window.removeEventListener(
        "auth:session-expired",
        handleSessionExpired,
      );

      window.removeEventListener(
        "storage",
        handleStorageChange,
      );
    };
  }, [clearSession]);

  const primaryRole =
    user?.role?.name ?? null;

  const value =
    useMemo<AuthContextValue>(
      () => ({
        token,
        user,
        primaryRole,

        isAuthenticated:
          Boolean(token && user),

        isInitializing,

        isAdmin:
          primaryRole === "admin",

        isClient:
          primaryRole === "cliente",

        isFreelancer:
          primaryRole === "freelancer",

        isCompany:
          primaryRole === "empresa",

        refreshSession,
        updateUser,
        logout,
      }),
      [
        token,
        user,
        primaryRole,
        isInitializing,
        refreshSession,
        updateUser,
        logout,
      ],
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}