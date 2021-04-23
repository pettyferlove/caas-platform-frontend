import Http from "../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const message = {
  loadUnreadMessage() {
    return Http.Get(baseUrl + "/message/load/unread");
  },
  readMessage(params) {
    return Http.Put(baseUrl + "/message/read/" + params);
  },
};
export { message };
