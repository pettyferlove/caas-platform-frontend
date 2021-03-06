<template>
  <v-row>
    <v-col>
      <v-card class="mt-0">
        <v-card-text>
          <subheading subheading="项目构建日志"></subheading>
          <v-tabs
            v-if="step.length > 0"
            v-model="selectTab"
            vertical
            :active-class="`success ${
              $vuetify.theme.dark ? 'black' : 'white'
            }--text`"
            class="v-tabs--pill"
            hide-slider
            v-bind="$attrs"
            @change="loadStep"
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
                <Logs
                  :pod-name="podName"
                  :step="tab.name"
                  :namespace-id="namespaceId"
                ></Logs>
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>
          <v-alert v-else border="top" colored-border type="info" elevation="2">
            暂无日志，构建任务可能已被删除
          </v-alert>
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
  name: "ProjectBuildLogsView",
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
        "pre-shell": "执行前置脚本",
        "maven-build": "Maven构建",
        "post-shell": "执行后置脚本",
        "nodejs-build": "NodeJS构建",
        "docker-build": "Docker镜像构建",
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
      api.projectBuild.buildStep(this.buildId, this.jobId).then((res) => {
        let data = res.data;
        let step = [];
        this.podName = data.podName;
        this.namespaceId = data.namespaceId;
        if (data.step) {
          data.step.forEach((i) => {
            step.push({
              name: i.name,
              value: this.stepDict[i.name],
              ready: i.ready,
            });
          });
        }
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
