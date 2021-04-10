const ApplicationDeployment = require("mockjs");
let baseUrl = process.env.VUE_APP_API_ROOT;
// 获取 mock.Random 对象
// eslint-disable-next-line no-unused-vars
const Random = ApplicationDeployment.Random;

ApplicationDeployment.mock(
  RegExp(baseUrl + "/core/application-deployment/page/.*"),
  "get",
  function (params) {
    console.log(params);
    return {
      status: 200,
      timestamp: 1606455836991,
      message: "success",
      data: {
        records: [
          {
            id: "1331480607671545858",
            imageName: "192.168.13.61/default-liuyang03813/auto-build-examples",
            imageTag: "1605766435851",
            name: "auto-build-examples",
            replicas: 1,
            readyReplicas: 1,
            creator: "default",
            createTime: "2020-11-25T14:11:29",
          },
        ],
        total: 1,
        size: 10,
        current: 1,
        orders: [],
        searchCount: true,
        pages: 1,
      },
    };
  }
);

ApplicationDeployment.mock(
  RegExp(baseUrl + "/core/application-deployment/((?!page).)*$"),
  "get",
  function (params) {
    console.log(params);
    return {
      status: 200,
      timestamp: 1606456146879,
      message: "success",
      data: {
        id: "1331480607671545858",
        name: "auto-build-examples",
        autoBuildId: "1287947370978689025",
        imagesDepositoryId: "14",
        imageName: "192.168.13.61/default-liuyang03813/auto-build-examples",
        imageTag: "1605766435851",
        imagePullStrategy: "Always",
        instancesNumber: 1,
        strategyType: "RollingUpdate",
        maxSurge: 1,
        maxUnavaible: 1,
        network: "none",
        node: "sb-k8s-master",
        creator: "default",
        createTime: "2020-11-25 14:11:29",
        labels: {
          "caas-app": "auto-build-examples",
          "k8s-app": "auto-build-examples",
        },
        availableReplicas: 1,
        readyReplicas: 1,
        replicas: 1,
        updatedReplicas: 1,
        networks: [{}],
      },
    };
  }
);

ApplicationDeployment.mock(
  RegExp(baseUrl + "/core/application-deployment/.*"),
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

ApplicationDeployment.mock(
  RegExp(baseUrl + "/core/application-deployment/.*"),
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

ApplicationDeployment.mock(
  RegExp(baseUrl + "/core/application-deployment/.*"),
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
