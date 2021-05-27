<template>
  <v-row>
    <v-col>
      <material-card icon="mdi-nas" color="success" class="px-5 py-3">
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
              :loading="loading"
              :options.sync="options"
              :server-items-length="total"
              :footer-props="{
                itemsPerPageOptions: [5, 10, 15],
              }"
            >
              <template v-slot:item.istio="{ item }">
                <v-chip color="primary" outlined v-if="item.istio" class="ma-2">
                  已开启
                </v-chip>
                <v-chip color="orange" outlined v-if="!item.istio" class="ma-2">
                  已关闭
                </v-chip>
              </template>
            </v-data-table>
          </div>
        </v-skeleton-loader>
      </material-card>
    </v-col>
  </v-row>
</template>

<script>
import MaterialCard from "@components/card/MaterialCard";
import api from "@/api";
export default {
  name: "StorageClassList",
  components: { MaterialCard },
  data: () => {
    return {
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
          text: "名称",
          sortable: false,
          align: "start",
          value: "name",
        },
        {
          text: "提供者",
          sortable: false,
          align: "center",
          value: "provisioner",
        },
        {
          text: "回收策略",
          sortable: false,
          align: "center",
          value: "reclaimPolicy",
        },
        {
          text: "创建时间",
          sortable: false,
          align: "end",
          value: "creationTimestamp",
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
    handlerSearch() {
      this.loading = true;
      this.loadData().finally(() => {
        this.loading = false;
      });
    },
    stopLoadTimer() {
      clearInterval(this.loadTimer);
      this.loadTimer = null;
    },
    startLoadTimer() {
      let that = this;
      that.loadTimer = setInterval(that.loadData, 5000);
      that.$once("hook:beforeDestroy", () => {
        that.stopLoadTimer();
      });
    },
    loadData() {
      return new Promise((resolve, reject) => {
        api.storageClass
          .page({
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
        this.$store.dispatch("LoadNamespaces");
      });
    },
  },
};
</script>

<style scoped></style>
