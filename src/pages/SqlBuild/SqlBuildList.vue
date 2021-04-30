<template>
  <v-row>
    <v-col>
      <material-card
        icon="mdi-history"
        color="warning"
        class="px-5 py-3"
        title="Sql构建"
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

              <template v-slot:item.actions="{ item }">
                <v-menu
                  :open-on-click="false"
                  fixed
                  :rounded="true"
                  offset-y
                  left
                  v-model="showHistoryMenu"
                >
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
                      v-for="item in history"
                      :key="item.fileId"
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
          <v-card-title class="headline"> 是否删除脚本构建？ </v-card-title>
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
import BuildStatus from "@/pages/components/Build/BuildStatus";
import MaterialCard from "@components/card/MaterialCard";
import api from "@/api";
import { mapGetters } from "vuex";
import EnvironmentType from "@components/base/EnvironmentType";
export default {
  name: "SqlBuildList",
  components: { EnvironmentType, BuildStatus, MaterialCard },
  data: () => {
    return {
      deleteTips: false,
      selectId: "",
      queryParams: {},
      loadTimer: null,
      initLoading: false,
      showHistoryMenu: false,
      loading: false,
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
      total: 0,
      history: [{}],
    };
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
  destroyed() {
    this.stopLoadTimer();
  },
  beforeDestroy() {
    this.stopLoadTimer();
  },
  methods: {
    handlerAdd() {
      this.$router.push({
        name: "SqlBuildDetailsAdd",
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
        api.sqlBuild
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
        name: "SqlBuildDetailsEdit",
        params: {
          id: item.id,
        },
      });
    },
    handlerDelete(item) {
      this.selectId = item.id;
      this.deleteTips = true;
    },
    deleteConfirm(selectId) {
      api.sqlBuild
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
    handlerBuild(item) {
      api.sqlBuild
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
    handlerHistory(item) {
      this.$router.push({
        name: "SqlBuildHistoryList",
        params: {
          id: item.id,
        },
      });
    },
    loadHistory(item) {
      this.history = [{}];
      api.sqlBuild.selectList(item.id).then((res) => {
        this.history = res.data || [{}];
        this.showHistoryMenu = true;
      });
    },
    downloadBuild(item) {
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
    },
  },
};
</script>

<style scoped></style>
