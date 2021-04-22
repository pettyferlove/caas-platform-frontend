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
    icon: "mdi-server-network",
    text: "服务发现",
    path: "/service-discovery",
    role: "USER",
  },
  {
    icon: "mdi-file-cog",
    text: "配置管理",
    path: "/config",
    role: "USER",
  },
  {
    icon: "mdi-database",
    text: "持久化存储",
    path: "/persistent-storage",
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
    text: "全局资源",
    group: "resources",
    active: false,
    role: "ADMIN",
    children: [
      {
        icon: "mdi-hexagon-slice-4",
        text: "命名空间",
        path: "/resources/namespace",
        role: "ADMIN",
      },
      {
        icon: "mdi-database",
        text: "持久卷",
        path: "/resources/persistent-volume",
        role: "ADMIN",
      },
      {
        icon: "mdi-nas",
        text: "存储类",
        path: "/resources/storage-class",
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
