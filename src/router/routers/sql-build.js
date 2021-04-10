const sqlBuild = [
  {
    path: "sql-build",
    name: "SqlBuild",
    redirect: "sql-build/list",
    meta: {
      title: "数据脚本构建",
    },
    component: (resolve) => require(["@/pages/SqlBuild/Index"], resolve),
    children: [
      {
        path: "list",
        name: "SqlBuildList",
        meta: {
          title: "数据脚本构建",
        },
        component: (resolve) =>
          require(["@/pages/SqlBuild/SqlBuildList"], resolve),
      },
      {
        path: "add",
        name: "SqlBuildDetailsAdd",
        meta: {
          title: "数据脚本构建",
        },
        component: (resolve) =>
          require(["@/pages/SqlBuild/SqlBuildDetailsAdd"], resolve),
      },
      {
        path: "edit/:id",
        name: "SqlBuildDetailsEdit",
        meta: {
          title: "数据脚本构建",
        },
        component: (resolve) =>
          require(["@/pages/SqlBuild/SqlBuildDetailsEdit"], resolve),
      },
      {
        path: "history/:id",
        name: "SqlBuildHistoryList",
        meta: {
          title: "构建历史",
        },
        component: (resolve) =>
          require(["@/pages/SqlBuild/SqlBuildHistoryList"], resolve),
      },
      {
        path: "logs/:buildId/:jobId",
        name: "SqlBuildLogsView",
        meta: {
          title: "构建日志",
        },
        component: (resolve) =>
          require(["@/pages/SqlBuild/SqlBuildLogsView"], resolve),
      },
    ],
  },
];
export default sqlBuild;
