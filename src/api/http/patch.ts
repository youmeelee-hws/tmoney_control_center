import { apiClient } from "./client";
import type { HttpOptions, HttpResponse } from "./types";

export async function patch<TRes, TBody = unknown>(
  url: string,
  body?: TBody,
  options: HttpOptions = {}
): Promise<TRes> {
  const { config, returnMode = "data" } = options;
  const res = await apiClient.patch<TRes>(url, body, config);
  return (returnMode === "response" ? (res as any) : res.data) as any;
}

export async function patchResponse<TRes, TBody = unknown>(
  url: string,
  body?: TBody,
  options: HttpOptions = {}
): Promise<HttpResponse<TRes>> {
  const { config } = options;
  return apiClient.patch<TRes>(url, body, config);
}
