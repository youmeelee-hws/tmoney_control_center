import type { AxiosRequestConfig, AxiosResponse } from "axios";

export type HttpConfig = AxiosRequestConfig;

// axios response 전체가 필요한 경우도 있어서 옵션으로 열어둠
export type HttpReturnMode = "data" | "response";

export type HttpOptions = {
  config?: HttpConfig;
  returnMode?: HttpReturnMode; // default: "data"
};

export type HttpResult<T> = T;
export type HttpResponse<T> = AxiosResponse<T>;
