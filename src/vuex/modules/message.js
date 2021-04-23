import api from "@/api";
// state
const state = {
  unreadCount: 0, //未读信息数量
  readCount: 0, //已读信息数量
  messageUnreadList: [], //未读消息
  messageReadList: [], //已读消息
};

// getters
const getters = {
  messageUnreadList: (state) => state.messageUnreadList,
  messageReadList: (state) => state.messageReadList,
  messageUnreadCount: (state) => state.messageUnreadList.length,
  messageReadCount: (state) => state.messageReadList.length,
};

// actions
const actions = {
  // 初始化未读消息列表
  InitUnreadMessageList({ commit }) {
    return new Promise((resolve, reject) => {
      api.message
        .loadUnreadMessage()
        .then((response) => {
          if (response.status === 200) {
            commit("ClearMessageList");
            commit("AddMessageList", response.data);
            resolve();
          } else {
            reject(response);
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  ReadMessage({ state }, id) {
    return new Promise((resolve, reject) => {
      api.message.readMessage(id).then((response) => {
        if (response.status === 200) {
          let index = state.messageUnreadList.findIndex(
            (element) => element.id === id
          );
          if (index > -1) {
            state.messageUnreadList.splice(index, 1);
            state.messageReadList.unshift(state.messageUnreadList[index]);
          }
          resolve();
        } else {
          reject(response);
        }
      });
    });
  },
  AddMessage({ commit }, message) {
    return new Promise((resolve) => {
      commit("AddMessageItem", message);
      resolve();
    });
  },
};

// mutations
const mutations = {
  ClearMessageList(state) {
    state.unreadCount = 0;
    state.readedCount = 0;
    state.messageUnreadList = [];
    state.messageReadList = [];
  },
  AddMessageItem(state, message) {
    if (message.state === 1) {
      state.messageReadList.unshift(message);
      state.readedCount++;
    } else {
      state.messageUnreadList.unshift(message);
      state.unreadCount++;
    }
  },
  AddMessageList(state, list) {
    list.forEach((item) => {
      if (item.state === 1) {
        state.messageReadList.push(item);
        state.readedCount++;
      } else {
        state.messageUnreadList.push(item);
        state.unreadCount++;
      }
    });
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
