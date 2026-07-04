import { createContext, type ReactNode, useContext, useState } from "react";

import { loginAdmin } from "../api/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";

type AuthContextValue = {
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useLocalStorage<string | null>("portfolio-admin-token", null);
  const [loading, setLoading] = useState(false);

  async function login(username: string, password: string) {
    setLoading(true);
    try {
      const response = await loginAdmin({ username, password });
      setToken(response.access_token);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        loading,
        login,
        logout: () => setToken(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
