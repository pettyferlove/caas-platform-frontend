import Http from "../../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const storageClass = {
  list(params) {
    return Http.Get(baseUrl + "/kubernetes/storage-class/list", params);
  },
  page(params) {
    return Http.Get(baseUrl + "/kubernetes/storage-class/page", params);
  },
};
export { storageClass };
