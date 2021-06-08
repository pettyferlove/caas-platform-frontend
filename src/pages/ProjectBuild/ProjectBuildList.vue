<template>
  <v-row>
    <v-col>
      <material-card
        icon="mdi-apache-kafka"
        color="warning"
        class="px-5 py-3"
        title="项目构建"
      >
        <v-skeleton-loader
          transition="fade-transition"
          height="500"
          type="table"
          :loading="initLoading"
        >
          <div>
            <v-row class="text-start pt-2">
              <v-col cols="12" sm="6" md="2">
                <v-text-field
                  dense
                  v-model="queryParams.projectName"
                  label="请输入项目名称"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-text-field
                  dense
                  v-model="queryParams.projectDescribe"
                  label="请输入项目说明"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <EnvironmentType
                  label="请选择环境类型"
                  hide-icon
                  outlined
                  dense
                  v-model="queryParams.envType"
                ></EnvironmentType>
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-select
                  class="v-data-table-query-params"
                  :items="keywords"
                  v-model="queryParams.keywords"
                  label="关键词"
                  item-text="name"
                  item-value="id"
                  outlined
                  chips
                  dense
                  multiple
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-btn @click="handlerSearch" rounded color="primary"
                  ><v-icon dark>mdi-magnify</v-icon></v-btn
                >
                <v-btn @click="handlerRestart" rounded color="grey"
                  ><v-icon dark>mdi-restart</v-icon></v-btn
                >
              </v-col>
            </v-row>
            <div class="text-start pt-2" style="margin-bottom: 10px">
              <v-btn rounded color="primary" @click="handlerAdd"
                ><v-icon dark>mdi-plus</v-icon></v-btn
              >
            </div>

            <v-data-table
              locale="zh_CN"
              :headers="headers"
              :items="datasets"
              :options.sync="options"
              :server-items-length="total"
              :loading="loading"
              loading-text="正在加载..."
              :footer-props="{
                itemsPerPageOptions: [5, 10, 15],
              }"
            >
              <template v-slot:item.lastState="{ item }">
                <BuildStatus :state="item.lastState"></BuildStatus>
              </template>
              <template v-slot:item.keywords="{ item }">
                <template v-if="item.keywords">
                  <v-chip
                    label
                    outlined
                    v-for="(i, index) in JSON.parse(item.keywords)"
                    v-bind:key="`keyword-` + index"
                    style="margin: 2px"
                    :color="i.color"
                  >
                    <v-icon left> mdi-label </v-icon> {{ i.name }}
                  </v-chip>
                </template>
              </template>
              <template v-slot:item.projectName="{ item }">
                <span>
                  <v-chip
                    v-if="item.buildTool"
                    class="ma-2"
                    color="cyan"
                    text-color="white"
                  >
                    <v-icon left> mdi-hammer-wrench </v-icon>
                    {{
                      item.buildTool.charAt(0).toUpperCase() +
                      item.buildTool.slice(1)
                    }}
                  </v-chip>
                  <v-chip v-else class="ma-2" color="cyan" text-color="white">
                    <v-icon left> mdi-blur-off </v-icon>
                    None
                  </v-chip>
                  {{ item.projectName }}
                </span>
              </template>

              <template v-slot:item.lastBuildTime="{ item }">
                <template v-if="!item.lastBuildTime"> 暂无构建记录 </template>
                <template v-else>
                  {{ item.lastBuildTime }}
                </template>
              </template>

              <template v-slot:item.envType="{ item }">
                <EnvironmentType
                  :value="item.envType"
                  type="label"
                ></EnvironmentType>
              </template>

              <template v-slot:item.openAutoBuild="{ item }">
                <v-switch
                  dense
                  :true-value="1"
                  :false-value="0"
                  style="margin-left: 14px"
                  v-model="item.openAutoBuild"
                  @change="changeAutoBuildStatus(item)"
                ></v-switch>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-menu
                  transition="slide-y-transition"
                  rounded="lg"
                  bottom
                  left
                >
                  <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn
                          @click="loadHistory(item)"
                          icon
                          color="grey"
                          v-bind="attrs"
                          v-on="{ ...tooltip, ...menu }"
                        >
                          <v-icon small>mdi-cloud-download</v-icon>
                        </v-btn>
                      </template>
                      <span>下载历史构建脚本</span>
                    </v-tooltip>
                  </template>
                  <v-list v-if="history.size !== 0">
                    <v-list-item
                      :disabled="item.buildStatus !== 'success'"
                      v-for="(item, index) in history"
                      :key="index"
                      link
                      @click="downloadBuild(item)"
                    >
                      <v-list-item-action>
                        <BuildStatus :state="item.buildStatus"></BuildStatus>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          item.createTime
                        }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-menu
                  transition="slide-y-transition"
                  rounded="lg"
                  bottom
                  left
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="grey" icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item
                          @click="handlerHistory(item)"
                          v-bind="attrs"
                          v-on="on"
                          link
                        >
                          <v-list-item-action style="margin-right: 2px">
                            <v-icon>mdi-history</v-icon>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title>构建历史</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <span>查看构建历史记录</span>
                    </v-tooltip>

                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item
                          @click="handlerBuild(item)"
                          v-bind="attrs"
                          v-on="on"
                          link
                        >
                          <v-list-item-action style="margin-right: 2px">
                            <v-icon>mdi-wrench-outline</v-icon>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title>立即构建</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <span>立即构建</span>
                    </v-tooltip>

                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item
                          @click="handlerModify(item)"
                          v-bind="attrs"
                          v-on="on"
                          link
                        >
                          <v-list-item-action style="margin-right: 2px">
                            <v-icon>mdi-pencil</v-icon>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title>修改设置</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <span>修改构建设置</span>
                    </v-tooltip>

                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item
                          @click="handlerDelete(item)"
                          v-bind="attrs"
                          v-on="on"
                          link
                        >
                          <v-list-item-action style="margin-right: 2px">
                            <v-icon>mdi-delete</v-icon>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title>删除设置</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <span>删除构建设置</span>
                    </v-tooltip>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </div>
        </v-skeleton-loader>
      </material-card>
      <v-dialog v-model="deleteTips" persistent max-width="400">
        <v-card>
          <v-card-title class="headline"> 是否删除项目构建？ </v-card-title>
          <v-card-text>该操作无法撤销，请确认是否继续</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="deleteTips = false">
              取消
            </v-btn>
            <v-btn color="error darken-1" @click="deleteConfirm(selectId)">
              确认
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import api from "@/api";
import dayjs from "dayjs";
import MaterialCard from "@components/card/MaterialCard";
import BuildStatus from "@/pages/components/Build/BuildStatus";
import { mapGetters } from "vuex";
import EnvironmentType from "@components/base/EnvironmentType";
export default {
  name: "ProjectBuildList",
  components: { EnvironmentType, BuildStatus, MaterialCard },
  data: () => {
    return {
      deleteTips: false,
      selectId: "",
      queryParams: {},
      initLoading: false,
      showHistoryMenu: false,
      loading: false,
      dialog: false,
      total: 0,
      loadTimer: null,
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
        groupBy: [],
        groupDesc: [],
        multiSort: true,
        mustSort: true,
      },
      headers: [
        {
          text: "名称",
          align: "start",
          value: "projectName",
        },
        {
          text: "最后一次构建状态",
          align: "start",
          sortable: false,
          value: "lastState",
        },
        {
          text: "构建分支",
          align: "center",
          value: "remoteBranch",
        },
        {
          text: "说明",
          align: "start",
          sortable: false,
          value: "projectDescribe",
        },
        {
          text: "关键词",
          align: "center",
          sortable: false,
          value: "keywords",
        },
        {
          text: "最后一次构建时间",
          align: "start",
          value: "lastBuildTime",
        },
        {
          text: "环境",
          align: "center",
          sortable: false,
          value: "envType",
        },
        {
          text: "自动构建",
          value: "openAutoBuild",
          align: "start",
          sortable: false,
          width: 120,
        },
        {
          text: "操作",
          value: "actions",
          sortable: false,
          align: "end",
          width: 120,
        },
      ],
      datasets: [],
      keywords: [],
      history: [{}],
    };
  },
  watch: {
    options: {
      deep: true,
      handler() {
        this.loadData();
      },
    },
    currentNamespace() {
      this.loading = true;
      this.loadData().finally(() => {
        this.loading = false;
      });
    },
  },
  computed: {
    ...mapGetters({
      currentNamespace: "GetCurrentNamespace",
    }),
  },
  mounted() {
    this.initLoading = true;
    this.loadData().finally(() => {
      this.loadAllSelectedKeyword();
      this.initLoading = false;
    });
    if (!this.loadTimer) {
      this.startLoadTimer();
    }
  },
  destroyed() {
    this.stopLoadTimer();
  },
  beforeDestroy() {
    this.stopLoadTimer();
  },
  methods: {
    formatDate(date) {
      return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
    },
    handlerAdd() {
      this.$router.push({
        name: "ProjectBuildDetailsAdd",
      });
    },
    handlerSearch() {
      this.loading = true;
      this.loadData().finally(() => {
        this.loading = false;
      });
    },
    handlerRestart() {
      this.queryParams = {};
      this.handlerSearch();
    },
    startLoadTimer() {
      let that = this;
      that.loadTimer = setInterval(that.loadData, 5000);
      that.$once("hook:beforeDestroy", () => {
        that.stopLoadTimer();
      });
    },
    stopLoadTimer() {
      clearInterval(this.loadTimer);
      this.loadTimer = null;
    },
    loadAllSelectedKeyword() {
      return new Promise((resolve, reject) => {
        api.keyword
          .allSelected()
          .then((res) => {
            this.keywords = res.data;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    loadData() {
      return new Promise((resolve, reject) => {
        api.projectBuild
          .page({
            descs: this.sortDesc(this.options),
            ascs: this.sortAsc(this.options),
            current: this.options.page,
            size: this.options.itemsPerPage,
            ...this.queryParams,
            keywords: this.queryParams.keywords
              ? this.queryParams.keywords.join(",")
              : "",
            namespaceId: this.currentNamespace.id,
          })
          .then((res) => {
            this.datasets = res.data.records;
            this.total = res.data.total;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    handlerModify(item) {
      this.$router.push({
        name: "ProjectBuildDetailsEdit",
        params: {
          id: item.id,
        },
      });
    },
    handlerBuild(item) {
      api.projectBuild
        .build(item.id)
        .then(() => {
          this.$notify({
            group: "default",
            type: "success",
            title: "触发构建成功，稍后会通知您构建结",
          });
        })
        .catch(() => {
          this.$notify({
            group: "default",
            type: "error",
            title: "触发构建失败",
          });
        })
        .finally(() => {
          this.loadData();
        });
    },
    handlerDelete(item) {
      this.selectId = item.id;
      this.deleteTips = true;
    },
    deleteConfirm(selectId) {
      api.projectBuild
        .delete(selectId)
        .then(() => {
          this.loadData();
          this.deleteTips = false;
          this.$notify({
            group: "default",
            type: "success",
            title: "删除成功",
          });
        })
        .catch(() => {
          this.$notify({
            group: "default",
            type: "error",
            title: "删除失败",
          });
        });
    },
    changeAutoBuildStatus(item) {
      this.stopLoadTimer();
      api.projectBuild
        .updateStatus({ id: item.id, status: item.openAutoBuild })
        .then(() => {
          this.loadData();
          if (!this.loadTimer) {
            this.startLoadTimer();
          }
        });
    },
    handlerHistory(item) {
      this.$router.push({
        name: "ProjectBuildHistoryList",
        params: {
          id: item.id,
        },
      });
    },
    loadHistory(item) {
      this.history = [{}];
      api.projectBuild.selectList(item.id).then((res) => {
        this.history = res.data || [{}];
        this.showHistoryMenu = true;
      });
    },
    downloadBuild(item) {
      if (item.fileId) {
        api.buildFile
          .download(item.fileId)
          .then((response) => {
            if (!response) {
              return;
            }
            let url = window.URL.createObjectURL(new Blob([response.data]));
            let aLink = document.createElement("a");
            let contentDisposition = response.headers["content-disposition"];
            let disposition = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
            let result = disposition.exec(contentDisposition);
            let filename = decodeURI(result[1]);
            aLink.style.display = "none";
            aLink.href = url;
            aLink.setAttribute("download", filename);
            document.body.appendChild(aLink);
            aLink.click();
            document.body.removeChild(aLink);
            window.URL.revokeObjectURL(url);
          })
          .catch(() => {
            this.$notify({
              group: "default",
              type: "error",
              title: "文件丢失，请尝试其他版本",
            });
          });
      } else {
        this.$notify({
          group: "default",
          type: "error",
          title: "该构建记录未进行持久化，请检查是否开启持久化配置",
        });
      }
    },
  },
};
</script>

<style scoped></style>
