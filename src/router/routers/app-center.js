const appCenter = [
  {
    path: "app-center",
    name: "AppCenter",
    redirect: "app-center/list",
    meta: {
      title: "应用中心",
    },
    component: (resolve) => require(["@/pages/AppCenter/Index"], resolve),
    children: [
      {
        path: "list",
        name: "AppCenterList",
        meta: {
          title: "应用中心",
        },
        component: (resolve) =>
          require(["@/pages/AppCenter/AppCenterList"], resolve),
      },
      {
        path: "detail/:repo/:chartName",
        name: "AppCenterDetail",
        meta: {
          title: "应用中心",
        },
        component: (resolve) =>
          require(["@/pages/AppCenter/AppCenterDetail"], resolve),
      },
      {
        path: "release-detail/:namespace/:releaseName",
        name: "ReleaseDetail",
        meta: {
          title: "应用中心",
        },
        component: (resolve) =>
          require(["@/pages/AppCenter/ReleaseDetail"], resolve),
      },
      {
        path: "deploy/:repo/:chartName/:version",
        name: "AppCenterDeploy",
        meta: {
          title: "应用中心",
        },
        component: (resolve) =>
          require(["@/pages/AppCenter/AppCenterDeploy"], resolve),
      },
      {
        path:
          "release-upgrade/:namespace/:name/:chartName/:version/:appVersion",
        name: "ReleaseUpgrade",
        meta: {
          title: "应用中心",
        },
        component: (resolve) =>
          require(["@/pages/AppCenter/ReleaseUpgrade"], resolve),
      },
    ],
  },
];
export default appCenter;
