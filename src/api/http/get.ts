import { apiClient } from "./client";
import type { HttpOptions, HttpResponse } from "./types";

export async function get<T>(
  url: string,
  options: HttpOptions = {}
): Promise<T> {
  const { config, returnMode = "data" } = options;
  const res = await apiClient.get<T>(url, config);
  return (returnMode === "response" ? (res as any) : res.data) as any;
}

export async function getResponse<T>(
  url: string,
  options: HttpOptions = {}
): Promise<HttpResponse<T>> {
  const { config } = options;
  return apiClient.get<T>(url, config);
}
