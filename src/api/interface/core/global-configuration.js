import Http from "../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const globalConfiguration = {
  get() {
    return Http.Get(baseUrl + "/core/global-configuration");
  },
  /**
   * 更新配置
   * @param params
   * @returns {Promise<never>}
   */
  update(params) {
    return Http.Put(baseUrl + "/core/global-configuration", params);
  },
  /**
   * 新建配置
   * @param params
   * @returns {Promise<never>}
   */
  create(params) {
    return Http.Post(baseUrl + "/core/global-configuration", params);
  },
};
export { globalConfiguration };
