<template>
  <v-app id="inspire">
    <pages-core-app-bar></pages-core-app-bar>

    <pages-core-view></pages-core-view>

    <pages-core-footer></pages-core-footer>
  </v-app>
</template>

<script>
import PagesCoreAppBar from "@/views/Other/components/core/AppBar";
import PagesCoreView from "@/views/Other/components/core/View";
import PagesCoreFooter from "@/views/Other/components/core/Footer";
export default {
  name: "PagesIndex",
  components: { PagesCoreFooter, PagesCoreView, PagesCoreAppBar },
  created() {
    this.$vuetify.theme.dark = true;
  },

  beforeDestroy() {
    this.$vuetify.theme.dark = false;
  },
};
</script>
