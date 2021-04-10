import Vue from "vue";
import store from "./vuex/store";

const errorHandler = function (err, vm, info) {
  Vue.nextTick(() => {
    if (store.getters.debug) {
      store.dispatch("addErrorLog", {
        err,
        vm,
        info,
        url: window.location.href,
      });
      console.error(err, info);
    }
  });
};
Vue.config.errorHandler = errorHandler;
Vue.prototype.$throw = (error) => errorHandler(error, this);
