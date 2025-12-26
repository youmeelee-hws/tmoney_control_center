import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",  // vite proxy 기준
  timeout: 10_000, // 10,000 밀리초 = 10초
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 공통 에러 처리 (선택)
 */
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      "API Error";
    return Promise.reject(new Error(message));
  }
);
