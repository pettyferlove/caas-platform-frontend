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
          title: "用户",
        },
        component: (resolve) =>
          require(["@/pages/User/UserProfile/Index"], resolve),
      },
    ],
  },
];
export default user;
