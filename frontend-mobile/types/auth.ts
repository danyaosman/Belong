export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  native_language: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}