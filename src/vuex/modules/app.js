import { setLocalStorage, getLocalStorage } from "@/libs/localStorage";
import api from "@/api";
// state
const state = {
  barColor: "rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)",
  drawer: null,
  namespaces: [],
  currentNamespace: getLocalStorage({ name: "current_namespace" }) || {},
};

// getters
const getters = {
  GetBarColor: (state) => state.barColor,
  GetDrawer: (state) => state.drawer,
  GetNamespaces: (state) => state.namespaces,
  GetCurrentNamespace: (state) => state.currentNamespace,
};

// actions
const actions = {
  LoadNamespaces({ commit }) {
    return new Promise((resolve, reject) => {
      api.namespace
        .queryAll()
        .then(
          (r) => {
            commit("SetNamespaces", r.data);
            resolve();
          },
          (e) => {
            reject(e);
          }
        )
        .catch((e) => {
          reject(e);
        });
    });
  },
};

// mutations
const mutations = {
  SetDrawer(state, payload) {
    state.drawer = payload;
  },
  SetNamespaces(state, data) {
    let currentNamespace = data.find((i) => {
      return i.id === state.currentNamespace.id;
    });
    if (!currentNamespace) {
      if (data.length > 0) {
        state.currentNamespace = data[0];
      } else {
        state.currentNamespace = {};
      }
    }
    state.namespaces = data;
  },
  SetCurrentNamespace(state, namespace) {
    setLocalStorage({
      name: "current_namespace",
      content: namespace,
    });
    state.currentNamespace = namespace;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
