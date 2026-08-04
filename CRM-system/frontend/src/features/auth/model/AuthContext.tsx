import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { accessTokenStore } from "../../../shared/api/accessTokenStore";

import { api } from '../../../shared/api/axiosInstance';
import type { User } from '../../../entities/user/model/user.types';
import type {
  LoginCredentials,
  LoginResponse,
  RefreshResponse,
} from './auth.types';
import { authEvents } from "../../../shared/api/authEvents";

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(
  null,
);

export function AuthProvider({
  children,
}: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<
    string | null
    >(null);
  const [isAuthLoading, setIsAuthLoading] =
    useState(true);
  
  useEffect(() => {
  const restoreSession = async () => {
    try {
      const response = await api.post<RefreshResponse>(
        '/auth/refresh',
      );

      setUser(response.data.user);
      setAccessToken(response.data.accessToken);
      accessTokenStore.set(response.data.accessToken);
    } catch {
      setUser(null);
      setAccessToken(null);
      accessTokenStore.clear();
    } finally {
      setIsAuthLoading(false);
    }
  };

  void restoreSession();
  }, []);
  
  useEffect(() => {
    const unsubscribe = authEvents.subscribeUnauthorized(() => {
      setUser(null);
      setAccessToken(null);
      accessTokenStore.clear();
    });

    return unsubscribe;
  }, []);

  const login = async (
    credentials: LoginCredentials,
  ): Promise<void> => {
    const response = await api.post<LoginResponse>(
      '/auth/login',
      credentials,
    );

    setUser(response.data.user);
    setAccessToken(response.data.accessToken);
    accessTokenStore.set(response.data.accessToken);
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      setAccessToken(null);
      accessTokenStore.clear();
    }
  };

  const value = useMemo<AuthContextValue>(
  () => ({
    user,
    accessToken,
    isAuthenticated: Boolean(user && accessToken),
    isAuthLoading,
    login,
    logout,
  }),
  [user, accessToken, isAuthLoading],
);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth потрібно використовувати всередині AuthProvider',
    );
  }

  return context;
}