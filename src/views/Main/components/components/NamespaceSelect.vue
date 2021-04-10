<template>
  <v-menu transition="slide-y-transition" bottom offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-if="currentNamespace.id"
        v-bind="attrs"
        v-on="on"
        outlined
        color="indigo"
      >
        <v-icon dark>mdi-apps</v-icon>
        {{ currentNamespace.name }}</v-btn
      >
      <v-btn v-else @click="handlerClick" outlined color="indigo">
        <v-icon dark>mdi-plus</v-icon></v-btn
      >
    </template>
    <v-list v-if="namespaces.length > 0">
      <v-list-item
        v-for="(item, i) in namespaces"
        :key="i"
        @click="selectNamespace(item)"
      >
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "NamespaceSelect",
  mounted() {
    this.loadData();
  },
  computed: {
    ...mapGetters({
      namespaces: "GetNamespaces",
      currentNamespace: "GetCurrentNamespace",
    }),
  },
  methods: {
    ...mapMutations({
      setCurrentNamespace: "SetCurrentNamespace",
    }),
    loadData() {
      this.$store.dispatch("LoadNamespaces");
    },
    selectNamespace(item) {
      this.setCurrentNamespace(item);
    },
    handlerClick() {
      this.$router.push({
        name: "NamespaceList",
      });
    },
  },
};
</script>

<style scoped></style>
