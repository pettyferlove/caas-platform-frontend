import Http from "../../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const ingress = {
  get(namespace, name) {
    return Http.Get(baseUrl + "/kubernetes/ingress/" + namespace + "/" + name);
  },
};
export { ingress };
