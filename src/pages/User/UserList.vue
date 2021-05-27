<template>
  <v-row>
    <v-col>
      <material-card
        icon="mdi-account-group"
        color="cyan"
        class="px-5 py-3"
        title="用户管理"
      >
        <v-skeleton-loader
          transition="fade-transition"
          height="500"
          type="table"
          :loading="initLoading"
          ><div>
            <v-row class="text-start pt-2">
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  dense
                  v-model="queryParams.userName"
                  label="请输入用户姓名"
                  outlined
                ></v-text-field>
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
              <template v-slot:item.userName="{ item }">
                <v-avatar size="36" style="margin-right: 4px">
                  <img
                    :src="item.userAvatar || require('./@assets/avatar/1.jpg')"
                    :alt="item.userName"
                  />
                </v-avatar>
                {{ item.userName }}
              </template>

              <template v-slot:item.roles="{ item }">
                <template v-if="item.roles">
                  <v-chip
                    color="primary"
                    outlined
                    v-for="(item, index) in item.roles.split(`,`)"
                    v-bind:key="`role-` + index"
                    class="ma-2"
                  >
                    {{ item }}
                  </v-chip>
                </template>
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
                  <span>更新用户</span>
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
                  <span>删除用户</span>
                </v-tooltip>
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
  name: "UserList",
  components: { MaterialCard },
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
          text: "用户名",
          align: "start",
          value: "userName",
        },
        {
          text: "登录名",
          align: "start",
          value: "loginName",
        },
        {
          text: "角色",
          align: "center",
          value: "roles",
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
  mounted() {
    this.initLoading = true;
    this.loadData().finally(() => {
      this.initLoading = false;
    });
  },
  watch: {
    options: {
      deep: true,
      handler() {
        this.loadData();
      },
    },
  },
  methods: {
    handlerAdd() {
      this.$router.push({
        name: "UserAdd",
      });
    },
    handlerSearch() {
      this.loading = true;
      this.loadData().finally(() => {
        this.loading = false;
      });
    },
    loadData() {
      return new Promise((resolve, reject) => {
        api.user
          .page({
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
      });
    },
    handlerModify(item) {
      this.$router.push({
        name: "UserEdit",
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
