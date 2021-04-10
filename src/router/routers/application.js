const application = [
  {
    path: "application",
    name: "Application",
    meta: {
      title: "应用管理",
    },
    redirect: "application/list",
    component: (resolve) => require(["@/pages/Application/Index"], resolve),
    children: [
      {
        path: "list",
        name: "ApplicationList",
        meta: {
          title: "应用管理",
        },
        component: (resolve) =>
          require(["@/pages/Application/ApplicationList"], resolve),
      },
      {
        path: "add",
        name: "ApplicationDetailsAdd",
        meta: {
          title: "应用管理",
        },
        component: (resolve) =>
          require(["@/pages/Application/ApplicationDetailsAdd"], resolve),
      },
      {
        path: "edit/:id",
        name: "ApplicationDetailsEdit",
        meta: {
          title: "应用管理",
        },
        component: (resolve) =>
          require(["@/pages/Application/ApplicationDetailsEdit"], resolve),
      },
      {
        path: "view/:namespaceId/:id",
        name: "ApplicationDetailsView",
        meta: {
          title: "应用管理",
        },
        component: (resolve) =>
          require(["@/pages/Application/ApplicationDetailsView"], resolve),
      },
      {
        path: "logs/:namespace/:name",
        name: "ApplicationPodLogsView",
        meta: {
          title: "日志",
        },
        component: (resolve) =>
          require(["@/pages/Application/ApplicationPodLogsView"], resolve),
      },
      {
        path: "shell/:namespaceId/:name",
        name: "ApplicationPodShellView",
        meta: {
          title: "Shell",
        },
        component: (resolve) =>
          require(["@/pages/Application/ApplicationPodShellView"], resolve),
      },
    ],
  },
];
export default application;
