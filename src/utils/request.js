import axios from "axios";

import { message } from "antd";

import useTokenStore from "@/stores/token";

class Request {
  instance;
  // 存放取消请求控制器Map
  abortControllerMap;

  constructor(config) {
    this.instance = axios.create(config);
    this.abortControllerMap = new Map();

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        if (config.url !== "/react/user/login" && config.url !== "/react/reguser") {
          config.headers["Authorization"] = useTokenStore.getState().token;
        }

        const controller = new AbortController();
        const url = config.url || "";
        config.signal = controller.signal;
        this.abortControllerMap.set(url, controller);

        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      async (response) => {
        const url = response.config.url || "";
        this.abortControllerMap.delete(url);

        if (response.data.code === 200) {
          // 接口正常返回
          // return response.data
          return Promise.resolve(response.data);
        } else if (response.data.code === 403) {
          // window.location.href = `/luReactAdmin/login`;
          // return message.error(response.data.message);
        } else {
          return message.error(response.data.message);
        }
      },
      (err) => {
        // if (err.response?.status === 401) {
        //     // 登录态失效，清空userInfo，跳转登录页
        //     // window.location.href = `/login?redirect=${window.location.pathname}`
        //     window.location.href = `/login`
        // }

        return Promise.reject(err);
      }
    );
  }

  // 取消全部请求
  cancelAllRequest() {
    for (const [, controller] of this.abortControllerMap) {
      controller.abort();
    }
    this.abortControllerMap.clear();
  }

  // 取消指定的请求
  cancelRequest(url) {
    const urlList = Array.isArray(url) ? url : [url];
    for (const _url of urlList) {
      this.abortControllerMap.get(_url)?.abort();
      this.abortControllerMap.delete(_url);
    }
  }

  request(config) {
    return this.instance.request(config);
  }

  get(url, config) {
    return this.instance.get(url, config);
  }

  post(url, data, config) {
    return this.instance.post(url, data, config);
  }
}

export const httpRequest = new Request({
  baseURL: "",
});
