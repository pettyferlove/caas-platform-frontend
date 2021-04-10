<template>
  <v-row>
    <v-col>
      <material-card
        icon="mdi-atom-variant"
        color="success"
        class="px-5 py-3"
        title="应用实例"
      >
        <v-skeleton-loader
          transition="fade-transition"
          height="500"
          type="table"
          :loading="initLoading"
        >
          <div>
            <v-data-table
              locale="zh_CN"
              :headers="headers"
              :items="datasets"
              :options.sync="options"
              :server-items-length="total"
              :footer-props="{
                itemsPerPageOptions: [5, 10, 15],
              }"
            >
              <template v-slot:item.startTime="{ item }">
                {{ formatDate(item.startTime) }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn icon color="green" @click="handlerLog(item)">
                  <v-icon small>mdi-form-select</v-icon>
                </v-btn>
                <v-btn icon color="cyan" @click="handlerShell(item)">
                  <v-icon small>mdi-powershell</v-icon>
                </v-btn>
                <v-btn icon color="pink" @click="handlerDelete(item)">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </div>
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
import dayjs from "dayjs";

export default {
  name: "ApplicationPodList",
  components: { MaterialCard },
  data: () => {
    return {
      initLoading: false,
      total: 0,
      loadTimer: null,
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
          text: "名称",
          align: "start",
          width: 300,
          value: "name",
        },
        { text: "节点名称", value: "nodeName" },
        { text: "IP", value: "ip" },
        { text: "运行状态", value: "statusPhase" },
        { text: "重启次数", value: "restartCount" },
        { text: "启动时间", align: "center", value: "startTime" },
        {
          text: "操作",
          value: "actions",
          sortable: false,
          align: "end",
          width: 200,
        },
      ],
      datasets: [],
    };
  },
  props: {
    deploymentId: {
      type: String,
    },
    namespaceId: {
      type: String,
    },
  },
  watch: {
    options: {
      deep: true,
      handler() {
        this.loadData();
      },
    },
    deploymentId() {
      if (this.deploymentId !== undefined) {
        this.loadData();
      }
    },
    currentNamespace() {
      this.loadData();
    },
  },
  mounted() {
    this.initLoading = true;
    this.loadData();
    if (!this.loadTimer) {
      this.startLoadTimer();
    }
    this.initLoading = false;
  },
  destroyed() {
    this.stopLoadTimer();
  },
  beforeDestroy() {
    this.stopLoadTimer();
  },
  methods: {
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
      if (this.deploymentId !== undefined) {
        api.pod
          .page({
            namespaceId: this.namespaceId,
            deploymentId: this.deploymentId,
            currentPage: this.options.page,
            pageSize: this.options.itemsPerPage,
          })
          .then((res) => {
            this.datasets = res.data.records;
            this.total = res.data.total;
          });
      }
    },
    formatDate(date) {
      return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
    },
    handlerLog(item) {
      this.$router.push({
        name: "ApplicationPodLogsView",
        params: {
          namespaceId: this.namespaceId,
          name: item.name,
        },
      });
    },
    handlerShell(item) {
      this.$router.push({
        name: "ApplicationPodShellView",
        params: {
          namespaceId: this.namespaceId,
          name: item.name,
        },
      });
    },
    handlerDelete() {
      if (this.deploymentId !== undefined) {
        api.pod
          .delete(this.namespaceId, this.deploymentId)
          .then(() => {
            this.$notify({
              group: "default",
              type: "success",
              title: "删除成功",
            });
            this.loadData();
          })
          .catch(() => {
            this.$notify({
              group: "default",
              type: "error",
              title: "删除失败",
            });
          });
      }
    },
    back() {
      this.$router.push({
        name: "ApplicationList",
      });
    },
  },
};
</script>

<style scoped></style>
