<template>
  <v-row>
    <v-col>
      <material-card
        icon="mdi-clipboard-text"
        color="warning"
        class="px-5 py-3"
        title="详细信息"
      >
        <v-skeleton-loader
          transition="fade-transition"
          height="500"
          type="table"
          :loading="initLoading"
        >
          <div style="margin-top: 15px">
            <v-sheet class="px-4 pt-4 pb-3" tile style="cursor: pointer">
              <h3 class="transition-swing text-h5">基本信息</h3>
            </v-sheet>
            <v-row class="px-4 pt-4 pb-3" no-gutters>
              <v-col> 名字：{{ detail.name ? detail.name : "" }} </v-col>
              <v-col>
                创建时间：{{ detail.createTime ? detail.createTime : "" }}
              </v-col>
            </v-row>
            <v-row class="px-4 pt-4 pb-3" no-gutters>
              <v-col>
                标签：
                <template v-if="detail.labels">
                  <template v-for="key in Object.keys(detail.labels)">
                    <v-chip v-bind:key="`label-` + key" class="ma-2">
                      <v-icon left> mdi-label </v-icon> {{ key }} :
                      {{ detail.labels[key] }}
                    </v-chip>
                  </template>
                </template>
              </v-col>
            </v-row>
            <v-divider></v-divider>

            <v-sheet class="px-4 pt-4 pb-3" tile style="cursor: pointer">
              <h3 class="transition-swing text-h5">镜像信息</h3>
            </v-sheet>
            <v-row class="px-4 pt-4 pb-3" no-gutters>
              <v-col>
                镜像名称：{{ detail.imageName ? detail.imageName : "" }}
              </v-col>
              <v-col>
                标签：{{ detail.imageTag ? detail.imageTag : "" }}
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-sheet class="px-4 pt-4 pb-3" tile style="cursor: pointer">
              <h3 class="transition-swing text-h5">资源信息</h3>
            </v-sheet>
            <v-row class="px-4 pt-4 pb-3" no-gutters>
              <v-col>
                可用实例：{{
                  detail.availableReplicas ? detail.availableReplicas : ""
                }}
              </v-col>
              <v-col>
                实例总数：{{ detail.replicas ? detail.replicas : "" }}
              </v-col>
              <v-col>
                更新数量：{{
                  detail.updatedReplicas ? detail.updatedReplicas : ""
                }}
              </v-col>
            </v-row>
          </div>
        </v-skeleton-loader>
      </material-card>

      <application-pod-list
        :namespace-id="namespaceId"
        :deployment-id="detail.id"
      />
    </v-col>
  </v-row>
</template>

<script>
import MaterialCard from "@components/card/MaterialCard";
import ApplicationPodList from "@/pages/Application/components/ApplicationPodList";
import api from "@/api";

export default {
  name: "ApplicationDetailsView",
  components: { ApplicationPodList, MaterialCard },
  data() {
    return {
      id: "",
      initLoading: false,
      application: "",
      namespaceId: "",
      data: {},
    };
  },
  mounted() {
    this.initLoading = true;
    this.id = this.$route.params.id || "";
    this.namespaceId = this.$route.params.namespaceId || "";
    this.initLoading = false;
  },
  computed: {
    detail() {
      return this.data;
    },
  },
  watch: {
    id() {
      if (this.id.length !== 0) {
        this.loadDetail();
      }
    },
  },
  methods: {
    loadDetail() {
      api.applicationDeployment.get(this.namespaceId, this.id).then((res) => {
        this.data = res.data;
        this.id = res.data.id;
      });
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
