import type { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
export interface ResponseConfig extends AxiosResponse {
    is2Catch?: boolean;
}
export interface RequestInterceptors<Req = AxiosRequestConfig, Res = ResponseConfig> {
    requestInterceptors?: (config: Req) => Req;
    requestInterceptorsCatch?: (err: any) => any;
    responseInterceptors?: (config: Res) => Res;
    responseInterceptorsCatch?: (err: any) => any;
}
declare type codeType = string | number | boolean;
export declare type SuccessMaps = Record<string, codeType | codeType[]>;
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
    interceptorsObj?: RequestInterceptors<RequestConfig, ResponseConfig>;
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
