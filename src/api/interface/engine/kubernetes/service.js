import Http from "../../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const service = {
  get(namespace, name) {
    return Http.Get(baseUrl + "/kubernetes/service/" + namespace + "/" + name);
  },
};
export { service };
