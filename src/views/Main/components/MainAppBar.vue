<template>
  <v-app-bar id="app-bar" absolute app color="transparent" flat height="75">
    <v-btn class="mr-3" elevation="1" fab small @click="setDrawer(!drawer)">
      <v-icon> mdi-dots-vertical </v-icon>
    </v-btn>
    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      v-text="$route.meta.title"
    />
    <v-spacer />

    <!--    <v-text-field
      :label="$t('search')"
      color="secondary"
      hide-details
      style="max-width: 200px; margin-right: 45px"
    >
      <template v-if="$vuetify.breakpoint.mdAndUp" v-slot:append-outer>
        <v-btn class="mt-n2" elevation="1" fab small>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </template>
    </v-text-field>-->

    <namespace-select></namespace-select>

    <v-btn class="ml-2" min-width="0" text to="/">
      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn>
    <UserMessage></UserMessage>
    <!--    <v-btn class="ml-2" min-width="0" text to="/user">
      <v-icon>mdi-account</v-icon>
    </v-btn>-->
    <user-select></user-select>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import NamespaceSelect from "@/views/Main/components/components/NamespaceSelect";
import UserSelect from "@/views/Main/components/components/UserSelect";
import UserMessage from "@/views/Main/components/components/UserMessage";
export default {
  name: "MainAppBar",
  components: { UserMessage, UserSelect, NamespaceSelect },
  computed: {
    ...mapGetters({
      drawer: "GetDrawer",
    }),
  },
  methods: {
    ...mapMutations({
      setDrawer: "SetDrawer",
    }),
  },
};
</script>

<style scoped></style>
