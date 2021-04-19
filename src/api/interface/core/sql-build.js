import Http from "../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const sqlBuild = {
  page(params) {
    return Http.Get(baseUrl + "/core/sql-build/page", params);
  },
  create(params) {
    return Http.PostJSON(baseUrl + "/core/sql-build", params);
  },
  get(params) {
    return Http.Get(baseUrl + "/core/sql-build/" + params);
  },
  update(params) {
    return Http.PutJSON(baseUrl + "/core/sql-build", params);
  },
  build(params) {
    return Http.Post(baseUrl + "/core/sql-build/build/" + params);
  },
  delete(params) {
    return Http.Delete(baseUrl + "/core/sql-build/" + params);
  },
  selectList(id) {
    return Http.Get(baseUrl + `/core/sql-build/history/select/${id}`);
  },
  history(buildId, params) {
    return Http.Get(
      baseUrl + `/core/sql-build/page/history/${buildId}`,
      params
    );
  },
  buildStep(buildId, jobId) {
    return Http.Get(
      baseUrl + `/core/sql-build/build/log/step/${buildId}/${jobId}`
    );
  },
  deleteHistory(historyId) {
    return Http.Delete(baseUrl + `/core/sql-build/build/log/${historyId}`);
  },
};
export { sqlBuild };
