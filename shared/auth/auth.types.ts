import { GetUserResponse } from "../types/User.js";

export interface RegisterResponse {
  user: GetUserResponse;
  url?: string;
}

export interface LoginResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface RequestVerificationEmailResponse {
  message: string;
  url?: string;
}

export interface SendPasswordResetResponse {
  message: string;
  url?: string;
}

export interface ResetPasswordResponse {
  message: string;
}
