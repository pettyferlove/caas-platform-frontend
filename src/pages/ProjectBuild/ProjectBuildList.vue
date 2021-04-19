<template>
  <v-row>
    <v-col>
      <material-card
        icon="mdi-history"
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
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  dense
                  v-model="queryParams.projectName"
                  label="请输入名称"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <EnvironmentType
                  label="请选择环境类型"
                  hide-icon
                  outlined
                  dense
                  v-model="queryParams.envType"
                ></EnvironmentType>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn @click="handlerSearch" rounded color="primary"
                  ><v-icon dark>mdi-magnify</v-icon></v-btn
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

              <template v-slot:item.projectName="{ item }">
                <span>
                  <v-chip class="ma-2" color="cyan" text-color="white">
                    <v-icon left> mdi-hammer-wrench </v-icon>
                    {{
                      item.buildTool.charAt(0).toUpperCase() +
                      item.buildTool.slice(1)
                    }}
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
              <template v-slot:item.createTime="{ item }">
                {{ formatDate(item.createTime) }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-menu fixed :rounded="true" offset-y left>
                  <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn
                          @click="loadHistory(item)"
                          icon
                          color="cyan"
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
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      icon
                      color="cyan"
                      @click="handlerHistory(item)"
                    >
                      <v-icon small>mdi-history</v-icon>
                    </v-btn>
                  </template>
                  <span>查看构建历史</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      icon
                      color="cyan"
                      @click="handlerBuild(item)"
                    >
                      <v-icon small>mdi-wrench-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>立即构建</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      icon
                      color="cyan"
                      @click="handlerModify(item)"
                    >
                      <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>修改构建设置</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      icon
                      color="pink"
                      @click="handlerDelete(item)"
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>删除构建设置</span>
                </v-tooltip>
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
            <v-btn color="green darken-1" @click="deleteTips = false">
              取消
            </v-btn>
            <v-btn color="error darken-1" @click="deleteConfirm(selectId)">
              同意
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
          value: "lastState",
        },
        {
          text: "最后一次构建时间",
          align: "start",
          value: "lastBuildTime",
        },
        {
          text: "环境",
          align: "center",
          value: "envType",
        },
        {
          text: "自动构建",
          value: "openAutoBuild",
          align: "start",
          width: 120,
        },
        { text: "创建时间", value: "createTime" },
        {
          text: "操作",
          value: "actions",
          sortable: false,
          align: "end",
          width: 220,
        },
      ],
      datasets: [],
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
    loadData() {
      return new Promise((resolve, reject) => {
        api.projectBuild
          .page({
            current: this.options.page,
            size: this.options.itemsPerPage,
            ...this.queryParams,
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
        this.history = res.data;
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
