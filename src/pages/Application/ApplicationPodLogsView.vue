<template>
  <v-row>
    <v-col>
      <material-card
        icon="mdi-math-log"
        color="info"
        class="px-5 py-3"
        title="详细信息"
      >
      </material-card>
    </v-col>
  </v-row>
</template>

<script>
import MaterialCard from "@components/card/MaterialCard";
export default {
  name: "ApplicationPodLogsView",
  components: { MaterialCard },
};
</script>

<style scoped></style>
