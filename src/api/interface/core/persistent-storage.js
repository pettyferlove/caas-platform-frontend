import Http from "../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const persistentStorage = {
  page(namespaceId, params) {
    return Http.Get(
      baseUrl + `/core/persistent-storage/page/${namespaceId}`,
      params
    );
  },
  create(params) {
    return Http.PostJSON(baseUrl + "/core/persistent-storage", params);
  },
  get(namespaceId, id) {
    return Http.Get(baseUrl + `/core/persistent-storage/${namespaceId}/${id}`);
  },
  update(params) {
    return Http.PutJSON(baseUrl + "/core/persistent-storage", params);
  },
  select(namespaceId) {
    return Http.Get(baseUrl + `/core/persistent-storage/select/${namespaceId}`);
  },
};
export { persistentStorage };
