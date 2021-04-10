const AutoBuild = require("mockjs");
let baseUrl = process.env.VUE_APP_API_ROOT;
// 获取 mock.Random 对象
// eslint-disable-next-line no-unused-vars
const Random = AutoBuild.Random;

AutoBuild.mock(
  RegExp(baseUrl + "/core/auto-build/page"),
  "get",
  function (params) {
    console.log(params);
    return {
      status: 200,
      timestamp: 1606455031972,
      message: "success",
      data: {
        records: [
          {
            id: "1287947370978689025",
            projectName: "auto-build-examples",
            sourceProjectName: "auto-build-examples",
            sourceProjectWebUrl:
              "http://gitlab.ggjs.sinobest.cn/liuyang03813/auto-build-examples",
            openAutoBuild: 0,
            lastState: "1",
            successfulNumber: "7",
            failuresNumber: "1",
            creator: "default",
            createTime: "2020-07-28T11:05:57",
          },
        ],
        total: 13,
        size: 15,
        current: 1,
        orders: [],
        searchCount: true,
        pages: 1,
      },
    };
  }
);

AutoBuild.mock(RegExp(baseUrl + "/core/auto-build"), "post", function (params) {
  console.log(params);
  return {
    status: 200,
    timestamp: 1606455171941,
    message: "success",
    data: true,
  };
});

AutoBuild.mock(
  RegExp(baseUrl + "/core/auto-build"),
  "update",
  function (params) {
    console.log(params);
    return {
      status: 200,
      timestamp: 1606455171941,
      message: "success",
      data: true,
    };
  }
);

AutoBuild.mock(
  RegExp(baseUrl + "/core/auto-build/status"),
  "update",
  function (params) {
    console.log(params);
    return {
      status: 200,
      timestamp: 1606455171941,
      message: "success",
      data: true,
    };
  }
);

AutoBuild.mock(
  RegExp(baseUrl + "/core/auto-build"),
  "delete",
  function (params) {
    console.log(params);
    return {
      status: 200,
      timestamp: 1606455171941,
      message: "success",
      data: true,
    };
  }
);

AutoBuild.mock(
  RegExp(baseUrl + "/core/auto-build/((?!select|check).)*$"),
  "get",
  function (params) {
    console.log(params);
    return {
      status: 200,
      timestamp: 1606455200319,
      message: "success",
      data: {
        id: "1287947370978689025",
        cloneUrl:
          "git@gitlab.ggjs.sinobest.cn:liuyang03813/auto-build-examples.git",
        projectId: "965",
        projectName: "auto-build-examples",
        sourceProjectName: "auto-build-examples",
        sourceProjectWebUrl:
          "http://gitlab.ggjs.sinobest.cn/liuyang03813/auto-build-examples",
        imagesDepositoryAlias: "default-liuyang03813",
        branch: "master",
        triggerMethod: "branch",
        openAutoBuild: 0,
        needBuildProject: 1,
        buildTool: "maven",
        buildParams: "",
        dockerfileAlreadyExists: 0,
        dockerfilePath: "",
        dockerfileContent:
          "FROM pettyfer/apline-open-jre8:latest\nRUN mkdir -p /home\nWORKDIR /home\nEXPOSE 8881\nCOPY ./target/auto-build-examples-0.0.1-SNAPSHOT.jar app.jar\nENTRYPOINT java -jar -Dfile.encoding=UTF-8 -Xmn64m -Xms256m -Xmx256m app.jar",
      },
    };
  }
);

AutoBuild.mock(
  RegExp(baseUrl + "/core/core/auto-build/build/.*"),
  "post",
  function (params) {
    console.log(params);
    return {
      status: 200,
      timestamp: 1606455171941,
      message: "success",
      data: true,
    };
  }
);

AutoBuild.mock(
  RegExp(baseUrl + "/core/auto-build/select"),
  "get",
  function (params) {
    console.log(params);
    return {
      status: 200,
      timestamp: 1606455200319,
      message: "success",
      data: [
        {
          id: "1287947370978689025",
          projectName: "auto-build-examples",
          imagesDepositoryAlias: "default-liuyang03813",
          imagesDepositoryId: "14",
        },
      ],
    };
  }
);
