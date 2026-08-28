import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as SecureStore from "expo-secure-store";

import {
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

import { User } from "../types/user";

import {
  login as loginRequest,
  register as registerRequest,
  getCurrentUser,
} from "../services/authService";

const TOKEN_KEY = "belong_access_token";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  login(
    credentials: LoginRequest,
  ): Promise<void>;

  register(
    data: RegisterRequest,
  ): Promise<void>;

  logout(): Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined,
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const storedToken =
        await SecureStore.getItemAsync(
          TOKEN_KEY,
        );

      if (!storedToken) {
        return;
      }

      const currentUser =
        await getCurrentUser(
          storedToken,
        );

      setToken(storedToken);
      setUser(currentUser);
    } catch (error) {
      console.log(
        "Failed to restore session:",
        error,
      );

      await SecureStore.deleteItemAsync(
        TOKEN_KEY,
      );
    } finally {
      setLoading(false);
    }
  }

  async function login(
    credentials: LoginRequest,
  ) {
    const response =
      await loginRequest(
        credentials,
      );

    await SecureStore.setItemAsync(
      TOKEN_KEY,
      response.access_token,
    );

    const currentUser =
      await getCurrentUser(
        response.access_token,
      );

    setToken(
      response.access_token,
    );

    setUser(currentUser);
  }

  async function register(
    data: RegisterRequest,
  ) {
    await registerRequest(data);

    await login({
      email: data.email,
      password: data.password,
    });
  }

  async function logout() {
    await SecureStore.deleteItemAsync(
      TOKEN_KEY,
    );

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}