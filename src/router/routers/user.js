const user = [
  {
    path: "user",
    name: "User",
    meta: {
      title: "用户",
    },
    redirect: "user/profile",
    component: (resolve) => require(["@/pages/User/Index"], resolve),
    children: [
      {
        path: "profile",
        name: "UserProfile",
        meta: {
          title: "用户设置",
        },
        component: (resolve) =>
          require(["@/pages/User/UserProfile/Index"], resolve),
      },
      {
        path: "list",
        name: "UserList",
        meta: {
          title: "用户列表",
        },
        component: (resolve) => require(["@/pages/User/UserList"], resolve),
      },
      {
        path: "add",
        name: "UserAdd",
        meta: {
          title: "新增用户",
        },
        component: (resolve) =>
          require(["@/pages/User/UserDetailsAdd"], resolve),
      },
      {
        path: "edit/:id",
        name: "UserEdit",
        meta: {
          title: "修改用户",
        },
        component: (resolve) =>
          require(["@/pages/User/UserDetailsEdit"], resolve),
      },
    ],
  },
];
export default user;
