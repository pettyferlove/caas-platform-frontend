let menuData = [
  {
    icon: "mdi-monitor-dashboard",
    text: "Dashboard",
    path: "/dashboard",
    role: "USER",
  },
  {
    icon: "mdi-apache-kafka",
    text: "项目构建",
    path: "/project-build",
    role: "USER",
  },
  {
    icon: "mdi-database-clock",
    text: "SQL构建",
    path: "/sql-build",
    role: "USER",
  },
  {
    icon: "mdi-apps",
    text: "应用管理",
    path: "/application",
    role: "USER",
  },
  {
    icon: "mdi-file-cog",
    text: "配置管理",
    path: "/config",
    role: "USER",
  },
  {
    icon: "mdi-semantic-web",
    text: "服务治理",
    path: "/service-governance",
    role: "ADMIN",
  },
  {
    icon: "mdi-diameter",
    text: "系统资源",
    group: "resources",
    active: false,
    role: "USER",
    children: [
      {
        icon: "mdi-hexagon-slice-4",
        text: "命名空间",
        path: "/resources/namespace",
        role: "USER",
      },
      {
        icon: "mdi-database",
        text: "持久卷",
        path: "/resources/persistent-volume",
        role: "ADMIN",
      },
    ],
  },
  {
    icon: "mdi-cogs",
    text: "系统配置",
    path: "/globe-configuration",
    role: "ADMIN",
  },
  {
    icon: "mdi-account-group",
    text: "用户管理",
    path: "/user/list",
    role: "ADMIN",
  },
];

export default menuData;
