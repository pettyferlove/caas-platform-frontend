import Http from "../../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const daemonSet = {
  get(namespace, name) {
    return Http.Get(
      baseUrl + "/kubernetes/daemon-set/" + namespace + "/" + name
    );
  },
};
export { daemonSet };
