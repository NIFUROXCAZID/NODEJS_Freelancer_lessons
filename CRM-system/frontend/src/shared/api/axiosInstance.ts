import axios from "axios";
import { authEvents } from "./authEvents";

import { accessTokenStore } from "./accessTokenStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = accessTokenStore.get();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let isRefreshing = false;

type FailedRequest = {
  resolve: () => void;
  reject: (error: unknown) => void;
};

let failedQueue: FailedRequest[] = [];

function processQueue(error?: unknown): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    const isUnauthorized = error.response?.status === 401;

    const isAuthRequest =
      originalRequest?.url === "/auth/login" ||
      originalRequest?.url === "/auth/refresh" ||
      originalRequest?.url === "/auth/logout";

    if (!isUnauthorized || originalRequest?._retry || isAuthRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    isRefreshing = true;

    try {
      const response = await api.post<{
        accessToken: string;
      }>("/auth/refresh");

      accessTokenStore.set(response.data.accessToken);

      processQueue();

      return api(originalRequest);
    } catch (refreshError) {
      accessTokenStore.clear();

      authEvents.emitUnauthorized();

      processQueue(refreshError);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
