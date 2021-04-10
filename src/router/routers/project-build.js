const projectBuild = [
  {
    path: "project-build",
    name: "ProjectBuild",
    redirect: "project-build/list",
    meta: {
      title: "项目构建",
    },
    component: (resolve) => require(["@/pages/ProjectBuild/Index"], resolve),
    children: [
      {
        path: "list",
        name: "ProjectBuildList",
        meta: {
          title: "项目构建",
        },
        component: (resolve) =>
          require(["@/pages/ProjectBuild/ProjectBuildList"], resolve),
      },
      {
        path: "edit/:id",
        name: "ProjectBuildDetailsEdit",
        meta: {
          title: "项目构建",
        },
        component: (resolve) =>
          require(["@/pages/ProjectBuild/ProjectBuildDetailsEdit"], resolve),
      },
      {
        path: "add",
        name: "ProjectBuildDetailsAdd",
        meta: {
          title: "项目构建",
        },
        component: (resolve) =>
          require(["@/pages/ProjectBuild/ProjectBuildDetailsAdd"], resolve),
      },
      {
        path: "history/:id",
        name: "ProjectBuildHistoryList",
        meta: {
          title: "构建历史",
        },
        component: (resolve) =>
          require(["@/pages/ProjectBuild/ProjectBuildHistoryList"], resolve),
      },
      {
        path: "logs/:buildId/:jobId",
        name: "ProjectBuildLogsView",
        meta: {
          title: "构建日志",
        },
        component: (resolve) =>
          require(["@/pages/ProjectBuild/ProjectBuildLogsView"], resolve),
      },
    ],
  },
];
export default projectBuild;
