<template>
  <v-main>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
    <main-footer></main-footer>
  </v-main>
</template>

<script>
import MainFooter from "@/views/Main/components/MainFooter";
export default {
  name: "MainContent",
  components: { MainFooter },
  props: {},
};
</script>

<style scoped></style>
