import Main from "@/views/Main/Index";
import configuration from "@/router/routers/configuration";
import projectBuild from "@/router/routers/project-build";
import sqlBuild from "@/router/routers/sql-build";
import resources from "@/router/routers/resources";
import application from "@/router/routers/application";
import configMap from "@/router/routers/config-map";
import serviceDiscovery from "@/router/routers/service-discovery";
import persistentStorage from "@/router/routers/persistent-storage";
import appCenter from "@/router/routers/app-center";

import user from "@/router/routers/user";

export const accountRouter = {};

export const mainRouter = {
  path: "/",
  name: "Main",
  redirect: "dashboard",
  component: Main,
  children: [
    {
      path: "dashboard",
      name: "Dashboard",
      meta: {
        title: "Dashboard",
      },
      component: (resolve) => require(["@/pages/Dashboard"], resolve),
    },
    {
      path: "service-governance",
      name: "ServiceGovernance",
      meta: {
        title: "服务治理",
      },
      component: (resolve) => require(["@/pages/ServiceGovernance"], resolve),
    },
  ]
    .concat(configuration)
    .concat(projectBuild)
    .concat(sqlBuild)
    .concat(application)
    .concat(configMap)
    .concat(serviceDiscovery)
    .concat(resources)
    .concat(persistentStorage)
    .concat(appCenter)
    .concat(user),
};

export const otherRouter = {
  path: "/other",
  component: () => import("@/views/Other/Index"),
  children: [
    {
      name: "Login",
      path: "login",
      title: "登录",
      meta: {
        title: "用户登录",
        skipAuth: true,
      },
      component: () => import("@/views/Other/Login"),
    },
    {
      name: "register",
      path: "register",
      title: "注册",
      meta: {
        title: "用户注册",
        skipAuth: true,
      },
      component: () => import("@/views/Other/Register"),
    },
  ],
};

export const errorRouters = {
  path: "*",
  component: () => import("@/views/Other/Index"),
  children: [
    {
      name: "404 Error",
      path: "",
      meta: {
        skipAuth: true,
      },
      component: () => import("@/views/Other/Error"),
    },
  ],
};

export const routers = [mainRouter, otherRouter, errorRouters];
