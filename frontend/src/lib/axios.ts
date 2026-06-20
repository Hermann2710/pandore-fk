import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_URL || "/api-proxy";

const api = axios.create({
  baseURL: BASE,
  withCredentials: true, // send HTTP-only JWT cookies on every request
});

// Endpoints that should NEVER trigger a redirect on 401.
// These are either the auth flow itself or optional background fetches.
const SILENT_ENDPOINTS = [
  "/auth/me/",
  "/auth/refresh/",
  "/auth/login/",
  "/auth/register/",
];

const isSilent = (url: string = "") =>
  SILENT_ENDPOINTS.some((e) => url.includes(e));

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Not a 401, or already retried — just reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Silent endpoints: never refresh or redirect, just reject cleanly
    if (isSilent(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Attempt a silent token refresh using the refresh cookie
      await axios.post(`${BASE}/auth/refresh/`, {}, { withCredentials: true });
      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      // Refresh failed — the session is truly expired, redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
