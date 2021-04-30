<template>
  <v-row>
    <v-col>
      <material-card
        icon="mdi-file-cog"
        color="warning"
        class="px-5 py-3"
        title="配置管理"
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
                  v-model="queryParams.configName"
                  label="请输入配置名称"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-select
                  dense
                  v-model="queryParams.envType"
                  :items="environmentTypes"
                  item-text="name"
                  item-value="value"
                  label="请选择环境类型"
                  outlined
                ></v-select>
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
              <template v-slot:item.configType="{ item }">
                <span>
                  <v-chip class="ma-2" color="cyan" text-color="white">
                    <v-icon left> mdi-hammer-wrench </v-icon>
                    {{
                      item.configType.charAt(0).toUpperCase() +
                      item.configType.slice(1)
                    }}
                  </v-chip>
                </span>
              </template>
              <template v-slot:item.envType="{ item }">
                <v-chip
                  color="primary"
                  outlined
                  v-if="item.envType === 1"
                  class="ma-2"
                >
                  开发环境
                </v-chip>
                <v-chip
                  color="green"
                  outlined
                  v-if="item.envType === 2"
                  class="ma-2"
                >
                  测试环境
                </v-chip>
                <v-chip
                  color="orange"
                  outlined
                  v-if="item.envType === 9"
                  class="ma-2"
                >
                  生产环境
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
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
                  <span>修改配置文件</span>
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
                  <span>删除配置文件</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </div>
        </v-skeleton-loader>
      </material-card>
      <v-dialog v-model="deleteTips" persistent max-width="400">
        <v-card>
          <v-card-title class="headline"> 是否删除配置文件？ </v-card-title>
          <v-card-text
            >该操作无法撤销，且可能导致相关的应用无法正常运行，请确认是否继续</v-card-text
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
import MaterialCard from "@components/card/MaterialCard";
import { mapGetters } from "vuex";
import api from "@/api";
export default {
  name: "ConfigMapList",
  components: { MaterialCard },
  data: () => {
    return {
      deleteTips: false,
      selectId: "",
      queryParams: {},
      initLoading: false,
      loading: false,
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
          text: "配置名称",
          align: "start",
          value: "configName",
        },
        {
          text: "配置文件",
          align: "start",
          value: "fileName",
        },
        {
          text: "配置文件类型",
          align: "start",
          value: "configType",
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
      environmentTypes: [
        {
          name: "开发环境",
          value: 1,
        },
        {
          name: "测试环境",
          value: 2,
        },
        {
          name: "生产环境",
          value: 9,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      currentNamespace: "GetCurrentNamespace",
    }),
  },
  watch: {
    options: {
      deep: true,
      handler() {
        this.loadData();
      },
    },
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
    handlerAdd() {
      this.$router.push({
        name: "ConfigDetailsAdd",
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
        api.config
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
        name: "ConfigDetailsEdit",
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
      api.config
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
