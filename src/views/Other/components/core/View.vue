<template>
  <v-main :class="$vuetify.theme.dark ? undefined : 'grey lighten-3'">
    <v-img
      :class="{
        'v-image--sm': this.$vuetify.breakpoint.smAndDown,
        'v-image--md': this.$vuetify.breakpoint.mdAndDown,
      }"
      :aspect-ratio="16 / 9"
      :src="require(`@/assets/${src || 'clint-mckoy.jpg'}`)"
      gradient="to top, rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)"
      style="height: 100vh; min-height: 100vh"
    >
      <router-view />
    </v-img>
  </v-main>
</template>

<script>
export default {
  name: "PagesCoreView",

  data: () => ({
    img: {
      "/other/login": "login.jpg",
      "/other/register": "register.jpg",
    },
  }),

  computed: {
    src() {
      return this.img[this.$route.path];
    },
  },
};
</script>

<style lang="sass"></style>
