import {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
} from "../types/auth";

import { User } from "../types/user";

import { apiRequest } from "../types/api";

export async function login(
  credentials: LoginRequest,
): Promise<TokenResponse> {
  return apiRequest<TokenResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    },
  );
}

export async function register(
  data: RegisterRequest,
): Promise<User> {
  return apiRequest<User>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export async function getCurrentUser(
  token: string,
): Promise<User> {
  return apiRequest<User>(
    "/auth/me",
    {
      method: "GET",
    },
    token,
  );
}