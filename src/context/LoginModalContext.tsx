import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import LoginModal from "../modules/auth/components/LoginModal";

interface LoginModalContextValue {
  isOpen: boolean;
  redirectTo: string | null;

  openLoginModal: (
    redirectTo?: string,
  ) => void;

  closeLoginModal: () => void;
}

interface LoginModalProviderProps {
  children: ReactNode;
}

const LoginModalContext =
  createContext<LoginModalContextValue | null>(
    null,
  );

export function LoginModalProvider({
  children,
}: LoginModalProviderProps) {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const [
    redirectTo,
    setRedirectTo,
  ] = useState<string | null>(null);

  const openLoginModal = useCallback(
    (
      requestedRoute?: string,
    ) => {
      setRedirectTo(
        requestedRoute ?? null,
      );

      setIsOpen(true);
    },
    [],
  );

  const closeLoginModal = useCallback(
    () => {
      setIsOpen(false);
      setRedirectTo(null);
    },
    [],
  );

  const value =
    useMemo<LoginModalContextValue>(
      () => ({
        isOpen,
        redirectTo,
        openLoginModal,
        closeLoginModal,
      }),
      [
        closeLoginModal,
        isOpen,
        openLoginModal,
        redirectTo,
      ],
    );

  return (
    <LoginModalContext.Provider
      value={value}
    >
      {children}

      <LoginModal
        isOpen={isOpen}
        onClose={closeLoginModal}
        redirectTo={redirectTo}
      />
    </LoginModalContext.Provider>
  );
}

export function useLoginModal(): LoginModalContextValue {
  const context =
    useContext(LoginModalContext);

  if (!context) {
    throw new Error(
      "useLoginModal debe utilizarse dentro de LoginModalProvider.",
    );
  }

  return context;
}