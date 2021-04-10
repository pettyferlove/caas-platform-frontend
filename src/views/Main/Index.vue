<template>
  <v-app id="inspire">
    <main-navigation-drawer></main-navigation-drawer>

    <main-app-bar></main-app-bar>

    <main-content></main-content>
  </v-app>
</template>

<script>
import MainNavigationDrawer from "@/views/Main/components/MainNavigationDrawer";
import MainAppBar from "@/views/Main/components/MainAppBar";
import MainContent from "@/views/Main/components/MainContent";
export default {
  name: "Main",
  components: { MainContent, MainAppBar, MainNavigationDrawer },
};
</script>
