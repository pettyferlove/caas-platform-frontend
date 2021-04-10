const Pod = require("mockjs");
let baseUrl = process.env.VUE_APP_API_ROOT;
// 获取 mock.Random 对象
// eslint-disable-next-line no-unused-vars
const Random = Pod.Random;

Pod.mock(RegExp(baseUrl + "/kubernetes/pod/page"), "get", function (params) {
  console.log(params);
  return {
    status: 200,
    timestamp: 1606456385921,
    message: "success",
    data: {
      records: [
        {
          name: "auto-build-examples-588c867677-qhldd",
          nodeName: "sb-k8s-node2",
          statusPhase: "Running",
          ip: "10.244.2.207",
          restartCount: 0,
          startTime: "2020-11-25T08:41:06Z",
        },
      ],
      total: 1,
      size: 5,
      current: 1,
      orders: [],
      searchCount: true,
      pages: 1,
    },
  };
});

Pod.mock(RegExp(baseUrl + "/kubernetes/pod/.*"), "delete", function (params) {
  console.log(params);
  return {
    status: 200,
    timestamp: 1606455171941,
    message: "success",
    data: true,
  };
});
