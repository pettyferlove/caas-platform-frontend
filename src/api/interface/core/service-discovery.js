import Http from "../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const serviceDiscovery = {
  page(namespace, params) {
    return Http.Get(
      baseUrl + "/core/service-discovery/page/" + namespace,
      params
    );
  },
};
export { serviceDiscovery };
