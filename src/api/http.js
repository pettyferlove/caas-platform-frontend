import axios from "axios";
import qs from "qs";
import Cookies from "js-cookie";
import store from "@/vuex/store";
import router from "@/router";
import utils from "@/libs/utils";
import api from "@/api";

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded; charset=UTF-8";
// axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.timeout = 300000;
axios.defaults.withCredentials = true;

/*是否有请求正在刷新token*/
window.isRefreshing = false;
/*被挂起的请求数组*/
let refreshSubscribers = [];

/*获取刷新token请求的token*/
function getRefreshToken() {
  return Cookies.get("refresh_token");
}

/*获取用户token请求的token*/
function getAccessToken() {
  return Cookies.get("access_token");
}

/*push所有请求到数组中*/
function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function clearAuthInfo() {
  store.dispatch("Logout").finally(() => {
    router.push({ path: "/other/login" }).catch(() => {});
  });
}

/*刷新请求（refreshSubscribers数组中的请求得到新的token之后会自执行，用新的token去请求数据）*/
function onRefreshed(accessToken) {
  refreshSubscribers.map((cb) => cb(accessToken));
}

axios.interceptors.request.use(
  (config) => {
    // loading
    let isLogin = Cookies.get("is_login");
    let isBasic = (config.headers || {}).isBasic === true;
    if (isLogin) {
      if (isBasic) {
        return config;
      } else {
        if (utils.isTokenExpired() && getRefreshToken() !== "undefined") {
          if (!window.isRefreshing) {
            window.isRefreshing = true;
            api.login
              .tokenRefresh(getRefreshToken())
              .then((response) => {
                if (response.status === 200) {
                  response = response.data;
                  window.isRefreshing = false;
                  if (!isBasic) {
                    config.headers.Authorization =
                      "Bearer " + response.access_token;
                  }
                  let rememberMe = eval(Cookies.get("remember_me"));
                  store.commit("LoginSuccess", {
                    user: response,
                    remember: rememberMe,
                  });
                  /*执行数组里的函数,重新发起被挂起的请求*/
                  onRefreshed(response.access_token);
                  /*执行onRefreshed函数后清空数组中保存的请求*/
                  refreshSubscribers = [];
                } else {
                  return Promise.reject(new Error("Refresh Error!"));
                }
              })
              .catch(() => {
                // 登录Token续约失败直接跳转至Login并清除Cookies登录信息
                clearAuthInfo();
              });
            return new Promise((resolve) => {
              subscribeTokenRefresh((accessToken) => {
                config.headers.Authorization = "Bearer " + accessToken;
                resolve(config);
              });
            });
          } else {
            return new Promise((resolve) => {
              subscribeTokenRefresh((accessToken) => {
                config.headers.Authorization = "Bearer " + accessToken;
                resolve(config);
              });
            });
          }
        } else {
          let accessToken = getAccessToken();
          config.headers.Authorization = "Bearer " + accessToken;
          return config;
        }
      }
    } else {
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      clearAuthInfo();
      return Promise.reject(new Error(error.response.data.message));
    }
    if (error.response && error.response.status === 403) {
      return Promise.reject(new Error("没有权限访问该接口"));
    }
    if (error.response && error.response.status === 404) {
      return Promise.reject(new Error("未找到服务"));
    } else {
      return Promise.reject(
        new Error(error.response.data.message || "服务异常")
      );
    }
  }
);

export default {
  Post(url, params) {
    return axios.post(url, qs.stringify(params)).then((response) => {
      return response.data;
    });
  },
  PostJSON(url, params) {
    return axios
      .post(url, JSON.stringify(params), {
        headers: { "Content-Type": "application/json; charset=UTF-8" },
      })
      .then((response) => {
        return response.data;
      });
  },
  Put(url, params) {
    return axios.put(url, qs.stringify(params)).then((response) => {
      return response.data;
    });
  },
  PutJSON(url, params) {
    return axios
      .put(url, JSON.stringify(params), {
        headers: { "Content-Type": "application/json; charset=UTF-8" },
      })
      .then((response) => {
        return response.data;
      });
  },
  Get(url, params) {
    return axios.get(url, { params: params }).then((response) => {
      return response.data;
    });
  },
  Delete(url, params) {
    return axios.delete(url, { params: params }).then((response) => {
      return response.data;
    });
  },
  DownloadForGet(url, params) {
    return axios
      .get(url, { responseType: "blob", params: params })
      .then((response) => {
        return response;
      });
  },
  DownloadForPost(url, params) {
    return axios
      .post(url, qs.stringify(params), { responseType: "blob" })
      .then((response) => {
        return response;
      });
  },
  Upload(url, params) {
    return axios
      .post(url, params, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response.data;
      });
  },
  Axios: axios,
};
