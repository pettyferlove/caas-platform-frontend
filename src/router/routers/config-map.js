const configMap = [
  {
    path: "config",
    name: "config",
    redirect: "config/list",
    meta: {
      title: "配置管理",
    },
    component: (resolve) =>
      require(["@/pages/Config/ConfigMap/Index"], resolve),
    children: [
      {
        path: "list",
        name: "ConfigList",
        meta: {
          title: "配置管理",
        },
        component: (resolve) =>
          require(["@/pages/Config/ConfigMap/ConfigMapList"], resolve),
      },
      {
        path: "add",
        name: "ConfigDetailsAdd",
        meta: {
          title: "配置管理",
        },
        component: (resolve) =>
          require(["@/pages/Config/ConfigMap/ConfigMapDetailsAdd"], resolve),
      },
      {
        path: "edit/:id",
        name: "ConfigDetailsEdit",
        meta: {
          title: "配置管理",
        },
        component: (resolve) =>
          require(["@/pages/Config/ConfigMap/ConfigMapDetailsEdit"], resolve),
      },
    ],
  },
];
export default configMap;
