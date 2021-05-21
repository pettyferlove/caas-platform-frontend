<template>
  <v-row>
    <v-col>
      <material-card
        icon="mdi-apps-box"
        color="warning"
        class="px-5 py-3"
        title="应用部署"
      >
        <v-skeleton-loader
          transition="fade-transition"
          height="500"
          type="form"
          :types="types"
          :loading="initLoading"
        >
          <div>
            <div class="subtitle">
              <v-icon slot="icon"> mdi-apps-box </v-icon>版本选择
            </div>
            <v-row style="margin: 18px">
              <v-select
                v-model="selectedVersion"
                :items="version"
                menu-props="auto"
                label="选择版本"
                item-text="name"
                item-value="value"
                prepend-icon="mdi-map"
              ></v-select>
              <v-spacer></v-spacer>
              <v-btn color="primary" class="mr-4" @click="deploy"> 部署 </v-btn>
              <v-btn color="grey" class="mr-4" @click="back"> 返回 </v-btn>
            </v-row>

            <div class="subtitle">
              <v-icon slot="icon"> mdi-apps-box </v-icon>基础信息
            </div>
            <v-row class="px-4 pt-4 pb-3" no-gutters>
              <v-col align-self="start" class="pa-0" cols="12">
                <v-avatar class="profile" size="164" tile>
                  <v-img
                    :src="
                      detail.attributes
                        ? url + '/api/assetsvc' + detail.attributes.icon
                        : ''
                    "
                  ></v-img>
                </v-avatar>
              </v-col>
              <v-col class="py-0">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="title">
                      {{ detail.attributes ? detail.attributes.name : "" }}
                    </v-list-item-title>
                    <v-list-item-subtitle>{{ detail.id }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>

            <v-row class="px-4 pt-4 pb-3" no-gutters>
              <v-col>
                <template v-if="detail.attributes">
                  <template v-for="(item, index) in detail.attributes.keywords">
                    <v-chip
                      text-color="white"
                      color="green"
                      v-bind:key="`keywords-` + index"
                      class="ma-2"
                    >
                      <v-icon left> mdi-label </v-icon> {{ item }}
                    </v-chip>
                  </template>
                </template>
              </v-col>
            </v-row>

            <v-row class="px-4 pt-4 pb-3" no-gutters>
              <v-col>
                应用版本：{{
                  detail.relationships
                    ? detail.relationships.latestChartVersion.data.app_version
                    : ""
                }}
              </v-col>
              <v-col>
                应用首页：<a
                  target="_blank"
                  :href="detail.attributes ? detail.attributes.home : '#'"
                  >{{ detail.attributes ? detail.attributes.home : "" }}</a
                >
              </v-col>
            </v-row>

            <v-row class="px-4 pt-4 pb-3" no-gutters>
              <v-col>
                相关链接：
                <template v-if="detail.attributes.sources">
                  <li
                    style="margin-top: 5px"
                    v-for="(item, index) in detail.attributes.sources"
                    v-bind:key="`link-` + index"
                  >
                    <a target="_blank" :href="item || '#'">{{ item || "" }}</a>
                  </li>
                </template>
              </v-col>
            </v-row>

            <div class="subtitle">
              <v-icon slot="icon"> mdi-text-box-multiple </v-icon>应用说明文档
            </div>
            <v-row>
              <markdown-it-vue
                class="md-body"
                :content="content"
                :options="options"
              ></markdown-it-vue>
            </v-row>
          </div>
        </v-skeleton-loader>
      </material-card>
    </v-col>
  </v-row>
</template>

<script>
import api from "@/api";
import MaterialCard from "@components/card/MaterialCard";
import MarkdownItVue from "markdown-it-vue";
import "markdown-it-vue/dist/markdown-it-vue-light.css";
export default {
  name: "AppCenterDetail",
  components: { MarkdownItVue, MaterialCard },
  data: () => {
    return {
      repo: "",
      chartName: "",
      url: "",
      initLoading: false,
      types: {
        form:
          "list-item, card-heading, divider, date-picker-options, date-picker-days, actions, text@4",
      },
      version: [],
      selectedVersion: "",
      options: {
        linkAttributes: {
          attrs: {
            target: "_blank",
            rel: "noopener",
          },
        },
        katex: {
          throwOnError: false,
          errorColor: "#cc0000",
        },
        icons: "font-awesome",
        githubToc: {
          tocFirstLevel: 2,
          tocLastLevel: 3,
          tocClassName: "toc",
          anchorLinkSymbol: "",
          anchorLinkSpace: false,
          anchorClassName: "anchor",
          anchorLinkSymbolClassName: "octicon octicon-link",
        },
        mermaid: {
          theme: "default",
        },
        image: {
          hAlign: "left",
          viewer: false,
        },
      },
      content: "",
      detail: {},
    };
  },
  watch: {
    chartName() {
      if (this.chartName.length !== 0) {
        this.loadVersions();
        this.loadDetail();
      }
    },
    selectedVersion() {
      if (this.selectedVersion.length !== 0) {
        this.loadReadme();
      }
    },
  },
  mounted() {
    this.repo = this.$route.params.repo || "";
    this.chartName = this.$route.params.chartName || "";
    this.loadConfig();
  },
  methods: {
    loadConfig() {
      api.appCenter.config().then((res) => {
        this.url = res.data;
      });
    },
    loadVersions() {
      api.appCenter.versions(this.repo, this.chartName).then((res) => {
        this.version = [];
        res.data.forEach((item, index) => {
          if (index === 0) {
            this.selectedVersion = item.attributes.version;
          }
          let v = {
            name:
              item.attributes.version +
              " / App Version:" +
              item.attributes.app_version,
            value: item.attributes.version,
          };
          this.version.push(v);
        });
      });
    },
    loadDetail() {
      api.appCenter.detail(this.repo, this.chartName).then((res) => {
        this.detail = res.data;
        console.log(this.detail);
      });
    },
    loadReadme() {
      api.appCenter
        .readme(this.repo, this.chartName, this.selectedVersion)
        .then((res) => {
          this.content = res.data;
        });
    },
    back() {
      this.$router.push({
        name: "AppCenterList",
      });
    },
    deploy() {
      this.$router.push({
        name: "AppCenterDeploy",
        params: {
          repo: this.repo,
          chartName: this.chartName,
          version: this.selectedVersion,
        },
      });
    },
  },
};
</script>

<style scoped lang="sass">
.subtitle
  i
    margin-right: 6px
  align-items: center
  display: flex
  height: 48px
  font-size: 1.175rem
  font-weight: bold
  padding: 28px 18px
.md-body
  padding: 40px 32px
</style>
