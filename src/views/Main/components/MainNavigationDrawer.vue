<template>
  <v-navigation-drawer
    id="main-navigation-drawer"
    :expand-on-hover="drawer"
    :mini-variant="drawer"
    :mini-variant-width="80"
    permanent
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    app
    width="260"
  >
    <template v-slot:img="props">
      <v-img
        :gradient="`to bottom, rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)`"
        v-bind="props"
      />
    </template>
    <v-list nav>
      <v-list-item two-line :class="drawer && 'px-0'">
        <v-list-item-avatar>
          <img :src="systemImageUrl" alt="avatar" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ profile.title }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ profile.subtitle }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider />
    <v-list class="mb-n2" nav>
      <v-list-group color="white" no-action eager append-icon="mdi-menu-down">
        <template v-slot:activator>
          <v-list-item-avatar class="align-self-center" color="grey">
            <v-img :src="user.avatar || require('./@assets/avatar/1.jpg')" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title> {{ user.nickname }} </v-list-item-title>
          </v-list-item-content>
        </template>
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
        <v-list-item @click="logout()">
          <v-list-item-icon style="margin-right: 0">
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>安全退出</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
    <v-divider class="mb-2" />
    <v-list expand nav>
      <template v-for="item in menu">
        <v-list-group
          v-if="item.children"
          :key="item.text"
          :group="item.group"
          color="white"
          no-action
          eager
          append-icon="mdi-menu-down"
        >
          <template v-slot:activator>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            active-class="primary white--text"
            v-for="(child, i) in item.children"
            :key="i"
            :to="child.path"
          >
            <v-list-item-action v-if="child.icon">
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ child.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item
          active-class="primary white--text"
          v-else
          :key="item.text"
          :to="item.path"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import menuData from "@/config/menu";
import { mapGetters } from "vuex";
export default {
  name: "MainNavigationDrawer",
  data: () => {
    return {
      imageUrl: require("./@assets/background/1.png"),
      avatarUrl: require("./@assets/avatar/1.jpg"),
      systemImageUrl: require("./@assets/logo.png"),
    };
  },
  computed: {
    ...mapGetters({
      barColor: "GetBarColor",
      user: "GetUser",
    }),
    drawer: {
      get() {
        return this.$store.getters.GetDrawer;
      },
      set(val) {
        this.$store.commit("SetDrawer", val);
      },
    },
    profile() {
      return {
        avatar: true,
        title: this.$t("title"),
        subtitle: this.$t("subtitle"),
      };
    },
    menu() {
      return this.loadMenu();
    },
  },
  methods: {
    loadMenu() {
      let menu = [];
      menuData.forEach((i) => {
        if (this.hasRole(i.role)) {
          if (i.children && i.children.length > 0) {
            let children = i.children;
            let child = [];
            children.forEach((c) => {
              if (this.hasRole(c.role)) {
                child.push(c);
              }
            });
            i.children = child;
          }
          menu.push(i);
        }
      });
      return menu;
    },
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

<style lang="sass">
@import '~vuetify/src/styles/tools/_rtl.sass'
#main-navigation-drawer
  .v-list-group__header.v-list-item--active:before
    opacity: .24

  .v-list-item
    &__icon--text,
    &__icon:first-child
      justify-content: center
      text-align: center
      width: 20px

      +ltr()
        margin-right: 24px
        margin-left: 12px !important

      +rtl()
        margin-left: 24px
        margin-right: 12px !important

  .v-list--dense
    .v-list-item
      &__icon--text,
      &__icon:first-child
        margin-top: 10px

  .v-list-group--sub-group
    .v-list-item
      +ltr()
        padding-left: 8px

      +rtl()
        padding-right: 8px

    .v-list-group__header
      +ltr()
        padding-right: 0

      +rtl()
        padding-right: 0

      .v-list-item__icon--text
        margin-top: 19px
        order: 0

      .v-list-group__header__prepend-icon
        order: 2

        +ltr()
          margin-right: 8px

        +rtl()
          margin-left: 8px
</style>
