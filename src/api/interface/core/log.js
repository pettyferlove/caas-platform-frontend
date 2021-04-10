import Http from "../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const log = {
  get(namespaceId, podName, containerName) {
    return Http.Get(
      baseUrl + `/core/log/build/${namespaceId}/${podName}/${containerName}`
    );
  },
};
export { log };
