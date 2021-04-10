import Http from "../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const userConfiguration = {
  get() {
    return Http.Get(baseUrl + "/core/user-configuration");
  },
  check() {
    return Http.Get(baseUrl + "/core/user-configuration/check");
  },
  refresh() {
    return Http.Put(baseUrl + "/core/user-configuration/refresh");
  },
  /**
   * 更新配置
   * @param params
   * @returns {Promise<never>}
   */
  update(params) {
    return Http.Put(baseUrl + "/core/user-configuration", params);
  },
  /**
   * 新建配置
   * @param params
   * @returns {Promise<never>}
   */
  create(params) {
    return Http.Post(baseUrl + "/core/user-configuration", params);
  },
};
export { userConfiguration };
