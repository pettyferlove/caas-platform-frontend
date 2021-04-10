import Http from "../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const buildFile = {
  download(id) {
    return Http.DownloadForGet(baseUrl + `/build/file/download/${id}`);
  },
};
export { buildFile };
