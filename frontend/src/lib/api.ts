import type {
  DeleteAllResponse,
  DeleteSessionResponse,
  GetSessionsResponse,
} from "@shared/types/session";
import { API } from "../config/apiConfig";
import {
  type RegisterBody,
  type LoginBody,
  type ResetPasswordBody,
  verificationCodeSchema,
} from "@shared/auth/auth.schema";
import type {
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
  RequestVerificationEmailResponse,
  SendPasswordResetResponse,
  VerifyEmailResponse,
} from "@shared/auth/auth.types";
import type { GetUserResponse } from "@shared/types/User";

export async function register(data: RegisterBody) {
  return await API.post<RegisterResponse>("/api/auth/register", data);
}

export async function login(data: LoginBody) {
  return await API.post<LoginResponse>("/api/auth/login", data);
}

export async function logout() {
  return await API.get<LogoutResponse>("/api/auth/logout");
}

export async function verifyEmail(verificationCode: string) {
  const validCode = verificationCodeSchema.parse(verificationCode);

  return await API.get<VerifyEmailResponse>(
    `/api/auth/email/verify/${validCode}`,
  );
}

export async function requestVerificationEmail(email: string) {
  return await API.post<RequestVerificationEmailResponse>(
    "/api/auth/email/verify/request",
    { email },
  );
}

export async function sendPasswordResetEmail(email: string) {
  return await API.post<SendPasswordResetResponse>(
    "/api/auth/password/forgot",
    { email },
  );
}

export async function resetPassword(data: ResetPasswordBody) {
  return await API.post<ResetPasswordBody>("/api/auth/password/reset", data);
}

export async function getUser() {
  return await API.get<GetUserResponse>("/api/user");
}

export async function getSessions() {
  return await API.get<GetSessionsResponse>("/api/sessions");
}

export async function deleteSession(sessionId: string) {
  await API.delete<DeleteSessionResponse>(`/api/sessions/${sessionId}`);
}

export async function deleteAllSessions() {
  await API.delete<DeleteAllResponse>("/api/sessions/others");
}
