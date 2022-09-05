/**
 * @author liejiayong (809206619@qq.com)
 * @Date: 2022-07-01 14：34：45
 * @LastEditTime: 2022-08-04 18:29:28
 * @LastEditors: liejiayong(809206619@qq.com)
 * @Description: In User Settings Edit
 */
import axios from "axios";
import type { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";

export interface RequestInterceptors {
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestInterceptorsCatch?: (err: any) => any;

  responseInterceptors?: (config: AxiosResponse) => AxiosResponse;
  responseInterceptorsCatch?: (err: any) => any;
}
export interface RequestConfig extends AxiosRequestConfig {
  interceptors?: RequestInterceptors;
  successCodeList?: number[];
  canRepeat?: boolean;
}
export interface ResponseConfig extends AxiosResponse {
  is2Catch?: boolean /* 用于拦截ResponseConfig触发catch时使用 */;
}

export interface CancelRequestSource {
  [index: string]: () => void;
}

const isBoolean = (val: unknown) =>
  Object.prototype.toString.call(val) === "[object Boolean]";

class Request {
  instance: AxiosInstance;

  interceptorsObj?: RequestInterceptors;

  cancelRequestSourceList?: CancelRequestSource[];

  requestUrlList?: string[];

  successCodeList?: number[];

  constructor(config: RequestConfig) {
    this.instance = axios.create(config);
    this.interceptorsObj = config.interceptors;
    this.requestUrlList = [];
    this.successCodeList = config.successCodeList || [200];
    this.cancelRequestSourceList = [];
    this.instance.interceptors.request.use(
      (res: RequestConfig) => res,
      (err: any) => err
    );
    this.instance.interceptors.request.use(
      this.interceptorsObj?.requestInterceptors,
      this.interceptorsObj?.requestInterceptorsCatch
    );
    this.instance.interceptors.response.use(
      this.interceptorsObj?.responseInterceptors,
      this.interceptorsObj?.responseInterceptorsCatch
    );
    this.instance.interceptors.response.use(
      (res) => res,
      (err: any) => err
    );
  }

  request<T = any>(config: RequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      config.canRepeat = isBoolean(config.canRepeat) ? config.canRepeat : true;
      if (config.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(config);
      }
      const { url, canRepeat } = config;
      if (!canRepeat && url) {
        this.requestUrlList?.push(url);
        config.cancelToken = new axios.CancelToken((c) => {
          this.cancelRequestSourceList?.push({
            [url]: c,
          });
        });
      }
      this.instance
        .request<any, ResponseConfig>(config)
        .then((res) => {
          if (config.interceptors?.responseInterceptors) {
            res = config.interceptors.responseInterceptors(res);
          }
          res.status !== 200 || res.is2Catch
            ? reject(res.data)
            : resolve(res.data);
        })
        .catch((err: any) => {
          reject(err);
        })
        .finally(() => {
          url && this.delUrl(url);
        });
    });
  }

  private getSourceIndex(url: string): number {
    return this.cancelRequestSourceList?.findIndex(
      (item: CancelRequestSource) => Object.keys(item)[0] === url
    ) as number;
  }

  private delUrl(url: string) {
    const urlIndex = this.requestUrlList?.findIndex((u) => u === url);
    const sourceIndex = this.getSourceIndex(url);
    urlIndex !== -1 && this.requestUrlList?.splice(urlIndex as number, 1);
    sourceIndex !== -1 &&
      this.cancelRequestSourceList?.splice(sourceIndex as number, 1);
  }

  cancelAllRequest() {
    this.cancelRequestSourceList?.forEach((source) => {
      const key = Object.keys(source)[0];
      source[key]();
    });
  }

  cancelRequest(url: string | string[]) {
    if (typeof url === "string") {
      const sourceIndex = this.getSourceIndex(url);
      sourceIndex >= 0 && this.cancelRequestSourceList?.[sourceIndex][url]();
    } else {
      url.forEach((u) => {
        const sourceIndex = this.getSourceIndex(u);
        sourceIndex >= 0 && this.cancelRequestSourceList?.[sourceIndex][u]();
      });
    }
  }
}

export default Request;
