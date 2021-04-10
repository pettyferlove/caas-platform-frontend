import Http from "../../http";
import { Base64 } from "js-base64";

let clientId = process.env.VUE_APP_CLIENT_ID;
let clientSecret = process.env.VUE_APP_CLIENT_SECRET;

const scope = "";

const login = {
  userLogin(username, password) {
    let grant_type = "password";
    return Http.Axios({
      url: "/oauth/token",
      headers: {
        isBasic: true,
        Authorization: "Basic " + Base64.encode(clientId + ":" + clientSecret),
      },
      method: "post",
      params: { username, password, scope, grant_type },
    });
  },
  /**
   * 刷新用户Token
   * @returns {*}
   * @param refresh_token
   */
  tokenRefresh(refresh_token) {
    let grant_type = "refresh_token";
    return Http.Axios({
      url: "/oauth/token",
      headers: {
        isBasic: true,
        Authorization: "Basic " + Base64.encode(clientId + ":" + clientSecret),
      },
      method: "post",
      params: { refresh_token, scope, grant_type },
    });
  },
  /**
   * 用户退出
   * @returns {*|Promise<T | never>}
   * @param token
   */
  logout(token) {
    return Http.Axios({
      url: "/oauth/token",
      headers: {
        isBasic: true,
        Authorization: "Basic " + Base64.encode(clientId + ":" + clientSecret),
      },
      method: "delete",
      params: { token },
    });
  },
};
export { login };
