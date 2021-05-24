<template>
  <v-row>
    <v-col>
      <v-card
        v-bind="$attrs"
        class="v-card--material v-card--material--has-heading"
      >
        <div class="d-flex grow flex-wrap shell-header">
          <v-sheet
            color="info"
            :max-height="90"
            width="auto"
            elevation="6"
            class="text-start v-card--material__heading mb-n6 pa-7"
            dark
          >
            <v-icon ize="32">mdi-powershell</v-icon>
          </v-sheet>

          <div class="ml-4">
            <div class="card-title font-weight-light">Shell</div>
          </div>
        </div>
        <div class="shell-content">
          <div id="xterm"></div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" class="mr-4" @click="back"> 返回 </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { debounce } from "lodash";
export default {
  name: "ApplicationPodShellView",
  data() {
    return {
      name: "",
      namespaceId: "",
      initLoading: false,
      connectStatus: false,
      timer: undefined,
      message: "",
      socket: undefined,
      term: undefined,
    };
  },
  mounted() {
    this.namespaceId = this.$route.params.namespaceId || "";
    this.name = this.$route.params.name || "";
    this.init();
  },
  methods: {
    init: function () {
      if (typeof WebSocket === "undefined") {
        alert("your browser does not support socket");
      } else {
        // 实例化socket
        this.socket = new WebSocket(
          "ws://127.0.0.1:8885/api/v1/sockjs/terminal/" +
            this.namespaceId +
            "/" +
            this.name
        );
        // 监听socket连接
        this.socket.onopen = this.open;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        this.socket.onclose = this.close;
        // 监听socket消息
        this.socket.onmessage = this.onMessage;
        this.connectStatus = true;
        this.initTerm();
      }
    },
    initTerm: function () {
      if (this.term) {
        this.term.dispose();
      }
      // 获取容器宽高/字号大小，定义行数和列数
      const term = new Terminal({
        rendererType: "canvas",
        fontSize: 14,
        fontFamily: "Consolas, 'Courier New', monospace",
        bellStyle: "sound",
        cursorBlink: true,
      });
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(document.getElementById("xterm"));
      this.term = term;
      this.term.onData(this.sendTerminalData);
      this.term.onResize(this.onTerminalResize);

      this.debouncedFit = debounce(() => {
        fitAddon.fit();
      }, 100);
      this.debouncedFit();
      window.onresize = () => this.debouncedFit();
    },
    open() {
      this.socket.send(
        JSON.stringify({
          type: "init",
          cols: this.term.cols,
          rows: this.term.rows,
        })
      );
      this.term.focus();
    },
    error() {
      this.term.write("session close!");
    },
    onMessage(message) {
      this.term.write(message.data);
    },
    sendTerminalData(data) {
      this.socket.send(
        JSON.stringify({
          type: "stdin",
          data: data,
          cols: this.term.cols,
          rows: this.term.rows,
        })
      );
    },
    onTerminalResize() {
      this.socket.send(
        JSON.stringify({
          type: "resize",
          cols: this.term.cols,
          rows: this.term.rows,
        })
      );
    },
    close() {
      this.socket.close();
      this.term.dispose();
    },
    back() {
      this.$router.back();
    },
  },
  destroyed() {
    this.close();
  },
};
</script>

<style scoped lang="scss">
.shell-header {
  padding-top: 12px !important;
  padding-right: 20px !important;
  padding-left: 20px !important;
}

.shell-content {
  background-color: #000;
  #xterm {
    box-sizing: border-box;
    display: block;
    height: 70vh;
    width: 100%;
    margin-top: 16px;
    ::-webkit-scrollbar {
      background: transparent;
      height: 8px;
      width: 8px;
    }
  }
}
</style>
