import Request from '../build/request.es'
import type { RequestConfig } from '../build/types/index'

const request = new Request({
  baseURL: "https://cnodejs.org/",
  successMap: {'success': true},
  interceptors: {
    // 实例请求拦截
    requestInterceptors: (config) => {
      return config;
    },
    // 实例响应拦截
    responseInterceptors: (result) => {
      return result;
    },
  },
});

interface iRequestConfig<T> extends RequestConfig {
  data?: T;
}
interface iResponse<T=any> {
  code: number;
  message: string;
  data: T;
}
const http = <D, T = any>(config: iRequestConfig<D>) => {
  const { method = "GET" } = config;
  if (method === "GET" || method === "get") {
    config.params = config.data;
  }
  return request.request<iResponse<T>>(config);
};
export const cancelRequest = (url: string | string[]) => {
  return request.cancelRequest(url);
};
export const cancelAllRequest = () => {
  return request.cancelAllRequest();
};
export default http
