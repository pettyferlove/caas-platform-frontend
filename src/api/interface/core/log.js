import Http from "../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const log = {
  buildLog(namespaceId, podName, containerName) {
    return Http.Get(
      baseUrl + `/core/log/build/${namespaceId}/${podName}/${containerName}`
    );
  },
  applicationLog(namespaceId, podName) {
    return Http.Get(
      baseUrl + `/core/log/application/${namespaceId}/${podName}`
    );
  },
};
export { log };
