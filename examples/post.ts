import http, {cancelAllRequest,cancelRequest  } from "./index";

http({
  method: "get",
  url: "/api/v1/topics",
  canRepeat: false,
  params: { id: 1 },
  interceptors: {
    // 请求拦截器
    requestInterceptors: (config) => {
      console.log("实例请求拦截器1");

      return config;
    },
    // 响应拦截器
    responseInterceptors: (result) => {
      console.log("实例响应拦截器1");
      return result;
    },
  },
});
