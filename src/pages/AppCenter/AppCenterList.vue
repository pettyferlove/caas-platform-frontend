<template>
  <div>
    <v-card color="basil">
      <v-tabs v-model="selectTab" background-color="transparent" grow>
        <v-tab>已部署应用</v-tab>
        <v-tab>应用市场</v-tab>
      </v-tabs>

      <v-tabs-items v-model="selectTab">
        <v-tab-item>
          <v-card flat>
            <v-data-iterator
              :loading="releasesLoading"
              :items="releases"
              locale="zh_CN"
            >
              <template v-slot:no-data>
                <v-row
                  style="padding: 10px 36px 10px 36px"
                  class="mt-2"
                  align="center"
                  justify="center"
                >
                  <v-btn @click="selectTab = 1" class="ma-2" color="success">
                    无数据，选择应用进行部署？
                  </v-btn>
                </v-row>
              </template>
              <template v-slot:loading>
                <div style="text-align: center; margin: 40px 0">
                  <v-progress-circular
                    :size="70"
                    :width="7"
                    color="green"
                    indeterminate
                  ></v-progress-circular>
                </div>
              </template>
              <template v-slot:default="props">
                <v-row style="padding-left: 20px; padding-right: 20px">
                  <v-col
                    v-for="(item, index) in props.items"
                    :key="`release-` + index"
                    cols="4"
                    md="3"
                  >
                    <v-card elevation="4" shaped outlined>
                      <v-list-item three-line>
                        <v-list-item-content>
                          <v-list-item-title class="headline mb-1">
                            {{ item.releaseName }}
                          </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-avatar tile size="80">
                          <v-img :src="item.icon"></v-img>
                        </v-list-item-avatar>
                      </v-list-item>

                      <v-card-text>
                        <div style="height: 60px; overflow: hidden">
                          {{ item.chartMetadata.description }}
                        </div>
                      </v-card-text>
                      <v-card-actions>
                        <v-divider></v-divider>
                        <v-btn rounded color="primary" @click="detail(item)">
                          查看
                        </v-btn>
                        <v-btn
                          :loading="item.deleting"
                          rounded
                          color="red"
                          @click="deleteRelease(item)"
                        >
                          删除
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </template>
            </v-data-iterator>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card color="basil" flat>
            <v-data-iterator
              :loading="loading"
              :items="data"
              :options="options"
              locale="zh_CN"
              hide-default-footer
            >
              <template v-slot:header>
                <v-row
                  style="padding-left: 20px; padding-right: 20px"
                  class="text-start pt-2"
                >
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="queryParams.name"
                      dense
                      outlined
                      prepend-inner-icon="mdi-magnify"
                      label="搜索"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-btn
                      :loading="loading"
                      rounded
                      color="primary"
                      @click="search"
                    >
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </template>

              <template v-slot:no-data>
                <v-row
                  style="padding: 10px 36px 10px 36px"
                  class="mt-2"
                  align="center"
                  justify="center"
                >
                  无数据
                </v-row>
              </template>
              <template v-slot:default="props">
                <v-row style="padding-left: 20px; padding-right: 20px">
                  <v-col
                    v-for="(item, index) in props.items"
                    :key="`app-` + index"
                    cols="4"
                    md="3"
                  >
                    <v-card elevation="4" shaped outlined>
                      <v-list-item three-line>
                        <v-list-item-content>
                          <div class="overline mb-4">{{ item.type }}</div>
                          <v-list-item-title class="headline mb-1">
                            {{ item.attributes.name }}
                          </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-avatar tile size="80">
                          <v-img
                            :src="url + '/api/assetsvc' + item.attributes.icon"
                          ></v-img>
                        </v-list-item-avatar>
                      </v-list-item>

                      <v-card-text>
                        <div class="my-4 subtitle-1">
                          <v-chip class="ma-2" color="primary">
                            {{
                              item.relationships.latestChartVersion.data
                                .app_version
                            }}
                          </v-chip>
                        </div>

                        <div style="height: 60px; overflow: hidden">
                          {{ item.attributes.description }}
                        </div>
                      </v-card-text>
                      <v-card-title>{{
                        item.attributes.repo.name
                      }}</v-card-title>
                      <v-card-actions>
                        <v-divider></v-divider>
                        <v-btn outlined rounded text @click="deploy(item)">
                          查看详情
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </template>

              <template v-slot:loading>
                <div style="text-align: center; margin: 40px 0">
                  <v-progress-circular
                    :size="70"
                    :width="7"
                    color="green"
                    indeterminate
                  ></v-progress-circular>
                </div>
              </template>
              <template v-slot:footer>
                <v-row
                  style="padding: 10px 36px 10px 36px"
                  class="mt-2"
                  align="center"
                  justify="center"
                >
                  <span class="grey--text">每页数量</span>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        dark
                        text
                        color="primary"
                        class="ml-2"
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ options.itemsPerPage }}
                        <v-icon>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(number, index) in itemsPerPageArray"
                        :key="index"
                        @click="updateItemsPerPage(number)"
                      >
                        <v-list-item-title>{{ number }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>

                  <v-spacer></v-spacer>

                  <span class="mr-4 grey--text">
                    Page {{ options.page }} of {{ totalPage }}
                  </span>
                  <v-btn
                    fab
                    dark
                    color="primary"
                    class="mr-1"
                    @click="formerPage"
                  >
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <v-btn
                    fab
                    dark
                    color="primary"
                    class="ml-1"
                    @click="nextPage"
                  >
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </v-row>
              </template>
            </v-data-iterator>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import api from "@/api";
import { mapGetters } from "vuex";
export default {
  name: "AppCenterList",
  data: () => {
    return {
      total: 0,
      queryParams: {},
      itemsPerPageArray: [8, 16, 32],
      totalPage: 1,
      loading: false,
      releasesLoading: false,
      options: {
        page: 1,
        itemsPerPage: 8,
        sortBy: [],
        sortDesc: [],
        groupBy: [],
        groupDesc: [],
        multiSort: true,
        mustSort: true,
      },
      data: [],
      releases: [],
      url: "",
      selectTab: "",
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
    currentNamespace() {
      this.loadReleases();
    },
  },
  mounted() {
    this.loadConfig();
    this.loadReleases();
    this.loadData();
  },
  methods: {
    loadConfig() {
      api.appCenter.config().then((res) => {
        this.url = res.data;
      });
    },
    loadReleases() {
      if (this.currentNamespace.id) {
        this.releasesLoading = true;
        api.appCenter
          .releases(this.currentNamespace.name)
          .then((res) => {
            this.releases = res.data;
          })
          .finally(() => {
            this.releasesLoading = false;
          });
      }
    },
    search() {
      this.options.page = 1;
      this.loadData();
    },
    loadData() {
      this.loading = true;
      api.appCenter
        .page({
          ...this.queryParams,
          page: this.options.page,
          size: this.options.itemsPerPage,
        })
        .then((res) => {
          this.data = res.data.record;
          this.totalPage = res.data.meta.totalPages || 1;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    deleteRelease(item) {
      this.$set(item, "deleting", true);
      api.appCenter.delete(item.namespace, item.releaseName).then(() => {
        this.$notify({
          group: "default",
          type: "success",
          title: "删除成功",
        });
        this.loadReleases();
      });
    },
    detail(item) {
      this.$router.push({
        name: "ReleaseDetail",
        params: {
          namespace: this.currentNamespace.name,
          releaseName: item.releaseName,
        },
      });
    },
    deploy(item) {
      this.$router.push({
        name: "AppCenterDetail",
        params: {
          repo: item.attributes.repo.name,
          chartName: item.attributes.name,
        },
      });
    },
    nextPage() {
      if (this.options.page + 1 <= this.totalPage) this.options.page += 1;
    },
    formerPage() {
      if (this.options.page - 1 >= 1) this.options.page -= 1;
    },
    updateItemsPerPage(number) {
      this.options.itemsPerPage = number;
    },
  },
};
</script>

<style scoped></style>
