<template>
  <v-row>
    <v-col>
      <material-card
        icon="mdi-history"
        color="warning"
        class="px-5 py-3"
        title="Sql构建历史"
      >
        <v-skeleton-loader
          transition="fade-transition"
          height="500"
          type="table"
          :loading="initLoading"
        >
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
            <template v-slot:item.buildStatus="{ item }">
              <BuildStatus :state="item.buildStatus"></BuildStatus>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :disabled="item.buildStatus !== 'success'"
                    v-bind="attrs"
                    v-on="on"
                    icon
                    color="cyan"
                    @click="handlerDownload(item)"
                  >
                    <v-icon small>mdi-cloud-download</v-icon>
                  </v-btn>
                </template>
                <span>下载构建脚本</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    icon
                    color="cyan"
                    @click="handlerLog(item)"
                  >
                    <v-icon small>mdi-math-log</v-icon>
                  </v-btn>
                </template>
                <span>查看日志</span>
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
                <span>删除记录</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-skeleton-loader>
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
import BuildStatus from "@/pages/components/Build/BuildStatus";
export default {
  name: "SqlBuildHistoryList",
  components: { BuildStatus, MaterialCard },
  data: () => {
    return {
      id: "",
      queryParams: {},
      loadTimer: null,
      initLoading: false,
      loading: false,
      options: {
        page: 1,
        itemsPerPage: 5,
        sortBy: [],
        sortDesc: [],
        groupBy: [],
        groupDesc: [],
        multiSort: true,
        mustSort: true,
      },
      headers: [
        {
          text: "任务名称",
          align: "start",
          value: "jobId",
        },
        {
          text: "状态",
          align: "start",
          value: "buildStatus",
        },
        { text: "构建时间", value: "createTime" },
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
    };
  },
  mounted() {
    this.id = this.$route.params.id || "";
  },
  watch: {
    id() {
      if (this.id.length !== 0) {
        this.initLoading = true;
        this.loadData().finally(() => {
          this.initLoading = false;
        });
        if (!this.loadTimer) {
          this.startLoadTimer();
        }
      }
    },
    options: {
      deep: true,
      handler() {
        this.loadData();
      },
    },
  },
  destroyed() {
    this.stopLoadTimer();
  },
  beforeDestroy() {
    this.stopLoadTimer();
  },
  methods: {
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
          .history(this.id, {
            current: this.options.page,
            size: this.options.itemsPerPage,
            ...this.queryParams,
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
    handlerDelete(item) {
      api.sqlBuild
        .deleteHistory(item.id)
        .then(() => {
          this.loadData();
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
    handlerLog(item) {
      this.$router.push({
        name: "SqlBuildLogsView",
        params: {
          buildId: this.id,
          jobId: item.jobId,
        },
      });
      console.log(item);
    },
    handlerDownload(item) {
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
    back() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped></style>
