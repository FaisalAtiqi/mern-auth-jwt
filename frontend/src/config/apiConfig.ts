import axios, { AxiosError, type CreateAxiosDefaults } from "axios";
import queryClient from "./queryClient";
import { QUERY_KEYS } from "@/lib/queryKeys";

type ApiErrorResponse = {
  message: string;
  errorCode?: string;
};

export interface AppError extends ApiErrorResponse {
  _isAppError: boolean;
  status?: number;
  isNetworkError: boolean;
}

const options: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};

// Used ONLY for refreshing tokens, to avoid infinite retry loops in the main API client.
const RefreshClient = axios.create(options);
RefreshClient.interceptors.response.use((response) => response.data);

// Main API client instance used throughout the app
export const API = axios.create(options);

// Prevent multiple simultaneous refresh requests.
let refreshPromise: Promise<unknown> | null = null;
const isDev = import.meta.env.DEV;

API.interceptors.response.use(
  (response) => response.data,

  async (error) => {
    const { config, response } = error;

    // Request config can be undefined in rare cases
    if (!config) {
      return Promise.reject(error);
    }

    const status = response?.status;
    const data = response?.data;

    // If the request failed due to an expired access token, attempt to refresh it and retry the request.
    if (
      status === 401 &&
      data?.errorCode === "InvalidAccessToken" &&
      !config._retry
    ) {
      config._retry = true;

      try {
        await refreshAccessToken();
        return API(config);
      } catch (refreshError) {
        if (isDev) {
          console.log(
            "Token refresh failed. Logging out user...",
            refreshError,
          );
        }

        queryClient.setQueryData(QUERY_KEYS.user, null);
        return Promise.reject(refreshError);
      }
    }

    // Normalize axios errors
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const appError: AppError = {
        _isAppError: true,
        message: getAxiosErrorMessage(error),
        status,
        errorCode: data?.errorCode,
        isNetworkError: !response,
      };

      return Promise.reject(appError);
    }

    return Promise.reject(error);
  },
);

function getAxiosErrorMessage(error: AxiosError<ApiErrorResponse>): string {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.code === "ECONNABORTED") {
    return "Request timed out. Please try again.";
  }

  if (!error.response) {
    return "Network error: Please check your internet connection.";
  }

  return "An unexpected request error occurred.";
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = RefreshClient.get("/api/auth/refresh").finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}
