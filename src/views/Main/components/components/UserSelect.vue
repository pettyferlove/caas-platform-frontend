<template>
  <v-menu
    bottom
    left
    min-width="200"
    transition="scale-transition"
    offset-y
    origin="top right"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" class="ml-2" min-width="0" text>
        <v-icon dark>mdi-account</v-icon></v-btn
      >
    </template>
    <v-list dense>
      <v-list-item @click="clickUserCenter()">
        <v-list-item-icon style="margin-right: 0">
          <v-icon>mdi-account</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>个人资料</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click="clickUserConfiguration()">
        <v-list-item-icon style="margin-right: 0">
          <v-icon>mdi-cogs</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>个人配置</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="mb-2 mt-2" />
      <v-list-item @click="logout()">
        <v-list-item-icon style="margin-right: 0">
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>安全退出</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "UserSelect",
  methods: {
    clickUserCenter() {
      this.$router
        .push({
          name: "UserProfile",
        })
        .catch(() => {});
    },
    clickUserConfiguration() {
      this.$router
        .push({
          name: "UserConfiguration",
        })
        .catch(() => {});
    },
    logout() {
      this.$store.dispatch("Logout").then(() => {
        this.$router
          .push({
            name: "Login",
          })
          .catch(() => {});
      });
    },
  },
};
</script>

<style scoped></style>
