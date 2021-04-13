<template>
  <v-row>
    <v-col>
      <material-card
        icon="mdi-history"
        color="warning"
        class="px-5 py-3"
        title="应用管理"
      >
        <v-skeleton-loader
          transition="fade-transition"
          height="500"
          type="table"
          :loading="initLoading"
        >
          <div>
            <div class="text-end pt-2" style="margin-bottom: 10px">
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
              <template v-slot:item.imagesName="{ item }">
                {{ item.imageName + ":" + item.imageTag }}
              </template>
              <template v-slot:item.groupStatus="{ item }">
                <span>{{ item.replicas + "/" + item.readyReplicas }}</span>
              </template>
              <template v-slot:item.creationTimestamp="{ item }">
                {{ formatDate(item.creationTimestamp) }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn icon color="green" @click="handlerView(item)">
                  <v-icon small>mdi-eye</v-icon>
                </v-btn>
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
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import MaterialCard from "@components/card/MaterialCard";
import api from "@/api";
import dayjs from "dayjs";
import EnvironmentType from "@components/base/EnvironmentType";

export default {
  name: "Application",
  components: { EnvironmentType, MaterialCard },
  data: () => {
    return {
      initLoading: false,
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
          width: 250,
          value: "name",
        },
        {
          text: "环境",
          align: "center",
          value: "envType",
        },
        { text: "容器组状态", align: "center", value: "groupStatus" },
        { text: "镜像名称", value: "imagesName" },
        { text: "创建时间", align: "center", value: "creationTimestamp" },
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
          api.applicationDeployment
            .page(this.currentNamespace.id, {
              currentPage: this.options.page,
              pageSize: this.options.itemsPerPage,
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
    formatDate(date) {
      return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
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
  },
};
</script>

<style scoped></style>
