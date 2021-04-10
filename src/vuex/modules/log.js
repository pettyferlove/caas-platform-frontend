const state = {
  debug: true,
  logs: [],
};

const getters = {
  debug: (state) => {
    return state.debug;
  },
};

const mutations = {
  AddErrorLog: (state, log) => {
    state.logs.push(log);
  },
  ChangeDebugMode: (state) => {
    state.debug = !state.debug;
  },
};

const actions = {
  addErrorLog({ commit }, log) {
    commit("AddErrorLog", log);
  },
  changeDebugMode({ commit }) {
    commit("ChangeDebugMode");
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
