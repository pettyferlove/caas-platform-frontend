import Http from "../../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const secret = {
  get(namespace, name) {
    return Http.Get(baseUrl + "/kubernetes/secret/" + namespace + "/" + name);
  },
};
export { secret };
