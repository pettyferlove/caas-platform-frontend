<template>
  <v-card color="black" flat class="log-card">
    <v-card-text class="pt-0">
      <div class="log-line" v-for="(item, i) in content" :key="i">
        {{ item }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import api from "@/api";

export default {
  name: "Logs",
  props: {
    step: {
      required: true,
      type: String,
    },
    podName: {
      required: true,
      type: String,
    },
    namespaceId: {
      required: true,
      type: String,
    },
  },
  data: () => {
    return {
      content: [],
    };
  },
  mounted() {
    this.loadLog();
  },
  methods: {
    loadLog() {
      api.log.get(this.namespaceId, this.podName, this.step).then((res) => {
        this.content = res.data.split("\n");
      });
    },
  },
};
</script>

<style lang="sass">
.log-card
  margin: 0 20px
  height: 700px
  .log-line
    color: white
    white-space: pre-wrap
</style>
