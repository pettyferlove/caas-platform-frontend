import Http from "../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const imagesDepository = {
  select() {
    return Http.Get(baseUrl + "/core/images-depository/select");
  },
};
export { imagesDepository };
