const Node = require("mockjs");
let baseUrl = process.env.VUE_APP_API_ROOT;
// 获取 mock.Random 对象
// eslint-disable-next-line no-unused-vars
const Random = Node.Random;

Node.mock(RegExp(baseUrl + "kubernetes/node/list"), "get", function (params) {
  console.log(params);
  return {
    status: 200,
    timestamp: 1606456146865,
    message: "success",
    data: [
      { ip: "192.168.13.57", hostName: "sb-k8s-master" },
      { ip: "192.168.13.61", hostName: "sb-k8s-node1" },
      { ip: "192.168.13.87", hostName: "sb-k8s-node2" },
    ],
  };
});
