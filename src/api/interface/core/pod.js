import Http from "../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const pod = {
  /**
   * 查询Pod列表
   * @param params
   * @returns {Promise<*>}
   */
  page(params) {
    return Http.Get(baseUrl + "/core/pod/page", params);
  },
  /**
   * 删除Pod
   * @param namespace
   * @param name
   * @returns {Promise<never>}
   */
  delete(namespace, name) {
    return Http.Delete(baseUrl + "/core/pod/" + namespace + "/" + name);
  },
};
export { pod };
