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
            <v-row class="text-start pt-2">
              <v-col cols="12" sm="6" md="2">
                <v-text-field
                  dense
                  v-model="queryParams.name"
                  label="请输入名称"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <EnvironmentType
                  label="请选择环境类型"
                  hide-icon
                  outlined
                  dense
                  v-model="queryParams.envType"
                ></EnvironmentType>
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-select
                  class="v-data-table-query-params"
                  :items="keywords"
                  v-model="queryParams.keywords"
                  label="关键词"
                  item-text="name"
                  item-value="id"
                  outlined
                  chips
                  dense
                  multiple
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-btn @click="handlerSearch" rounded color="primary"
                  ><v-icon dark>mdi-magnify</v-icon></v-btn
                >
                <v-btn @click="handlerRestart" rounded color="grey"
                  ><v-icon dark>mdi-restart</v-icon></v-btn
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
              <template v-slot:item.runStatus="{ item }">
                <RunStatus :state="item.runStatus"></RunStatus>
              </template>
              <template v-slot:item.envType="{ item }">
                <EnvironmentType
                  :value="item.envType"
                  type="label"
                ></EnvironmentType>
              </template>
              <template v-slot:item.keywords="{ item }">
                <template v-if="item.keywords">
                  <v-chip
                    label
                    outlined
                    v-for="(i, index) in JSON.parse(item.keywords)"
                    v-bind:key="`keyword-` + index"
                    style="margin: 2px"
                    :color="i.color"
                  >
                    <v-icon left> mdi-label </v-icon> {{ i.name }}
                  </v-chip>
                </template>
              </template>

              <template v-slot:item.imagesName="{ item }">
                {{ item.imageName + ":" + item.imageTag }}
              </template>
              <template v-slot:item.groupStatus="{ item }">
                <span>{{ item.replicas + "/" + item.readyReplicas }}</span>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-menu
                  transition="slide-y-transition"
                  rounded="lg"
                  bottom
                  left
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="grey" icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item
                          @click="handlerView(item)"
                          v-bind="attrs"
                          v-on="on"
                          link
                        >
                          <v-list-item-action style="margin-right: 2px">
                            <v-icon>mdi-eye</v-icon>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title>查看详情</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <span>查看运行详情</span>
                    </v-tooltip>

                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item
                          @click="handlerStart(item)"
                          v-bind="attrs"
                          v-on="on"
                          link
                        >
                          <v-list-item-action style="margin-right: 2px">
                            <v-icon>mdi-arrow-right-drop-circle-outline</v-icon>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title>启动应用</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <span>启动应用</span>
                    </v-tooltip>

                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item
                          @click="handlerShutdown(item)"
                          v-bind="attrs"
                          v-on="on"
                          link
                        >
                          <v-list-item-action style="margin-right: 2px">
                            <v-icon>mdi-power</v-icon>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title>关闭应用</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <span>关闭应用</span>
                    </v-tooltip>

                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item
                          @click="handlerScale(item)"
                          v-bind="attrs"
                          v-on="on"
                          link
                        >
                          <v-list-item-action style="margin-right: 2px">
                            <v-icon>mdi-scale</v-icon>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title>应用缩放</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <span>应用缩放</span>
                    </v-tooltip>

                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item
                          @click="handlerModify(item)"
                          v-bind="attrs"
                          v-on="on"
                          link
                        >
                          <v-list-item-action style="margin-right: 2px">
                            <v-icon>mdi-pencil</v-icon>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title>编辑应用</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <span>编辑应用</span>
                    </v-tooltip>

                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item
                          @click="handlerDelete(item)"
                          v-bind="attrs"
                          v-on="on"
                          link
                        >
                          <v-list-item-action style="margin-right: 2px">
                            <v-icon>mdi-delete</v-icon>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title>删除应用</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <span>删除应用</span>
                    </v-tooltip>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </div>
        </v-skeleton-loader>
      </material-card>

      <v-dialog v-model="scaleDialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">缩放资源</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form ref="form">
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      label="当前实例数"
                      disabled
                      :value="selectItem.instancesNumber"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      label="目标实例数"
                      v-model="instancesNumber"
                      required
                      :rules="[(v) => validNumber(v) || '请填写目标实例数']"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
              <v-alert style="padding: 10px 5px" dense type="info" outlined>
                应用将更新为目标实例数。
              </v-alert>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="scaleDialog = false">
              关闭
            </v-btn>
            <v-btn color="green darken-1" @click="scaleConfirm(selectId)">
              缩放
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="deleteTips" persistent max-width="400">
        <v-card>
          <v-card-title class="headline"> 是否删除应用？ </v-card-title>
          <v-card-text
            >该操作将会删除应用以及关联的服务发现（网络）设置，该操作不可撤销</v-card-text
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
import RunStatus from "@/pages/components/Application/RunStatus";

