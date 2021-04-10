const configuration = [
  {
    path: "globe-configuration",
    name: "GlobalConfiguration",
    meta: {
      title: "全局配置",
    },
    component: (resolve) =>
      require(["@/pages/Config/GlobalConfiguration/Index"], resolve),
  },
  {
    path: "user-configuration",
    name: "UserConfiguration",
    meta: {
      title: "个人配置",
    },
    component: (resolve) =>
      require(["@/pages/Config/UserConfiguration/Index"], resolve),
  },
];
export default configuration;
