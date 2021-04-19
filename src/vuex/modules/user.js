import Cookies from "js-cookie";
import api from "@/api";
import { setLocalStorage, removeLocalStorage } from "@/libs/localStorage";
// state
const state = {
  isLogin: eval(Cookies.get("is_login")) || false,
  authInfo: {
    access_token: Cookies.get("access_token") || "",
    refresh_token: Cookies.get("refresh_token") || "",
  },
  user: {},
  roles: [],
  permissions: [],
  rememberMe: eval(Cookies.get("remember_me")) || false,
};

// getters
const getters = {
  isLogin: (state) => {
    return state.isLogin;
  },
  getAccessToken: (state) => {
    return state.authInfo.access_token;
  },
  getUser: (state) => {
    return state.user;
  },
  getRoles: (state) => {
    return state.roles;
  },
  getPermissions: (state) => {
    return state.permissions;
  },
};

// actions
const actions = {
  UserLogin({ commit }, loginInfo) {
    return new Promise((resolve, reject) => {
      api.login
        .userLogin(loginInfo.username, loginInfo.password)
        .then(
          (response) => {
            commit("LoginSuccess", {
              user: response.data,
              remember: loginInfo.rememberMe,
            });
            resolve();
          },
          (error) => {
            reject(error);
          }
        )
        .catch((error) => {
          reject(error);
        });
    });
  },
  // eslint-disable-next-line no-empty-pattern
  Logout({}) {
    return new Promise((resolve) => {
      api.login.logout(Cookies.get("access_token")).finally(() => {
        Cookies.remove("is_login");
        Cookies.remove("remember_me");
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        state.isLogin = false;
        state.rememberMe = false;
        state.authInfo = {};
        state.user = {};
        state.roles = [];
        state.permissions = [];
        removeLocalStorage("expires_time");
        removeLocalStorage("save_time");
        resolve();
      });
    });
  },
  UserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      api.user
        .getUserInfo()
        .then((res) => {
          commit("SetUserInfo", res);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

// mutations
const mutations = {
  LoginSuccess(state, info) {
    if (info.remember) {
      Cookies.set("is_login", true, { expires: 7 });
      Cookies.set("remember_me", true, { expires: 7 });
      Cookies.set("access_token", info.user.access_token, { expires: 7 });
      Cookies.set("refresh_token", info.user.refresh_token, {
        expires: 7,
      });
    } else {
      Cookies.set("is_login", true);
      Cookies.set("remember_me", false);
      Cookies.set("access_token", info.user.access_token);
      Cookies.set("refresh_token", info.user.refresh_token);
    }
    setLocalStorage({
      name: "expires_time",
      content: info.user.expires_in,
    });
    setLocalStorage({
      name: "save_time",
      content: new Date().getTime(),
    });
    state.isLogin = true;
    state.rememberMe = info.remember;
    state.authInfo.access_token = info.user.access_token;
    state.authInfo.refresh_token = info.user.refresh_token;
  },
  SetUserInfo(state, info) {
    state.user = info;
    state.roles = info.roles;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
