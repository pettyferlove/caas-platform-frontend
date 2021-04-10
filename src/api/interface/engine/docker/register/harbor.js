import Http from "../../../../http";
import { Base64 } from "js-base64";

let baseUrl = process.env.VUE_APP_API_ROOT;

const harborRegister = {
  searchPublicRepository(params) {
    return Http.Get(baseUrl + "/docker/register/harbor/public/search", params);
  },
  queryRepositoryTag(params) {
    return Http.Get(
      baseUrl +
        "/docker/register/harbor/repository/" +
        Base64.encode(encodeURIComponent(params)) +
        "/tag"
    );
  },
  queryRepository(params) {
    return Http.Get(baseUrl + "/docker/register/harbor/query", params);
  },
};
export { harborRegister };
