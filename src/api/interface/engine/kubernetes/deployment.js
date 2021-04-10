import Http from "../../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const deployment = {
  /**
   * 查询全部应用（All Namespace）
   * @param params
   * @returns {Promise<*>}
   */
  allPage(params) {
    return Http.Get(baseUrl + "/kubernetes/deployment/all/page", params);
  },
  /**
   * 根据Namespace查询应用
   * @param name
   * @param params
   * @returns {Promise<never>}
   */
  page(name, params) {
    return Http.Get(
      baseUrl + "/kubernetes/deployment/" + name + "/page",
      params
    );
  },
  get(namespace, deployment) {
    return Http.Get(
      baseUrl + "/kubernetes/deployment/" + namespace + "/" + deployment
    );
  },
};
export { deployment };
