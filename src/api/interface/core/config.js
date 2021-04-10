import Http from "../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const config = {
  page(params) {
    return Http.Get(baseUrl + "/core/config/page", params);
  },
  create(params) {
    return Http.Post(baseUrl + "/core/config", params);
  },
  get(params) {
    return Http.Get(baseUrl + "/core/config/" + params);
  },
  update(params) {
    return Http.Put(baseUrl + "/core/config", params);
  },
  delete(params) {
    return Http.Delete(baseUrl + "/core/config/" + params);
  },
};
export { config };
