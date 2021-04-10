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
              <h3 class="transition-swing text-h5">基础信息</h3>
            </v-sheet>
            <v-row class="px-4 pt-4 pb-3" no-gutters>
              <v-col>
                名字：{{ detail.metadata ? detail.metadata.name : "" }}
              </v-col>
              <v-col>
                创建时间：{{
                  detail.metadata ? detail.metadata.creationTimestamp : ""
                }}
              </v-col>
            </v-row>
            <v-row class="px-4 pt-4 pb-3" no-gutters>
              <v-col>
                状态：{{ detail.status ? detail.status.phase : "" }}
              </v-col>
            </v-row>
            <v-divider></v-divider>

            <v-sheet class="px-4 pt-4 pb-3" tile style="cursor: pointer">
              <h3 class="transition-swing text-h5">资源配额</h3>
            </v-sheet>
            <v-row class="px-4 pt-4 pb-3" no-gutters>
              <v-col></v-col>
              <v-col> </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-sheet class="px-4 pt-4 pb-3" tile style="cursor: pointer">
              <h3 class="transition-swing text-h5">资源限制</h3>
            </v-sheet>
            <v-row class="px-4 pt-4 pb-3" no-gutters>
              <v-col></v-col>
              <v-col> </v-col>
            </v-row>
          </div>
        </v-skeleton-loader>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" class="mr-4" @click="back"> 返回 </v-btn>
        </v-card-actions>
      </material-card>
    </v-col>
  </v-row>
</template>

<script>
import MaterialCard from "@components/card/MaterialCard";
import api from "@/api";
import dayjs from "dayjs";
export default {
  name: "NamespaceDetailsView",
  components: { MaterialCard },
  data: () => {
    return {
      initLoading: false,
      id: "",
      data: {
        metadata: {
          labels: {},
        },
        spec: {},
        status: {},
      },
    };
  },
  watch: {
    id() {
      let that = this;
      if (that.id && that.id.length !== 0) {
        that.loadDetail().then(() => {
          that.initLoading = false;
        });
      }
    },
  },
  computed: {
    detail() {
      let data = this.data;
      data.metadata.creationTimestamp = dayjs(
        data.metadata.creationTimestamp
      ).format("YYYY-MM-DD HH:mm:ss");
      return data;
    },
  },
  mounted() {
    this.initLoading = true;
    this.id = this.$route.params.id || "";
  },
  methods: {
    loadDetail() {
      return new Promise((resolve, reject) => {
        api.namespace
          .get(this.id)
          .then((res) => {
            this.data = res.data;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    back() {
      this.$router.push({
        name: "NamespaceList",
      });
    },
  },
};
</script>

<style scoped></style>
