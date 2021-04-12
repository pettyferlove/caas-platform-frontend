<template>
  <v-row>
    <v-col>
      <material-card
        icon="mdi-clipboard-list-outline"
        color="success"
        class="px-5 py-3"
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
              <template v-slot:item.istio="{ item }">
                <v-chip color="primary" outlined v-if="item.istio" class="ma-2">
                  已开启
                </v-chip>
                <v-chip color="orange" outlined v-if="!item.istio" class="ma-2">
                  已关闭
                </v-chip>
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
      <namespace-dialog
        @close="handlerClose"
        :dialog-visible="dialog"
        :id="selectId"
      ></namespace-dialog>
      <v-dialog v-model="deleteTips" persistent max-width="400">
        <v-card>
          <v-card-title class="headline"> 是否删除命名空间？ </v-card-title>
          <v-card-text
          >该操作将会删除命名空间下所有内容，请确认是否继续</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" @click="deleteTips = false">
              取消
            </v-btn>
            <v-btn color="error darken-1" @click="deleteConfirm(deleteId)">
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
import MaterialCard from "@components/card/MaterialCard";
import NamespaceDialog from "@/pages/Resources/Namespace/NamespaceDialog";
export default {
  name: "Namespace",
  components: { NamespaceDialog, MaterialCard },
  data: () => {
    return {
      initLoading: false,
      dialog: false,
      deleteTips: false,
      total: 0,
      loadTimer: null,
      selectId: "",
      deleteId: "",
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
          value: "name",
        },
        { text: "环境", align: "center", value: "envType" },
        { text: "开启Istio注入", value: "istio" },
        { text: "创建时间", value: "createTime" },
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
        api.namespace
          .page({
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
        this.$store.dispatch("LoadNamespaces");
      });
    },
    handlerAdd() {
      this.dialog = true;
    },
    handlerView(item) {
      /*api.namespace.get(item.name).then((res) => {
        console.log(res.data);
      });*/
      this.$router.push({
        name: "NamespaceDetailsView",
        params: {
          id: item.id,
        },
      });
    },
    handlerModify(item) {
      this.selectId = item.id;
      this.dialog = true;
    },
    handlerDelete(item) {
      this.deleteId = item.id;
      this.deleteTips = true;
    },
    deleteConfirm(id) {
      api.namespace
        .delete(id)
        .then(() => {
          this.loadData();
          this.deleteTips = false;
          this.$notify({
            group: "default",
            type: "success",
            title: "正在删除，请留意Namespace状态",
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
    handlerClose() {
      this.selectId = "";
      this.deleteId = "";
      this.dialog = false;
      this.loadData();
    },
  },
};
</script>

<style scoped></style>
