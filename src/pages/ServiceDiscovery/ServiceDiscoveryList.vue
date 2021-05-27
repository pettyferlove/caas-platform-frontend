<template>
  <v-row>
    <v-col>
      <material-card
        icon="mdi-history"
        color="warning"
        class="px-5 py-3"
        title="服务发现"
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
            <!--            <div class="text-start pt-2" style="margin-bottom: 10px">
              <v-btn rounded color="primary" @click="handlerAdd"
                ><v-icon dark>mdi-plus</v-icon></v-btn
              >
            </div>-->
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
              <template v-slot:item.network="{ item }">
                <v-chip
                  color="primary"
                  outlined
                  v-if="item.network === `none`"
                  class="ma-2"
                >
                  无
                </v-chip>
                <v-chip
                  color="primary"
                  outlined
                  v-else-if="item.network === `internal`"
                  class="ma-2"
                >
                  内部服务
                </v-chip>
                <v-chip
                  color="primary"
                  outlined
                  v-else-if="item.network === `external`"
                  class="ma-2"
                >
                  外部服务
                </v-chip>
              </template>
              <template v-slot:item.matchLabel="{ item }">
                <template v-if="item.matchLabel">
                  <div
                    v-for="(i, index) in Object.keys(
                      JSON.parse(item.matchLabel)
                    )"
                    v-bind:key="`label-` + index"
                  >
                    <v-chip class="ma-1" style="display: inline-block">
                      {{ i }}: {{ JSON.parse(item.matchLabel)[i] }}
                    </v-chip>
                  </div>
                </template>
              </template>
              <template v-slot:item.networkType="{ item }">
                <v-chip color="primary" outlined class="ma-2">
                  {{ item.networkType }}
                </v-chip>
              </template>
              <template v-slot:item.internalEndpoints="{ item }">
                <template v-if="item.internalEndpoints">
                  <div
                    v-for="(i, index) in item.internalEndpoints.split(',')"
                    v-bind:key="`internal-endpoints-` + index"
                  >
                    {{ i }}
                  </div>
                </template>
              </template>
              <template v-slot:item.externalEndpoints="{ item }">
                <template v-if="item.externalEndpoints">
                  <div
                    v-for="(i, index) in item.externalEndpoints.split(',')"
                    v-bind:key="`external-endpoints-` + index"
                    class="text-decoration-underline"
                    @click="openUrl(i)"
                  >
                    {{ i }}
                  </div>
                </template>
              </template>
              <!--              <template v-slot:item.actions="{ item }">
                <v-btn icon color="green" @click="handlerView(item)">
                  <v-icon small>mdi-eye</v-icon>
                </v-btn>
                <v-btn icon color="cyan" @click="handlerModify(item)">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon color="pink" @click="handlerDelete(item)">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </template>-->
            </v-data-table>
          </div>
        </v-skeleton-loader>
      </material-card>
    </v-col>
  </v-row>
</template>

<script>
import EnvironmentType from "@components/base/EnvironmentType";
import MaterialCard from "@components/card/MaterialCard";
import { mapGetters } from "vuex";
import api from "@/api";

export default {
  name: "ServiceDiscoveryList",
  components: { EnvironmentType, MaterialCard },
  data: () => {
    return {
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
          text: "服务发现名称",
          align: "start",
          value: "name",
        },
        {
          text: "环境",
          align: "center",
          sortable: false,
          value: "envType",
          width: 60,
        },
        {
          text: "匹配标签",
          sortable: false,
          align: "center",
          value: "matchLabel",
        },
        { text: "网络类型", value: "networkType", align: "center", width: 60 },
        {
          text: "集群IP",
          sortable: false,
          value: "clusterIp",
          align: "center",
        },
        {
          text: "内部端点",
          sortable: false,
          value: "internalEndpoints",
          align: "center",
          width: 300,
        },
        {
          text: "外部端点",
          sortable: false,
          value: "externalEndpoints",
          align: "center",
          width: 150,
        },
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
          api.serviceDiscovery
            .page(this.currentNamespace.id, {
              descs: this.sortDesc(this.options),
              ascs: this.sortAsc(this.options),
              currentPage: this.options.page,
              pageSize: this.options.itemsPerPage,
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
    handlerView(item) {
      this.$router.push({
        name: "ApplicationDetailsView",
        params: {
          namespaceId: this.currentNamespace.id,
          id: item.id,
        },
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
        name: "ApplicationDetailsAdd",
      });
    },
    handlerModify(item) {
      this.$router.push({
        name: "ApplicationDetailsEdit",
        params: {
          id: item.id,
        },
      });
    },
    handlerDelete(item) {
      api.applicationDeployment
        .delete(this.currentNamespace.id, item.id)
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
    },
    openUrl(url) {
      // eslint-disable-next-line no-undef
      window.open("http://" + url);
    },
  },
};
</script>

<style scoped></style>
