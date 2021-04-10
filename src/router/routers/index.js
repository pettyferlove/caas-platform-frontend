import Main from "@/views/Main/Index";
import configuration from "@/router/routers/configuration";
import projectBuild from "@/router/routers/project-build";
import sqlBuild from "@/router/routers/sql-build";
import resources from "@/router/routers/resources";
import application from "@/router/routers/application";
import configMap from "@/router/routers/config-map";

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
    .concat(resources)
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

/**
 * 错误路由，需要最后加载
 * @type {{path: string, component: (function(*=): any), meta: {title: string, skipAuth: boolean}, name: string}}
 */
export const errorRouters = {};

export const routers = [mainRouter, otherRouter];
