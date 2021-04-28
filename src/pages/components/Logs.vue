<template>
  <v-card color="black" flat class="log-card">
    <v-card-text class="py-0">
      <div class="log-wrapper">
        <div ref="container" class="log-container">
          <div ref="log">
            <div class="log-line" v-for="(item, i) in content" :key="i">
              {{ item }}
            </div>
          </div>
        </div>
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
      api.log
        .buildLog(this.namespaceId, this.podName, this.step)
        .then((res) => {
          this.content = res.data.split("\n");
        })
        .finally(() => {
          this.$nextTick(() => {
            this.$refs.container.scrollTop = this.$refs.log.scrollHeight;
          });
        });
    },
  },
};
</script>

<style lang="sass">
.log-wrapper
  height: 700px
  .log-container
    background-color: inherit
    height: 700px
    box-sizing: border-box
    left: 0
    margin: 0
    overflow-x: hidden
    overflow-y: auto
    padding: 0
    position: absolute
    right: 0
.log-card
  margin: 0 20px
  .log-line
    color: white
    white-space: pre-wrap
</style>
