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
          <img :src="avatarUrl" alt="avatar" />
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
    <v-divider class="mb-2" />
    <v-list expand nav>
      <template v-for="item in items">
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
import { mapGetters } from "vuex";
export default {
  name: "MainNavigationDrawer",
  data: () => {
    return {
      imageUrl: require("./@assets/background/1.png"),
      avatarUrl: require("./@assets/avatar/1.jpg"),
      items: [
        {
          icon: "mdi-monitor-dashboard",
          text: "Dashboard",
          path: "/dashboard",
        },
        {
          icon: "mdi-apache-kafka",
          text: "项目构建",
          path: "/project-build",
        },
        {
          icon: "mdi-database-clock",
          text: "SQL构建",
          path: "/sql-build",
        },
        {
          icon: "mdi-apps",
          text: "应用管理",
          path: "/application",
        },
        {
          icon: "mdi-file-cog",
          text: "配置管理",
          path: "/config",
        },
        {
          icon: "mdi-semantic-web",
          text: "服务治理",
          path: "/service-governance",
        },
        {
          icon: "mdi-diameter",
          text: "系统资源",
          group: "resources",
          active: false,
          children: [
            {
              icon: "mdi-hexagon-slice-4",
              text: "命名空间",
              path: "/resources/namespace",
            },
            {
              icon: "mdi-database",
              text: "持久卷",
              path: "/resources/persistent-volume",
            },
          ],
        },
        {
          icon: "mdi-cogs",
          text: "系统配置",
          path: "/globe-configuration",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      barColor: "GetBarColor",
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
