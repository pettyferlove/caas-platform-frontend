import Http from "../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const config = {
  page(params) {
    return Http.Get(baseUrl + "/core/config/page", params);
  },
  create(params) {
    return Http.Post(baseUrl + "/core/config", params);
  },
  get(id) {
    return Http.Get(baseUrl + `/core/config/${id}`);
  },
  update(params) {
    return Http.Put(baseUrl + "/core/config", params);
  },
  delete(id) {
    return Http.Delete(baseUrl + `/core/config/${id}`);
  },
  select(namespaceId) {
    return Http.Get(baseUrl + `/core/config/select/${namespaceId}`);
  },
};
export { config };
