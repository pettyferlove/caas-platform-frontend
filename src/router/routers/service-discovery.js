const serviceDiscovery = [
  {
    path: "service-discovery",
    name: "ServiceDiscovery",
    redirect: "service-discovery/list",
    meta: {
      title: "服务发现",
    },
    component: (resolve) =>
      require(["@/pages/ServiceDiscovery/Index"], resolve),
    children: [
      {
        path: "list",
        name: "ServiceDiscoveryList",
        meta: {
          title: "服务发现",
        },
        component: (resolve) =>
          require(["@/pages/ServiceDiscovery/ServiceDiscoveryList"], resolve),
      },
    ],
  },
];
export default serviceDiscovery;
