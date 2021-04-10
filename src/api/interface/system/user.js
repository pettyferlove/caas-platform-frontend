import Http from "../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const user = {
  getUserInfo() {
    return Http.Get(baseUrl + "/resource/user-info");
  },
};
export { user };
