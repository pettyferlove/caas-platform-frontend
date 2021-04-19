import Http from "../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const projectBuild = {
  page(params) {
    return Http.Get(baseUrl + "/core/project-build/page", params);
  },
  create(params) {
    return Http.PostJSON(baseUrl + "/core/project-build", params);
  },
  get(params) {
    return Http.Get(baseUrl + "/core/project-build/" + params);
  },
  update(params) {
    return Http.PutJSON(baseUrl + "/core/project-build", params);
  },
  build(params) {
    return Http.Post(baseUrl + "/core/project-build/build/" + params);
  },
  delete(params) {
    return Http.Delete(baseUrl + "/core/project-build/" + params);
  },
  select(params) {
    return Http.Get(baseUrl + "/core/project-build/select", params);
  },
  updateStatus(params) {
    return Http.Put(baseUrl + "/core/project-build/status", params);
  },
  selectList(id) {
    return Http.Get(baseUrl + `/core/project-build/history/select/${id}`);
  },
  history(buildId, params) {
    return Http.Get(
      baseUrl + `/core/project-build/page/history/${buildId}`,
      params
    );
  },
  buildStep(buildId, jobId) {
    return Http.Get(
      baseUrl + `/core/project-build/build/log/step/${buildId}/${jobId}`
    );
  },
  deleteHistory(historyId) {
    return Http.Delete(baseUrl + `/core/project-build/build/log/${historyId}`);
  },
};
export { projectBuild };
