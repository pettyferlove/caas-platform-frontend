import Http from "../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const namespace = {
  /**
   * 查询全部应用（All Namespace）
   * @param params
   * @returns {Promise<*>}
   */
  page(params) {
    return Http.Get(baseUrl + "/core/namespace/page", params);
  },
  /**
   * 获取Namespace详情
   * @param id
   * @returns {Promise<never>}
   */
  get(id) {
    return Http.Get(baseUrl + "/core/namespace/" + id);
  },
  detail(id) {
    return Http.Get(baseUrl + "/core/namespace/detail/" + id);
  },
  /**
   * 查询全部Namespace
   * @returns {Promise<never>}
   */
  queryAll() {
    return Http.Get(baseUrl + "/core/namespace/all/list");
  },
  /**
   * 删除命令空间
   * @param id
   * @returns {Promise<never>}
   */
  delete(id) {
    return Http.Delete(baseUrl + "/core/namespace/" + id);
  },
  /**
   * 新建命名空间
   * @param params
   * @returns {Promise<never>}
   */
  create(params) {
    return Http.PostJSON(baseUrl + "/core/namespace", params);
  },
  update(params) {
    return Http.PutJSON(baseUrl + "/core/namespace", params);
  },
};
export { namespace };
