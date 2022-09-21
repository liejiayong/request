## @liejy/request

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/wangkaiwd/typescript-library-template/Deploy%20to%20GitHub%20pages)
![license](https://img.shields.io/github/license/wangkaiwd/typescript-library-template)

一个基于 Axios 封装的网络请求库

### Usage

```shell
npm install @liejy/request
```

### Feature

- 支持多种拦截方式，触发顺序：

1.  实例拦截
2.  函数调用拦截

- 支持取消单个请求
- 支持取消所有请求

### API

使用 Request 构造器生成实例

#### Request(config)

配置`Request`构造函数，配置项`config`与 `Axios` 基本保持一致。

> 注：v0.0.2 与 v0.0.3 的区别在于 successMap 传递的参数不一致。在 v0.0.2 版本中使用元组，如：['code', 0]来拦截相应状态；在 v0.0.3 版本中由于遇到多种成功状态拦截的场景，因此改用为对象形式，如：{code:0,ret:0}以作扩展。

```ts
import Request from "@liejy/request";

const request = new Request({
  baseURL: "https://cnodejs.org/",
  successMap: { code: 0 },
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
```

其中`config`配置新增几项配置

```ts
export type SuccessMaps = Record<string, string | number | boolean>;
export interface RequestConfig extends AxiosRequestConfig {
  interceptors?: RequestInterceptors;
  successMap?: SuccessMaps /* 是否开启响应态处理，返回成功永远resolve，返回错误永远reject。格式如： ['code', 0] */;
  canRepeat?: boolean /* 是否同时发送相同请求 */;
}
```

#### request#request(config)

实例请求方法`request#request(config)`，配置项`config`与 `Axios` 保持一致。

```ts
import { RequestConfig } from "@liejy/request";
interface iRequestConfig<T> extends RequestConfig {
  data?: T;
}
interface iResponse<T> {
  code: number;
  message: string;
  data: T;
}
export const http = <D, T = any>(config: iRequestConfig<D>) => {
  const { method = "GET" } = config;
  if (method === "GET" || method === "get") {
    config.params = config.data;
  }
  return request.request<iResponse<T>>(config);
};

http({
  method: "get",
  url: "/api/v1/topics",
  canRepeat: false,
  params: { id: 1 },
  interceptors: {
    // 函数请求拦截器
    requestInterceptors: (config) => {
      return config;
    },
    // 函数响应拦截器
    responseInterceptors: (result) => {
      return result;
    },
  },
});
```

#### request#cancelRequest(url)

取消单个请求。

```ts
export const cancelRequest = (url: string | string[]) => {
  return request.cancelRequest(url);
};
```

#### request#cancelAllRequest()

取消多个请求。

```ts
export const cancelAllRequest = () => {
  return request.cancelAllRequest();
};
```
