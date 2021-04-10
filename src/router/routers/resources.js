const resources = [
  {
    path: "resources/namespace",
    name: "Namespace",
    meta: {
      title: "命名空间",
    },
    redirect: "resources/namespace/list",
    component: (resolve) =>
      require(["@/pages/Resources/Namespace/Index"], resolve),
    children: [
      {
        path: "list",
        name: "NamespaceList",
        meta: {
          title: "命名空间",
        },
        component: (resolve) =>
          require(["@/pages/Resources/Namespace/NamespaceList"], resolve),
      },
      {
        path: "view/:id",
        name: "NamespaceDetailsView",
        meta: {
          title: "命名空间",
        },
        component: (resolve) =>
          require([
            "@/pages/Resources/Namespace/NamespaceDetailsView",
          ], resolve),
      },
    ],
  },
  {
    path: "resources/persistent-volume",
    name: "PersistentVolume",
    meta: {
      title: "持久卷",
    },
    component: (resolve) =>
      require(["@/pages/Resources/PersistentVolume"], resolve),
  },
];
export default resources;
