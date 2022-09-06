import { AxiosResponse, AxiosRequestConfig, AxiosInstance } from 'axios';

interface ResponseConfig extends AxiosResponse {
    is2Catch?: boolean;
}
interface RequestInterceptors {
    requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;
    requestInterceptorsCatch?: (err: any) => any;
    responseInterceptors?: (config: ResponseConfig) => ResponseConfig;
    responseInterceptorsCatch?: (err: any) => any;
}
declare type SuccessMaps = [string, string | number | boolean] | [];
interface RequestConfig extends AxiosRequestConfig {
    interceptors?: RequestInterceptors;
    successMap?: SuccessMaps;
    canRepeat?: boolean;
}
interface CancelRequestSource {
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

export { CancelRequestSource, RequestConfig, RequestInterceptors, ResponseConfig, SuccessMaps, Request as default };
