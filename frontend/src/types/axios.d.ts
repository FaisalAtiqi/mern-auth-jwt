import "axios";

import "axios";
import type { AxiosRequestConfig } from "axios";

declare module "axios" {
  // Override AxiosInstance methods to return the response data directly, instead of the full AxiosResponse object.
  interface AxiosInstance {
    get<T = unknown, R = T, D = unknown>(
      url: string,
      config?: AxiosRequestConfig<D>,
    ): Promise<R>;

    post<T = unknown, R = T, D = unknown>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<R>;

    put<T = unknown, R = T, D = unknown>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<R>;

    patch<T = unknown, R = T, D = unknown>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<R>;

    delete<T = unknown, R = T, D = unknown>(
      url: string,
      config?: AxiosRequestConfig<D>,
    ): Promise<R>;
  }

  // Add a custom property to the request config to track if a request has already been retried, preventing infinite loops during token refresh.
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}
