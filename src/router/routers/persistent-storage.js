const persistentStorage = [
  {
    path: "persistent-storage",
    name: "PersistentStorage",
    redirect: "persistent-storage/list",
    meta: {
      title: "持久化存储",
    },
    component: (resolve) =>
      require(["@/pages/PersistentStorage/Index"], resolve),
    children: [
      {
        path: "list",
        name: "PersistentStorageList",
        meta: {
          title: "持久化存储",
        },
        component: (resolve) =>
          require(["@/pages/PersistentStorage/PersistentStorageList"], resolve),
      },
      {
        path: "edit/:id",
        name: "PersistentStorageEdit",
        meta: {
          title: "持久化存储",
        },
        component: (resolve) =>
          require(["@/pages/PersistentStorage/PersistentStorageEdit"], resolve),
      },
      {
        path: "add",
        name: "PersistentStorageAdd",
        meta: {
          title: "持久化存储",
        },
        component: (resolve) =>
          require(["@/pages/PersistentStorage/PersistentStorageAdd"], resolve),
      },
    ],
  },
];
export default persistentStorage;
