const ImagesDepository = require("mockjs");
let baseUrl = process.env.VUE_APP_API_ROOT;
// 获取 mock.Random 对象
// eslint-disable-next-line no-unused-vars
const Random = ImagesDepository.Random;

ImagesDepository.mock(
  RegExp(baseUrl + "/core/images-depository/select"),
  "get",
  function (params) {
    console.log(params);
    return {
      status: 200,
      timestamp: 1606455721974,
      message: "success",
      data: [{ projectId: "14", projectName: "default-liuyang03813" }],
    };
  }
);
