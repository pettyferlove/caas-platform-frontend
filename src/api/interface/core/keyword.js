import Http from "../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const keyword = {
  list(params) {
    return Http.Get(baseUrl + "/core/keyword/list", params);
  },
  selected(bizId, bizType) {
    return Http.Get(baseUrl + `/core/keyword/selected/${bizType}/${bizId}`);
  },
  allSelected() {
    return Http.Get(baseUrl + `/core/keyword/all-selected`);
  },
  create(params) {
    return Http.PostJSON(baseUrl + "/core/keyword", params);
  },
  update(params) {
    return Http.PutJSON(baseUrl + "/core/keyword", params);
  },
  delete(id) {
    return Http.Delete(baseUrl + `/core/keyword/${id}`);
  },
};
export { keyword };
