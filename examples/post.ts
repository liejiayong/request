import http, { cancelAllRequest, cancelRequest  } from "./index";

export class Post {
  static getPost() {
     return http({
    method: "get",
    url: "/api/v1/topics",
    canRepeat: false,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: { limit: 1 },
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
  }
}

Post.getPost().then(res=>{console.log('resolve',res)}).catch(res=>console.warn('reject',res))
