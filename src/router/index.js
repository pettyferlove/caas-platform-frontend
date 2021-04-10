import Vue from "vue";
import VueRouter from "vue-router";
import LoadingBar from "@/components/loading/LoadingBar";
import { routers } from "./routers";
import store from "../vuex/store";
Vue.use(VueRouter);
Vue.use(LoadingBar);
Vue.prototype.$LoadingBar = LoadingBar;

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routers,
  linkActiveClass: "active",
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

// eslint-disable-next-line no-unused-vars
router.beforeEach((to, from, next) => {
  LoadingBar.config({
    color: "#4CAF50",
    failedColor: "#ed3f14",
    height: 2,
  });
  if (to.path !== "/other/login") {
    LoadingBar.start();
  }
  if (store.getters.isLogin) {
    if (to.path === "/other/login") {
      next();
    } else {
      if (
        store.getters.getUser === undefined ||
        Object.keys(store.getters.getUser).length === 0
      ) {
        store
          .dispatch("UserInfo")
          .then(() => {
            next({ ...to, replace: true });
          })
          .catch(() => {
            LoadingBar.error();
            store.dispatch("Logout").finally(() => {
              next("/other/login");
            });
          });
      } else {
        if (to.matched.length === 0) {
          next({
            path: "*",
          });
        } else {
          next();
        }
      }
    }
  } else {
    if (to.meta.skipAuth) {
      next();
    } else {
      next("/other/login");
    }
  }
});

// eslint-disable-next-line no-unused-vars
router.afterEach((to, from, next) => {
  LoadingBar.finish();
});

export default router;
