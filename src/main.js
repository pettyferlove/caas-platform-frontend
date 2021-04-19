import "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
import "@styles/index.sass";
import "./registerServiceWorker";
import router from "./router";
import store from "./vuex/store";
import vuetify from "./plugins/vuetify";
import VueExtends from "./libs/extends";
import "./plugins/chartist";
import Notify from "@/components/notification";
import velocity from "velocity-animate";
import i18n from "./i18n";
import "./log";

import("es6-shim");

Vue.use(Notify, { velocity });
Vue.use(VueExtends);

Vue.config.productionTip = false;

if (process.env.NODE_ENV === "development") {
  if (!process.env.NO_MOCK) {
    require("./api/mock");
  }
}

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
