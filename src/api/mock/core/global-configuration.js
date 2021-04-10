const GlobalConfiguration = require("mockjs");
let baseUrl = process.env.VUE_APP_API_ROOT;
// 获取 mock.Random 对象
// eslint-disable-next-line no-unused-vars
const Random = GlobalConfiguration.Random;

GlobalConfiguration.mock(
  RegExp(baseUrl + "/core/global-configuration"),
  "get",
  function (params) {
    console.log(params);
    return {
      status: 200,
      timestamp: 1593773952719,
      message: "success",
      data: {
        id: "1277509183244460034",
        gitlabHomePath: "http://gitlab.ggjs.sinobest.cn/",
        gitlabApiToken: "sxynF2-S5_owPwGJh5su",
        dockerHost: "http://192.168.13.57:6665",
        workspace: "D:/CAAS/workspace",
        dockerRegistryPath: "http://192.168.13.61",
        dockerRegistryProject: "demo",
        dockerRegistryUsername: "admin",
        dockerRegistryPassword: "Admin@123456",
        mavenHome: "D:/Maven",
        delFlag: 0,
        creator: "default",
        createTime: "2020-06-29 15:48:19",
        modifier: "default",
        modifyTime: "2020-07-03 14:11:20",
      },
    };
  }
);

GlobalConfiguration.mock(
  RegExp(baseUrl + "/core/global-configuration"),
  "put",
  function (params) {
    console.log(params);
    return {
      status: 200,
      timestamp: 1593773976604,
      message: "success",
      data: true,
    };
  }
);

GlobalConfiguration.mock(
  RegExp(baseUrl + "/core/global-configuration"),
  "post",
  function (params) {
    console.log(params);
    return {
      status: 200,
      timestamp: 1593773976604,
      message: "success",
      data: true,
    };
  }
);
