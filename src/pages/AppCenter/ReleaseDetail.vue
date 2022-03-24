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
              <v-icon slot="icon"> mdi-apps-box </v-icon>基础信息
            </div>

            <v-row class="px-4 pt-4 pb-3" no-gutters>
              <v-col> 名字：{{ detail.name ? detail.name : "" }} </v-col>
              <v-spacer></v-spacer>
              <v-btn
                :loading="detail.upgrading"
                color="primary"
                class="mr-4"
                @click="upgrade(detail)"
              >
                升级 <v-icon right dark> mdi-cloud-upload </v-icon>
              </v-btn>
              <v-btn
                :loading="detail.rollicking"
                color="grey"
                class="mr-4"
                @click="rollback(detail)"
              >
                回滚
                <v-icon right dark>mdi-arrow-bottom-left-bold-outline</v-icon>
              </v-btn>

              <v-btn
                color="red"
                class="mr-4"
                :loading="detail.deleting"
                @click="deleteRelease(detail)"
              >
                删除
                <v-icon right dark>mdi-trash-can-outline</v-icon>
              </v-btn>
              <v-btn color="grey" class="mr-4" @click="back"> 返回 </v-btn>
            </v-row>

            <v-row class="px-4 pt-4 pb-3" no-gutters>
              <v-col>
                App Version：{{
                  detail.chart ? detail.chart.metadata.appVersion : ""
                }}
              </v-col>
              <v-col>
                Version：{{ detail.chart ? detail.chart.metadata.version : "" }}
              </v-col>
            </v-row>

            <div class="subtitle">
              <v-icon slot="icon"> mdi-apps-box </v-icon>其他信息
            </div>
            <v-row class="px-4 pt-4 pb-3" no-gutters>
              <v-col>
                描述：{{
                  detail.chart ? detail.chart.metadata.description : ""
                }}
              </v-col>
            </v-row>

            <div class="subtitle">
              <v-icon slot="icon"> mdi-apps-box </v-icon>资源信息
            </div>

            <v-row class="px-4 pt-4 pb-3" no-gutters>
              <v-tabs v-model="resourceTab" background-color="transparent">
                <v-tab>
                  <template v-if="resourceRefs.deployments.length > 0">
                    <v-badge color="pink" dot> 部署 </v-badge>
                  </template>
                  <template v-else> 部署 </template>
                </v-tab>
                <v-tab>
                  <template v-if="resourceRefs.statefulsets.length > 0">
                    <v-badge color="pink" dot> 有状态集 </v-badge>
                  </template>
                  <template v-else> 有状态集 </template>
                </v-tab>
                <v-tab>
                  <template v-if="resourceRefs.services.length > 0">
                    <v-badge color="pink" dot> 服务 </v-badge>
                  </template>
                  <template v-else> 服务 </template>
                </v-tab>
                <v-tab>
                  <template v-if="resourceRefs.secrets.length > 0">
                    <v-badge color="pink" dot> 密钥 </v-badge>
                  </template>
                  <template v-else> 密钥 </template>
                </v-tab>
                <v-tab>
                  <template v-if="resourceRefs.daemonsets.length > 0">
                    <v-badge color="pink" dot> 守护程序集 </v-badge>
                  </template>
                  <template v-else> 守护程序集 </template>
                </v-tab>
                <v-tab>
                  <template v-if="resourceRefs.otherResources.length > 0">
                    <v-badge color="pink" dot> 其他资源 </v-badge>
                  </template>
                  <template v-else> 其他资源 </template>
                </v-tab>
              </v-tabs>
              <v-tabs-items style="margin-top: 16px" v-model="resourceTab">
                <v-tab-item>
                  <v-sheet outlined rounded>
                    <v-simple-table class="" style="width: 100vw">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th>名称</th>
                            <th>期望副本数</th>
                            <th>就绪副本数</th>
                            <th class="text-right" style="width: 100px">
                              操作
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="item in resourceRefs.deployments"
                            :key="item.metadata.name"
                          >
                            <td>{{ item.metadata.name }}</td>
                            <td>{{ item.status.currentReplicas }}</td>
                            <td>{{ item.status.readyReplicas }}</td>
                            <td class="text-right">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    v-bind="attrs"
                                    v-on="on"
                                    icon
                                    color="green"
                                    @click="handlerRawView(item)"
                                  >
                                    <v-icon small>mdi-eye</v-icon>
                                  </v-btn>
                                </template>
                                <span>查看原生数据</span>
                              </v-tooltip>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-sheet>
                </v-tab-item>
                <v-tab-item>
                  <v-sheet outlined rounded>
                    <v-simple-table class="" style="width: 100vw">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th>名称</th>
                            <th>期望副本数</th>
                            <th>就绪副本数</th>
                            <th class="text-right" style="width: 100px">
                              操作
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="item in resourceRefs.statefulsets"
                            :key="item.metadata.name"
                          >
                            <td>{{ item.metadata.name }}</td>
                            <td>{{ item.status.currentReplicas }}</td>
                            <td>{{ item.status.readyReplicas }}</td>
                            <td class="text-right">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    v-bind="attrs"
                                    v-on="on"
                                    icon
                                    color="green"
                                    @click="handlerRawView(item)"
                                  >
                                    <v-icon small>mdi-eye</v-icon>
                                  </v-btn>
                                </template>
                                <span>查看原生数据</span>
                              </v-tooltip>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-sheet>
                </v-tab-item>
                <v-tab-item>
                  <v-sheet outlined rounded>
                    <v-simple-table style="width: 100vw">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th>名称</th>
                            <th>类型</th>
                            <th>集群IP</th>
                            <th>外部访问IP</th>
                            <th>端口</th>
                            <th class="text-right" style="width: 100px">
                              操作
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="item in resourceRefs.services"
                            :key="item.metadata.name"
                          >
                            <td>{{ item.metadata.name }}</td>
                            <td>{{ item.spec.type }}</td>
                            <td>{{ item.spec.clusterIP }}</td>
                            <td>
                              <template v-if="item.spec.externalIPs">
                                <div
                                  v-for="(i, index) in item.spec.externalIPs"
                                  v-bind:key="`external-ip-` + index"
                                >
                                  <v-chip
                                    class="ma-1"
                                    style="display: inline-block"
                                  >
                                    {{ i }}
                                  </v-chip>
                                </div>
                              </template>
                            </td>
                            <td>
                              <template v-if="item.spec.ports">
                                <div
                                  v-for="(i, index) in item.spec.ports"
                                  v-bind:key="`port-` + index"
                                >
                                  <v-chip
                                    class="ma-1"
                                    style="display: inline-block"
                                  >
                                    {{ i.protocol }}:{{ i.port }}
                                  </v-chip>
                                </div>
                              </template>
                            </td>
                            <td class="text-right">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    v-bind="attrs"
                                    v-on="on"
                                    icon
                                    color="green"
                                    @click="handlerRawView(item)"
                                  >
                                    <v-icon small>mdi-eye</v-icon>
                                  </v-btn>
                                </template>
                                <span>查看原生数据</span>
                              </v-tooltip>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-sheet>
                </v-tab-item>
                <v-tab-item>
                  <v-sheet outlined rounded>
                    <v-simple-table style="width: 100vw">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th>名称</th>
                            <th>类型</th>
                            <th>密钥数据</th>
                            <th class="text-right" style="width: 100px">
                              操作
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="item in resourceRefs.secrets"
                            :key="item.metadata.name"
                          >
                            <td>{{ item.metadata.name }}</td>
                            <td>{{ item.type }}</td>
                            <td>
                              <template v-if="item.data">
                                <div
                                  v-for="(i, index) in Object.keys(item.data)"
                                  v-bind:key="`secret-` + index"
                                >
                                  <v-chip
                                    class="ma-1"
                                    style="display: inline-block"
                                  >
                                    {{ i }} : {{ decode(item.data[i]) }}
                                  </v-chip>
                                </div>
                              </template>
                            </td>
                            <td class="text-right">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    v-bind="attrs"
                                    v-on="on"
                                    icon
                                    color="green"
                                    @click="handlerRawView(item)"
                                  >
                                    <v-icon small>mdi-eye</v-icon>
                                  </v-btn>
                                </template>
                                <span>查看原生数据</span>
                              </v-tooltip>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-sheet>
                </v-tab-item>
                <v-tab-item>
                  <v-sheet outlined rounded>
                    <v-simple-table style="width: 100vw">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th>名称</th>
                            <th>类型</th>
                            <th class="text-right" style="width: 100px">
                              操作
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="item in resourceRefs.daemonsets"
                            :key="item.metadata.name"
                          >
                            <td>{{ item.metadata.name }}</td>
                            <td>{{ item.type }}</td>
                            <td class="text-right">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    v-bind="attrs"
                                    v-on="on"
                                    icon
                                    color="green"
                                    @click="handlerRawView(item)"
                                  >
                                    <v-icon small>mdi-eye</v-icon>
                                  </v-btn>
                                </template>
                                <span>查看原生数据</span>
                              </v-tooltip>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-sheet>
                </v-tab-item>
                <v-tab-item>
                  <v-sheet outlined rounded>
                    <v-simple-table style="width: 100vw">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th>名称</th>
                            <th>类型</th>
                            <th class="text-right" style="width: 100px">
                              操作
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="item in resourceRefs.otherResources"
                            :key="item.metadata.name"
                          >
                            <td>{{ item.metadata.name }}</td>
                            <td>{{ item.kind }}</td>
                            <td class="text-right">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    v-bind="attrs"
                                    v-on="on"
                                    icon
                                    color="green"
                                    @click="handlerRawView(item)"
                                  >
                                    <v-icon small>mdi-eye</v-icon>
                                  </v-btn>
                                </template>
                                <span>查看原生数据</span>
                              </v-tooltip>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-sheet>
                </v-tab-item>
              </v-tabs-items>
            </v-row>
          </div>
        </v-skeleton-loader>
      </material-card>
    </v-col>

    <v-dialog
      transition="dialog-bottom-transition"
      scrollable
      max-width="70vw"
      :value="showDialog"
    >
      <v-card>
        <v-toolbar color="primary" dark>原生配置数据</v-toolbar>
        <v-divider></v-divider>
        <YamlEditor v-model="rawYaml"></YamlEditor><v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="showDialog = false">
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { Base64 } from "js-base64";
import MaterialCard from "@components/card/MaterialCard";
import api from "@/api";
import yaml from "yaml";
import YamlEditor from "@components/editer/YamlEditor";
export default {
  name: "ReleaseDetail",
  components: { YamlEditor, MaterialCard },
  data: () => {
    return {
      namespace: "",
      releaseName: "",
      showDialog: false,
      detail: {},
      config: {},
      resourceTab: 0,
      resourceRefs: {
        ingresses: [],
        deployments: [],
        statefulsets: [],
        daemonsets: [],
        otherResources: [],
        services: [],
        secrets: [],
      },
      initLoading: false,
      types: {
        form: "list-item, card-heading, divider, date-picker-options, date-picker-days, actions, text@4",
      },
      rawYaml: "",
    };
  },
  mounted() {
    this.namespace = this.$route.params.namespace || "";
    this.releaseName = this.$route.params.releaseName || "";
    this.loadDetail();
  },
  methods: {
    loadDetail() {
      api.appCenter.release(this.namespace, this.releaseName).then((res) => {
        this.detail = res.data;
        let parsedManifest = yaml
          .parseAllDocuments(res.data.manifest)
          .map((doc) => doc.toJSON());
        this.parseResource(parsedManifest);
      });
    },
    parseResource(parsedManifest) {
      if (parsedManifest.length) {
        parsedManifest.forEach((item) => {
          switch (item.kind) {
            case "Deployment":
              api.deployment
                .get(this.namespace, item.metadata.name)
                .then((res) => {
                  this.resourceRefs.deployments.push(res.data);
                });
              break;
            case "StatefulSet":
              api.statefulSet
                .get(this.namespace, item.metadata.name)
                .then((res) => {
                  this.resourceRefs.statefulsets.push(res.data);
                });
              break;
            case "DaemonSet":
              api.daemonSet
                .get(this.namespace, item.metadata.name)
                .then((res) => {
                  this.resourceRefs.daemonsets.push(res.data);
                });
              break;
            case "Service":
              api.service
                .get(this.namespace, item.metadata.name)
                .then((res) => {
                  this.resourceRefs.services.push(res.data);
                });
              break;
            case "Ingress":
              api.ingress
                .get(this.namespace, item.metadata.name)
                .then((res) => {
                  this.resourceRefs.ingresses.push(res.data);
                });
              break;
            case "Secret":
              api.secret.get(this.namespace, item.metadata.name).then((res) => {
                this.resourceRefs.secrets.push(res.data);
              });
              break;
            default:
              this.resourceRefs.otherResources.push(item);
          }
        });
      }
    },
    back() {
      this.$router.push({
        name: "AppCenterList",
      });
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    upgrade(item) {
      this.$set(item, "upgrading", true);
      this.$router.push({
        name: "ReleaseUpgrade",
        params: {
          namespace: this.namespace,
          name: item.name,
          chartName: item.chart.metadata.name,
          version: item.chart.metadata.version,
          appVersion: item.chart.metadata.appVersion,
        },
      });
      this.$set(item, "upgrading", false);
    },
    async rollback(item) {
      this.$set(item, "rollicking", true);
      console.log("触发回滚");
      await this.sleep(5000);
      this.$set(item, "rollicking", false);
    },
    deleteRelease(item) {
      this.$set(item, "deleting", true);
      api.appCenter.delete(item.namespace, item.name).then(() => {
        this.$notify({
          group: "default",
          type: "success",
          title: "删除成功",
        });
        this.back();
      });
    },
    decode(value) {
      if (value) {
        return Base64.decode(value);
      } else {
        return "";
      }
    },
    handlerRawView(item) {
      this.showDialog = true;
      this.rawYaml = yaml.stringify(item);
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
  padding: 20px 20px
</style>
