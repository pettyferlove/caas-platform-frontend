import Http from "../../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const node = {
  /**
   * 查询节点基本信息列表（All Node）
   * @param params
   * @returns {Promise<*>}
   */
  list(params) {
    return Http.Get(baseUrl + "/kubernetes/node/list", params);
  },
};
export { node };
