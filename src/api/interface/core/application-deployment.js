import Http from "../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const applicationDeployment = {
  page(namespace, params) {
    return Http.Get(
      baseUrl + "/core/application-deployment/page/" + namespace,
      params
    );
  },
  get(namespace, params) {
    return Http.Get(
      baseUrl + "/core/application-deployment/" + namespace + "/" + params
    );
  },
  create(namespace, params) {
    return Http.PostJSON(
      baseUrl + "/core/application-deployment/" + namespace,
      params
    );
  },
  update(namespace, params) {
    return Http.PutJSON(
      baseUrl + "/core/application-deployment/" + namespace,
      params
    );
  },
  delete(namespace, params) {
    return Http.Delete(
      baseUrl + "/core/application-deployment/" + namespace + "/" + params
    );
  },
};
export { applicationDeployment };
