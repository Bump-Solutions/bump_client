import { AxiosError, AxiosResponse } from "axios";

export type ApiResponse<T = any> = AxiosResponse<T>;
export type ApiError<T = any> = AxiosError<T>;
