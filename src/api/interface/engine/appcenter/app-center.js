import Http from "../../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const appCenter = {
  page(params) {
    return Http.Get(baseUrl + "/app-center/page", params);
  },
  search(params) {
    return Http.Get(baseUrl + "/app-center/search", params);
  },
  releases(namespace) {
    return Http.Get(baseUrl + `/app-center/releases/${namespace}`);
  },
  release(namespace, releaseName) {
    return Http.Get(
      baseUrl + `/app-center/release/${namespace}/${releaseName}`
    );
  },
  create(namespace, params) {
    return Http.PostJSON(baseUrl + `/app-center/release/${namespace}`, params);
  },
  update(namespace, params) {
    return Http.PutJSON(baseUrl + `/app-center/release/${namespace}`, params);
  },
  delete(namespace, releaseName) {
    return Http.Delete(
      baseUrl + `/app-center/release/${namespace}/${releaseName}`
    );
  },
  config() {
    return Http.Get(baseUrl + "/app-center/load-config");
  },
  detail(repo, chartName) {
    return Http.Get(baseUrl + `/app-center/detail/${repo}/${chartName}`);
  },
  versions(repo, chartName) {
    return Http.Get(baseUrl + `/app-center/versions/${repo}/${chartName}`);
  },
  readme(repo, chartName, version) {
    return Http.Get(
      baseUrl + `/app-center/readme/${repo}/${chartName}/${version}`
    );
  },
  yaml(repo, chartName, version) {
    return Http.Get(
      baseUrl + `/app-center/yaml/${repo}/${chartName}/${version}`
    );
  },
  schema(repo, chartName, version) {
    return Http.Get(
      baseUrl + `/app-center/schema/${repo}/${chartName}/${version}`
    );
  },
};
export { appCenter };
