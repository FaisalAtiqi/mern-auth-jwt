import type { AppError } from "@/config/apiConfig";
import { ZodError } from "zod";

export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.message;
  }

  if (error instanceof ZodError) {
    return error.issues[0]?.message || "Invalidation error";
  }

  if (error instanceof Error) {
    if (error.message.includes("undefined") || error.message.includes("null")) {
      return "A technical error occurred. Please try again.";
    }
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

export function isAppError(error: unknown): error is AppError {
  return typeof error === "object" && error !== null && "_isAppError" in error;
}
