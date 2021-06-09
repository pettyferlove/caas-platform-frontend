<template>
  <v-row>
    <v-col>
      <material-card
        icon="mdi-database"
        color="warning"
        class="px-5 py-3"
        title="持久化存储"
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
                  v-model="queryParams.name"
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
              :loading="loading"
              :options.sync="options"
              :server-items-length="total"
              :footer-props="{
                itemsPerPageOptions: [5, 10, 15],
              }"
            >
              <template v-slot:item.envType="{ item }">
                <EnvironmentType
                  :value="item.envType"
                  type="label"
                ></EnvironmentType>
              </template>
              <template v-slot:item.initSize="{ item }">
                {{ item.initSize + item.unit }}
              </template>
              <template v-slot:item.accessMode="{ item }">
                <v-chip color="primary" outlined class="ma-2">
                  {{ item.accessMode }}
                </v-chip>
              </template>
              <template v-slot:item.groupStatus="{ item }">
                <span>{{ item.replicas + "/" + item.readyReplicas }}</span>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn icon color="cyan" @click="handlerModify(item)">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon color="pink" @click="handlerDelete(item)">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </div>
        </v-skeleton-loader>
      </material-card>
      <v-dialog v-model="deleteTips" persistent max-width="400">
        <v-card>
          <v-card-title class="headline"> 是否删除持久化存储？ </v-card-title>
          <v-card-text
            >该操作无法撤销，根据存储服务提供者回收策略进行回收可能会直接销毁您的文件</v-card-text
          >
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
import { mapGetters } from "vuex";
import MaterialCard from "@components/card/MaterialCard";
import api from "@/api";
import EnvironmentType from "@components/base/EnvironmentType";

export default {
  name: "PersistentStorageList",
  components: { EnvironmentType, MaterialCard },
  data: () => {
    return {
      deleteTips: false,
      selectId: "",
      initLoading: false,
      loading: false,
      total: 0,
      queryParams: {},
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
          width: 250,
          value: "name",
        },
        {
          text: "环境",
          align: "center",
          sortable: false,
          value: "envType",
        },
        { text: "初始容量", align: "center", value: "initSize" },
        { text: "存储服务提供者", align: "center", value: "storageClassName" },
        { text: "访问模式", align: "center", value: "accessMode" },
        { text: "创建时间", align: "center", value: "createTime" },
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
  watch: {
    options: {
      deep: true,
      handler() {
        this.loadData();
      },
    },
    currentNamespace() {
      this.loadData();
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
        if (this.currentNamespace.id) {
          api.persistentStorage
            .page(this.currentNamespace.id, {
              descs: this.sortDesc(this.options),
              ascs: this.sortAsc(this.options),
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
        } else {
          resolve();
        }
      });
    },
    handlerSearch() {
      this.loading = true;
      this.loadData().finally(() => {
        this.loading = false;
      });
    },
    handlerAdd() {
      this.$router.push({
        name: "PersistentStorageAdd",
      });
    },
    handlerModify(item) {
      this.$router.push({
        name: "PersistentStorageEdit",
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
      api.persistentStorage
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
  },
};
</script>

<style scoped></style>
