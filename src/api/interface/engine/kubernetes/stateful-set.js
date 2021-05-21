import Http from "../../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const statefulSet = {
  get(namespace, name) {
    return Http.Get(
      baseUrl + "/kubernetes/stateful-set/" + namespace + "/" + name
    );
  },
};
export { statefulSet };
