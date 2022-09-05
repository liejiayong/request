## @liejy/request

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/wangkaiwd/typescript-library-template/Deploy%20to%20GitHub%20pages)
![license](  https://img.shields.io/github/license/wangkaiwd/typescript-library-template)

一个基于Axios封装的网络请求库

### Usage

```shell
npm install @liejy/request
```

### Feature

* 支持多种拦截方式，触发顺序：
 1. 实例拦截
 2. 函数调用拦截
* 支持取消单个请求
* 支持取消所有请求

### API

使用Request构造器生成实例

#### Request(config)

配置`Request`构造函数，配置项`config`与 `Axios` 保持一致。

```ts
import Request from '@liejy/request'

const request = new Request({
  baseURL: "https://cnodejs.org/",
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

#### request#request(config)

实例请求方法`request#request(config)`，配置项`config`与 `Axios` 保持一致。

```ts
import { RequestConfig } from '@liejy/request'
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
