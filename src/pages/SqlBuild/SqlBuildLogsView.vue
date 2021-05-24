<template>
  <v-row>
    <v-col>
      <v-card class="mt-0">
        <v-card-text>
          <subheading subheading="Sql构建日志"></subheading>
          <v-tabs
            v-model="selectTab"
            vertical
            :active-class="`success ${
              $vuetify.theme.dark ? 'black' : 'white'
            }--text`"
            class="v-tabs--pill"
            hide-slider
            v-bind="$attrs"
          >
            <v-tab
              v-for="(tab, i) in step"
              style="text-align: left"
              :key="i"
              :active-class="
                tab.ready ? 'success white--text' : 'error white--text'
              "
              class="mb-5"
              >{{ i + 1 + "." + tab.value }}
              <v-icon v-if="tab.ready" right> mdi-check-circle </v-icon>
              <v-icon v-else right> mdi-close-circle </v-icon>
            </v-tab>

            <v-tabs-items vertical v-model="selectTab">
              <v-tab-item v-for="(tab, i) in step" :key="i">
                <logs
                  :pod-name="podName"
                  :step="tab.name"
                  :namespace-id="namespaceId"
                ></logs>
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" class="mr-4" @click="back"> 返回 </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Subheading from "@components/base/Subheading";
import api from "@/api";
import Logs from "@/pages/components/Logs";
export default {
  name: "SqlBuildLogsView",
  components: { Logs, Subheading },
  data: () => {
    return {
      buildId: "",
      jobId: "",
      namespaceId: "",
      podName: "",
      initLoading: false,
      selectTab: 0,
      step: [],
      stepDict: {
        "git-pull": "拉取代码（Git）",
        "svn-pull": "拉取代码（Subversion）",
        "sql-build": "构建SQL脚本",
        persistence: "持久化构建产物",
      },
    };
  },
  mounted() {
    this.buildId = this.$route.params.buildId || "";
    this.jobId = this.$route.params.jobId || "";
  },
  watch: {
    buildId() {
      if (this.buildId.length !== 0) {
        this.loadStep();
      }
    },
  },
  methods: {
    loadStep() {
      api.sqlBuild.buildStep(this.buildId, this.jobId).then((res) => {
        let data = res.data;
        let step = [];
        this.podName = data.podName;
        this.namespaceId = data.namespaceId;
        data.step.forEach((i) => {
          step.push({
            name: i.name,
            value: this.stepDict[i.name],
            ready: i.ready,
          });
        });
        this.step = step;
      });
    },
    back() {
      this.$router.back();
    },
  },
};
</script>

<style lang="sass">
.v-tabs--pill
  .v-tab,
  .v-tab:before
    border-radius: 24px

  &.v-tabs--icons-and-text
    .v-tab,
    .v-tab:before
      border-radius: 4px
</style>
