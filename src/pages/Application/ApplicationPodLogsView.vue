<template>
  <v-row>
    <v-col>
      <material-card
        icon="mdi-math-log"
        color="info"
        class="py-4"
        title="日志信息"
      >
        <v-card-text class="py-2">
          <div style="background-color: #333" class="log-wrapper">
            <div ref="container" class="log-container">
              <div ref="log">
                <div class="log-line" v-for="(item, i) in content" :key="i">
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" class="mr-4" @click="back"> 返回 </v-btn>
        </v-card-actions>
      </material-card>
    </v-col>
  </v-row>
</template>

<script>
import MaterialCard from "@components/card/MaterialCard";
import api from "@/api";
export default {
  name: "ApplicationPodLogsView",
  components: { MaterialCard },
  data: () => {
    return {
      namespaceId: "",
      name: "",
      content: [],
    };
  },
  mounted() {
    this.namespaceId = this.$route.params.namespace || "";
    this.name = this.$route.params.name || "";
    this.loadLog();
  },
  methods: {
    loadLog() {
      api.log
        .applicationLog(this.namespaceId, this.name)
        .then((res) => {
          this.content = res.data.split("\n");
        })
        .finally(() => {
          this.$nextTick(() => {
            this.$refs.container.scrollTop = this.$refs.log.scrollHeight;
          });
        });
    },
    back() {
      this.$router.back();
    },
  },
};
</script>

<style lang="sass">
.log-wrapper
  height: 700px
  background-color: #333
  white-space: pre-wrap
  color: white
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
</style>
