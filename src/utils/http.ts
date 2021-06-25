import Axios, { AxiosRequestConfig } from "axios"
import { BASE_URL } from "@/utils/url"

// 创建实例
const HTTP = Axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {'X-Custom-Header': 'foobar'}
})

// 请求拦截器
HTTP.interceptors.request.use((config) => {
  // 判断token
  const token = sessionStorage.getItem("TOKEN");
  token && (config.headers["Authorization"] = token);
  return dealRequest(config);
}, (error) => {
  return Promise.reject(error);
})

// 返回拦截器
HTTP.interceptors.response.use((respose) => {
  return respose
}, (error) => {
  return Promise.reject(error)
})

// 处理请求：get请求时增加时间戳
function dealRequest(config: AxiosRequestConfig) {
  const method:any = config.method;
  if(method.toLowerCase() === 'get') {
    config.params && (config.params.timestamp = new Date().getTime());
  }
  return config;
}

// 处理错误
function dealError(error: any) {
  const errorCode = error.response;
  // 进行错误代码判断
  console.log(errorCode)
}

// 封装post请求
export function post(api: string, data = {}){
  return new Promise((resolve, reject) => {
    HTTP.post(api, data).then((response) => {
      resolve(response);
    }).catch((error) => {
      reject(error);
    })
  })
}

// 封装get请求
export function get(api: string, params = {}) {
  return new Promise((resolve, reject) => {
    HTTP.get(api, {
      params: params
    }).then((respose) => {
      resolve(respose);
    }).catch((error) => {
      reject(error)
    })
  })
}

// 抛出HTTP实例
export const http = HTTP;