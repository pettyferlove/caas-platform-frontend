<template>
  <div>
    <v-btn icon color="cyan" @click="click">
      <v-icon small>mdi-wrench-outline</v-icon>
    </v-btn>
    <v-btn icon color="cyan" @click="close">
      <v-icon small>mdi-wrench-outline</v-icon>
    </v-btn>

    <v-btn icon color="pink">
      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <v-alert
      style="padding: 10px 15px"
      color="#2A3B4D"
      border="left"
      type="success"
      elevation="4"
    >
      测试
      <template>
        <v-btn icon color="white">
          <v-icon>mdi-close-thick</v-icon>
        </v-btn>
      </template>
    </v-alert>
  </div>
</template>

<script>
export default {
  name: "ServiceGovernance",
  data() {
    return {
      visible: true,
    };
  },
  mounted() {
    if (window.Notification && Notification.permission !== "granted") {
      Notification.requestPermission(function (status) {
        if (Notification.permission !== status) {
          Notification.permission = status;
        }
      });
    }
  },
  methods: {
    click() {
      this.$notify({
        group: "default",
        duration: 50000,
        type: "error",
        speed: 100,
        title: "Important message Hello user! This is a notification!",
        text: "Hello user! This is a notification!",
      });
      if (window.Notification && Notification.permission === "granted") {
        new Notification("Hi！");
      }

      // 如果用户没有选择是否显示通知
      // 注：因为在 Chrome 中我们无法确定 permission 属性是否有值，因此
      // 检查该属性的值是否是 "default" 是不安全的。
      else if (window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function (status) {
          if (Notification.permission !== status) {
            Notification.permission = status;
          }

          // 如果用户同意了
          if (status === "granted") {
            new Notification("Hi!");
          }
        });
      }
    },
    close() {
      this.$notify.closeAll();
    },
  },
};
</script>

<style scoped></style>
