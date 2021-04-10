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

    <v-text-field
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
    </v-text-field>

    <namespace-select></namespace-select>

    <v-btn class="ml-2" min-width="0" text to="/">
      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn>
    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn class="ml-2" min-width="0" text v-bind="attrs" v-on="on">
          <v-badge color="red" overlap bordered>
            <template v-slot:badge>
              <span>5</span>
            </template>

            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-list :tile="false" nav>
        <v-hover v-slot:default="{ hover }">
          <v-list-item
            link
            :dark="hover"
            :class="
              hover ? 'white--text secondary elevation-12' : 'black--text'
            "
          >
            消息列表1
          </v-list-item>
        </v-hover>
      </v-list>
    </v-menu>
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
export default {
  name: "MainAppBar",
  components: { UserSelect, NamespaceSelect },
  data: () => {
    return {
      notifications: [
        "Mike John Responded to your email",
        "You have 5 new tasks",
        "You're now friends with Andrew",
        "Another Notification",
        "Another one",
      ],
    };
  },
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
