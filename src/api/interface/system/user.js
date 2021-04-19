import Http from "../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const user = {
  getUserInfo() {
    return Http.Get(baseUrl + "/resource/user-info");
  },
  page(params) {
    return Http.Get(baseUrl + "/user/page", params);
  },
  get(id) {
    return Http.Get(baseUrl + `/user/${id}`);
  },
  create(params) {
    return Http.PostJSON(baseUrl + "/user", params);
  },
  update(params) {
    return Http.PutJSON(baseUrl + "/user", params);
  },
};
export { user };
