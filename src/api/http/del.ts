import { apiClient } from "./client";
import type { HttpOptions, HttpResponse } from "./types";

export async function del<TRes>(
  url: string,
  options: HttpOptions = {}
): Promise<TRes> {
  const { config, returnMode = "data" } = options;
  const res = await apiClient.delete<TRes>(url, config);
  return (returnMode === "response" ? (res as any) : res.data) as any;
}

export async function delResponse<TRes>(
  url: string,
  options: HttpOptions = {}
): Promise<HttpResponse<TRes>> {
  const { config } = options;
  return apiClient.delete<TRes>(url, config);
}