export default {
  name: "Application",
  components: { RunStatus, EnvironmentType, MaterialCard },
  data: () => {
    return {
      deleteTips: false,
      scaleDialog: false,
      selectId: "",
      instancesNumber: 0,
      selectItem: {},
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
          value: "name",
        },
        {
          text: "运行状态",
          sortable: false,
          align: "center",
          value: "runStatus",
        },
        {
          text: "环境",
          align: "center",
          sortable: false,
          value: "envType",
        },
        {
          text: "关键词",
          align: "center",
          sortable: false,
          value: "keywords",
        },
        {
          text: "容器组状态",
          sortable: false,
          align: "center",
          value: "groupStatus",
        },
        { text: "创建时间", align: "center", value: "createTime" },
        { text: "更新时间", align: "center", value: "modifyTime" },
        {
          text: "操作",
          value: "actions",
          sortable: false,
          align: "end",
          width: 60,
        },
      ],
      datasets: [],
      keywords: [],
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
      this.loadAllSelectedKeyword();
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
    loadAllSelectedKeyword() {
      return new Promise((resolve, reject) => {
        api.keyword
          .allSelected()
          .then((res) => {
            this.keywords = res.data;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    handlerShutdown(item) {
      api.applicationDeployment
        .shutdown(this.currentNamespace.id, item.id)
        .then(() => {
          this.$notify({
            group: "default",
            type: "success",
            title: "关闭成功",
          });
          this.loadData();
        })
        .catch(() => {
          this.$notify({
            group: "default",
            type: "error",
            title: "关闭失败",
          });
        });
    },
    handlerStart(item) {
      api.applicationDeployment
        .start(this.currentNamespace.id, item.id)
        .then(() => {
          this.$notify({
            group: "default",
            type: "success",
            title: "启动成功",
          });
          this.loadData();
        })
        .catch(() => {
          this.$notify({
            group: "default",
            type: "error",
            title: "启动失败",
          });
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
    handlerRestart() {
      this.queryParams = {};
      this.handlerSearch();
    },
    handlerAdd() {
      this.$router.push({
        name: "ApplicationDetailsAdd",
      });
    },
    handlerScale(item) {
      this.selectId = item.id;
      this.scaleDialog = true;
      this.selectItem = item;
      this.instancesNumber = item.instancesNumber;
    },
    scaleConfirm(selectId) {
      if (this.$refs.form.validate()) {
        api.applicationDeployment
          .scale(this.currentNamespace.id, selectId, {
            number: this.instancesNumber,
          })
          .then(() => {
            this.loadData();
            this.scaleDialog = false;
            this.$notify({
              group: "default",
              type: "success",
              title: "缩放成功",
            });
          })
          .catch(() => {
            this.$notify({
              group: "default",
              type: "error",
              title: "缩放失败",
            });
          });
      }
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
      this.selectId = item.id;
      this.deleteTips = true;
    },
    deleteConfirm(selectId) {
      api.applicationDeployment
        .delete(this.currentNamespace.id, selectId)
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
    validNumber(val) {
      if (!val || !/^[0-9_\\-]+$/g.test(val)) {
        return "请输入正确的数量";
      }
      return true;
    },
  },
};
</script>

<style scoped></style>
