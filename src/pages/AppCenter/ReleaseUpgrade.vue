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
          <v-form ref="form">
            <div class="subtitle">
              <v-icon slot="icon"> mdi-apps-box </v-icon>基础信息
            </div>
            <v-row style="margin: 18px">
              <v-text-field
                label="应用名称"
                placeholder="填写应用名称"
                v-model="name"
                :counter="50"
                :rules="[(v) => !!v || '必须填写应用名称']"
                prepend-icon="mdi-database-edit"
                required
              ></v-text-field>
            </v-row>
            <v-row style="margin: 18px">
              <v-select
                v-model="selectedVersion"
                :items="version"
                @change="changeVersion"
                menu-props="auto"
                label="选择版本"
                item-text="name"
                item-value="value"
                prepend-icon="mdi-map"
              ></v-select>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                class="mr-4"
                :loading="submitting"
                @click="upgrade"
              >
                升级
              </v-btn>
              <v-btn color="grey" class="mr-4" @click="back"> 返回 </v-btn>
            </v-row>
            <v-divider></v-divider>
            <div class="subtitle">
              <v-icon slot="icon"> mdi-text-box-multiple </v-icon>配置文件
            </div>
            <YamlEditor class="md-body" v-model="yaml"></YamlEditor>
          </v-form>
        </v-skeleton-loader>
      </material-card>
    </v-col>
  </v-row>
</template>

<script>
import MaterialCard from "@components/card/MaterialCard";
import { mapGetters } from "vuex";
import api from "@/api";
import YamlEditor from "@components/editer/YamlEditor";
import yaml from "yaml";
import * as jsonpatch from "fast-json-patch";
import * as schema from "@/libs/schema";
export default {
  name: "ReleaseUpgrade",
  components: { YamlEditor, MaterialCard },
  data: () => {
    return {
      namespace: "",
      chart: {},
      detail: {},
      submitting: false,
      repo: "",
      chartName: "",
      currentVersion: "",
      currentAppVersion: "",
      defaultValuesObj: {},
      deployedValuesObj: {},
      version: [],
      selectedVersion: "",
      yaml: "",
      name: "",
      initLoading: false,
      types: {
        form:
          "list-item, card-heading, divider, date-picker-options, date-picker-days, actions, text@4",
      },
    };
  },
  computed: {
    ...mapGetters({
      currentNamespace: "GetCurrentNamespace",
    }),
  },
  mounted() {
    this.namespace = this.$route.params.namespace || "";
    this.name = this.$route.params.name || "";
    this.chartName = this.$route.params.chartName || "";
    this.currentVersion = this.$route.params.version || "";
    this.selectedVersion = this.$route.params.version || "";
    this.currentAppVersion = this.$route.params.appVersion || "";
    this.searchChart().then(() => {
      this.loadVersions();
      this.loadDetail().then(() => {
        this.loadYaml();
      });
    });
  },
  methods: {
    loadVersions() {
      api.appCenter.versions(this.repo, this.chartName).then((res) => {
        this.version = [];
        res.data.forEach((item) => {
          let v = {
            name:
              item.attributes.version +
              " / App Version:" +
              item.attributes.app_version +
              (item.attributes.version === this.currentVersion
                ? " / 当前所选版本"
                : ""),
            value: item.attributes.version,
          };
          this.version.push(v);
        });
      });
    },
    searchChart() {
      return new Promise((resolve, reject) => {
        api.appCenter
          .search({
            name: this.chartName,
            version: this.currentVersion,
            appVersion: this.currentAppVersion,
          })
          .then((res) => {
            if (res.data.record[0]) {
              this.chart = res.data.record[0];
              this.repo = this.chart.attributes.repo.name;
              resolve();
            } else {
              this.$notify({
                group: "default",
                type: "error",
                title: "获取Chart基本信息失败",
              });
              reject();
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    loadDetail() {
      return new Promise((resolve, reject) => {
        api.appCenter
          .release(this.namespace, this.name)
          .then((res) => {
            this.detail = res.data;
            this.deployedValuesObj = yaml.parse(res.data.config.raw || "");
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    changeVersion() {
      this.loadYaml();
    },
    loadYaml() {
      api.appCenter
        .yaml(this.repo, this.chartName, this.selectedVersion)
        .then((res) => {
          this.defaultValuesObj = yaml.parse(res.data);
          let newModifications = jsonpatch.compare(
            this.defaultValuesObj,
            this.deployedValuesObj
          );
          this.yaml = this.applyModifications(newModifications, res.data);
        });
    },
    upgrade() {
      if (this.$refs.form.validate()) {
        this.submitting = true;
        let data = {
          appRepositoryResourceName: this.repo,
          appRepositoryResourceNamespace: "kubeapps",
          chartName: this.chartName,
          releaseName: this.name,
          version: this.selectedVersion,
          values: this.yaml,
        };
        api.appCenter
          .update(this.namespace, data)
          .then(() => {
            this.$notify({
              group: "default",
              type: "success",
              title: "部署成功",
            });
            this.$router.push({
              name: "AppCenterList",
            });
          })
          .finally(() => {
            this.submitting = false;
          });
      }
    },
    back() {
      this.$router.back();
    },
    applyModifications(mods, values) {
      if (mods.length) {
        mods.forEach((modification) => {
          if (modification.op === "remove") {
            values = schema.deleteValue(values, modification.path);
          } else {
            const value = modification.value;
            values = schema.setValue(values, modification.path, value);
          }
        });
      }
      return values;
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
  padding: 20px
  height: 740px
</style>
