const Namespace = require("mockjs");
let baseUrl = process.env.VUE_APP_API_ROOT;
// 获取 mock.Random 对象
// eslint-disable-next-line no-unused-vars
const Random = Namespace.Random;

Namespace.mock(
  RegExp(baseUrl + "/kubernetes/namespace/page"),
  "get",
  function (params) {
    console.log(params);
    return {
      status: 200,
      timestamp: 1593823379580,
      message: "success",
      data: {
        records: [
          {
            name: "default",
            status: "Active",
            istioInjection: true,
            creationTimestamp: "2020-06-09T07:00:56Z",
          },
          {
            name: "istio-caas",
            status: "Active",
            istioInjection: false,
            creationTimestamp: "2020-06-16T07:05:56Z",
          },
          {
            name: "kube-node-lease",
            status: "Active",
            istioInjection: false,
            creationTimestamp: "2020-06-09T07:00:54Z",
          },
          {
            name: "kube-public",
            status: "Active",
            istioInjection: false,
            creationTimestamp: "2020-06-09T07:00:54Z",
          },
          {
            name: "kube-caas",
            status: "Active",
            istioInjection: false,
            creationTimestamp: "2020-06-09T07:00:54Z",
          },
        ],
        total: 6,
        size: 5,
        current: 1,
      },
    };
  }
);

Namespace.mock(
  RegExp(baseUrl + "/kubernetes/namespace/((?!page|all/list).)*$"),
  "get",
  function (params) {
    console.log(params);
    return {
      status: 200,
      timestamp: 1593823544722,
      message: "success",
      data: {
        apiVersion: "v1",
        metadata: {
          creationTimestamp: "2020-06-09T07:00:56Z",
          labels: { "istio-injection": "enable" },
          name: "default",
          resourceVersion: "938685",
          selfLink: "/api/v1/namespaces/default",
          uid: "0eabf9d2-214d-48d6-8a11-f3dc129ac38c",
        },
        spec: { finalizers: ["kubernetes"] },
        status: { phase: "Active" },
      },
    };
  }
);

Namespace.mock(
  RegExp(baseUrl + "/kubernetes/namespace/all/list"),
  "get",
  function (params) {
    console.log(params);
    return {
      status: 200,
      timestamp: 1606554090223,
      message: "success",
      data: [
        { name: "default" },
        { name: "istio-system" },
        { name: "jndjrd-qyd" },
        { name: "jndjrd-qyd-prod" },
        { name: "kube-node-lease" },
        { name: "kube-public" },
        { name: "kube-system" },
        { name: "kubernetes-dashboard" },
        { name: "leaf6" },
      ],
    };
  }
);

Namespace.mock(
  RegExp(baseUrl + "/kubernetes/namespace/.*"),
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
