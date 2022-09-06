import type { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
export interface ResponseConfig extends AxiosResponse {
    is2Catch?: boolean;
}
export interface RequestInterceptors {
    requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;
    requestInterceptorsCatch?: (err: any) => any;
    responseInterceptors?: (config: ResponseConfig) => ResponseConfig;
    responseInterceptorsCatch?: (err: any) => any;
}
export declare type SuccessMaps = [string, string | number | boolean] | [];
export interface RequestConfig extends AxiosRequestConfig {
    interceptors?: RequestInterceptors;
    successMap?: SuccessMaps;
    canRepeat?: boolean;
}
export interface CancelRequestSource {
    [index: string]: () => void;
}
declare class Request {
    instance: AxiosInstance;
    interceptorsObj?: RequestInterceptors;
    cancelRequestSourceList: CancelRequestSource[];
    requestUrlList: string[];
    successMap: SuccessMaps;
    constructor(config: RequestConfig);
    request<T = any>(config: RequestConfig): Promise<T>;
    private getSourceIndex;
    private delUrl;
    cancelAllRequest(): void;
    cancelRequest(url: string | string[]): void;
}
export default Request;
