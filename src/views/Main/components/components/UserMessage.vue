<template>
  <v-menu bottom left offset-y origin="top right" transition="scale-transition">
    <template v-slot:activator="{ attrs, on }">
      <v-btn class="ml-2" min-width="0" text v-bind="attrs" v-on="on">
        <v-badge v-if="messageCount > 0" color="red" overlap bordered>
          <template v-slot:badge>
            <span>{{ messageCount }}</span>
          </template>

          <v-icon>mdi-bell</v-icon>
        </v-badge>
        <v-icon v-else>mdi-bell</v-icon>
      </v-btn>
    </template>

    <v-list v-if="messageCount > 0" :tile="false" nav>
      <v-hover
        v-for="(item, index) in messageList"
        v-bind:key="`message-` + index"
        v-slot:default="{ hover }"
      >
        <v-list-item
          link
          :dark="hover"
          :class="hover ? 'white--text secondary elevation-12' : 'black--text'"
          @click="handleRead(item.id)"
        >
          <v-list-item-avatar>
            <v-icon class="green lighten-1" dark> mdi-bell </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ item.message }}</v-list-item-title>
            <v-list-item-subtitle
              ><span class="text--primary">{{ item.content }}</span> &mdash;
              {{ item.time }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-hover>
    </v-list>
  </v-menu>
</template>

<script>
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "UserMessage",
  data: () => {
    return {
      connectStatus: false,
      stompClient: undefined,
    };
  },
  methods: {
    init() {
      if (this.isLogin) {
        this.initUnreadMessageList();
        this.initWebSocket();
      } else {
        this.disconnect();
        clearInterval(this.timer);
      }
    },
    initWebSocket() {
      this.connection();
      let that = this;
      // 断开重连机制,尝试发送消息,捕获异常发生时重连
      this.timer = setInterval(() => {
        try {
          that.stompClient.send("health check");
        } catch (err) {
          console.log(">>>" + err);
          that.connection();
        }
      }, 5000);
    },
    connection() {
      let that = this;
      // 建立连接对象
      that.socket = new SockJS(
        process.env.VUE_APP_API_ROOT +
          "/message/ws?access_token=" +
          this.accessToken
      );
      // 获取STOMP子协议的客户端对象
      that.stompClient = Stomp.over(that.socket);
      that.stompClient.debug = null;
      // 向服务器发起websocket连接
      that.stompClient.connect(
        {},
        () => {
          this.subApp();
          this.subUser();
        },
        (error) => {
          console.log(error);
        }
      );
    },
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect();
      }
    },
    ...mapActions({
      initUnreadMessageList: "InitUnreadMessageList",
      readMessage: "ReadMessage",
      addMessage: "AddMessage",
    }),
    setMessage(msg) {
      this.addMessage(msg).then(() => {
        this.$notify({
          group: "system",
          type: msg.type,
          title: msg.message,
          text: msg.content,
        });
        if (window.Notification && Notification.permission === "granted") {
          new Notification(msg.message + "：" + msg.content);
        } else if (
          window.Notification &&
          Notification.permission !== "denied"
        ) {
          Notification.requestPermission(function (status) {
            if (Notification.permission !== status) {
              Notification.permission = status;
            }
            if (status === "granted") {
              new Notification(msg.message + "：" + msg.content);
            }
          });
        }
      });
    },
    /*
    订阅
     */
    subApp() {
      let that = this;
      that.stompClient.subscribe("/app/subscribe", (response) => {
        that.connectStatus = true;
        let returnData = JSON.parse(response.body);
        if (returnData.status === 200000) {
          that.setMessage(returnData.content);
        } else if (returnData.status === 200001) {
          console.log(returnData);
        }
      });
    },
    /*
        订阅点对点
         */
    subUser() {
      let that = this;
      that.stompClient.subscribe("/user/topic/subscribe", (response) => {
        that.connectStatus = true;
        let returnData = JSON.parse(response.body);
        if (returnData.status === 200000) {
          that.setMessage(returnData.content);
        } else if (returnData.status === 200001) {
          console.log(returnData);
        }
      });
    },
    handleRead(id) {
      this.readMessage(id);
    },
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      accessToken: "getAccessToken",
      messageCount: "messageUnreadCount",
      messageList: "messageUnreadList",
    }),
  },
  watch: {
    isLogin() {
      this.init();
    },
  },
  beforeDestroy() {
    this.disconnect();
    clearInterval(this.timer);
  },
};
</script>

<style scoped></style>
