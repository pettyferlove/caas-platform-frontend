import Vue from "vue";
import Vuex from "vuex";

import app from "./modules/app";
import log from "./modules/log";
import user from "./modules/user";
import message from "./modules/message";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    log,
    user,
    message,
  },
});

export default store;
