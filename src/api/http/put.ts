import { apiClient } from "./client";
import type { HttpOptions, HttpResponse } from "./types";

export async function put<TRes, TBody = unknown>(
  url: string,
  body?: TBody,
  options: HttpOptions = {}
): Promise<TRes> {
  const { config, returnMode = "data" } = options;
  const res = await apiClient.put<TRes>(url, body, config);
  return (returnMode === "response" ? (res as any) : res.data) as any;
}

export async function putResponse<TRes, TBody = unknown>(
  url: string,
  body?: TBody,
  options: HttpOptions = {}
): Promise<HttpResponse<TRes>> {
  const { config } = options;
  return apiClient.put<TRes>(url, body, config);
}
