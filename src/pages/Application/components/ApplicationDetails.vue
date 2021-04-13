<template>
  <v-row>
    <v-col>
      <material-card
        :icon="
          operaType === `add`
            ? `mdi-shape-square-plus`
            : `mdi-file-document-edit-outline`
        "
        color="warning"
        class="px-5 py-3"
        title="新增"
      >
        <v-skeleton-loader
          transition="fade-transition"
          height="500"
          type="form"
          :types="types"
          :loading="initLoading"
          ><v-stepper
            non-linear
            vertical
            class="stepper-wrapper"
            v-model="step"
          >
            <v-stepper-step :complete="step > 1" step="1">
              基本设置
            </v-stepper-step>
            <v-stepper-content step="1">
              <ApplicationInfo
                ref="info"
                @reset-data="resetData"
                class="stepper-content"
                :opera-type="operaType"
                v-model="formData"
              ></ApplicationInfo>

              <v-btn color="primary" @click="nextStep(1)"> 下一步 </v-btn>
              <v-btn disabled color="primary"> 上一步 </v-btn>
              <v-btn text @click="back"> 返回 </v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="step > 2" step="2">
              进阶设置
            </v-stepper-step>
            <v-stepper-content step="2">
              <ApplicationAdvanced
                ref="advanced"
                class="stepper-content"
                :opera-type="operaType"
                v-model="formData"
              ></ApplicationAdvanced>

              <v-btn color="primary" @click="nextStep(2)"> 下一步 </v-btn>
              <v-btn color="primary" @click="step = 1"> 上一步 </v-btn>
              <v-btn text @click="back"> 返回 </v-btn>
            </v-stepper-content>

            <v-stepper-step step="3"> 网络设置 </v-stepper-step>
            <v-stepper-content step="3">
              <ApplicationNetwork
                ref="network"
                class="stepper-content"
                :opera-type="operaType"
                v-model="formData"
              ></ApplicationNetwork>

              <v-btn color="primary" @click="nextStep(3)">
                {{ operaType === "add" ? "提交" : "更新" }}
              </v-btn>
              <v-btn color="primary" @click="step = 2"> 上一步 </v-btn>
              <v-btn text @click="back"> 返回 </v-btn>
            </v-stepper-content>
          </v-stepper>
        </v-skeleton-loader>
      </material-card>
    </v-col>
    <v-speed-dial
      bottom
      right
      fixed
      open-on-hover
      transition="slide-y-reverse-transition"
    >
      <template v-slot:activator>
        <v-btn color="blue darken-2" dark fab>
          <v-icon> mdi-account-circle </v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small color="green">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn fab dark small color="indigo">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn fab dark small color="red">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-speed-dial>
  </v-row>
</template>

<script>
import MaterialCard from "@components/card/MaterialCard";
import { mapGetters } from "vuex";
import api from "@/api";
import ApplicationInfo from "@/pages/Application/components/components/ApplicationInfo";
import ApplicationAdvanced from "@/pages/Application/components/components/ApplicationAdvanced";
import ApplicationNetwork from "@/pages/Application/components/components/ApplicationNetwork";
export default {
  name: "ApplicationDetails",
  components: {
    ApplicationNetwork,
    ApplicationAdvanced,
    ApplicationInfo,
    MaterialCard,
  },
  props: {
    operaType: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      id: "",
      step: 1,
      initLoading: false,
      submitting: false,
      defaultData: {
        environmentVariable: "",
        localEnvironmentVariable: [{}],
        instancesNumber: 1,
        imagePullStrategy: "Always",
        strategyType: "RollingUpdate",
        revisionHistoryLimit: 10,
        maxSurge: 1,
        maxUnavaible: 1,
        envType: 1,
        network: "internal",
        networkType: "ClusterIP",
        networks: [{ protocol: "TCP" }],
      },
      formData: {},
      types: {
        form:
          "list-item, card-heading, divider, date-picker-options, date-picker-days, actions, text@4",
      },
    };
  },
  mounted() {
    this.formData = this.defaultData;
    this.id = this.$route.params.id || "";
  },
  computed: {
    ...mapGetters({
      currentNamespace: "GetCurrentNamespace",
    }),
  },
  watch: {
    id() {
      if (this.id.length !== 0 && this.currentNamespace.id) {
        this.loadDetail();
      }
    },
    currentNamespace() {
      if (this.id.length !== 0 && this.currentNamespace.id) {
        this.loadDetail();
      }
    },
  },
  methods: {
    loadDetail() {
      api.applicationDeployment
        .get(this.currentNamespace.id, this.id)
        .then((res) => {
          this.formData = res.data;
          if (this.formData.externalIp) {
            this.formData.externalIpSelect = this.formData.externalIp.split(
              ","
            );
          }
          if (this.formData.environmentVariable) {
            this.formData.localEnvironmentVariable = JSON.parse(
              this.formData.environmentVariable
            );
          } else {
            this.formData.localEnvironmentVariable = [{}];
          }
          this.id = res.data.id;
        });
    },
    resetData(data) {
      this.formData = {
        ...this.defaultData,
        ...data,
      };
    },
    back() {
      this.$router.push({
        name: "ApplicationList",
      });
    },
    nextStep(value) {
      if (value === 1 && this.$refs.info.validate()) {
        this.step = 2;
      }
      if (value === 2 && this.$refs.advanced.validate()) {
        this.step = 3;
      }
      if (value === 3 && this.$refs.network.validate()) {
        this.submitting = true;
        if (this.operaType === "add" && this.id === "") {
          if (this.formData.externalIpSelect) {
            this.formData.externalIp = this.formData.externalIpSelect.join(",");
          }
          if (this.formData.localEnvironmentVariable) {
            this.formData.environmentVariable = JSON.stringify(
              this.formData.localEnvironmentVariable
            );
          }
          api.applicationDeployment
            .create(this.currentNamespace.id, this.formData)
            .then(() => {
              this.$notify({
                group: "default",
                type: "success",
                title: "新增成功",
              });
              this.$router.push({
                name: "ApplicationList",
              });
            })
            .catch((err) => {
              this.$notify({
                group: "default",
                type: "error",
                title: err.message ? err.message : "新增失败",
              });
            })
            .finally(() => {
              this.submitting = false;
            });
        } else {
          if (this.formData.externalIpSelect) {
            this.formData.externalIp = this.formData.externalIpSelect.join(",");
          }
          if (this.formData.localEnvironmentVariable) {
            this.formData.environmentVariable = JSON.stringify(
              this.formData.localEnvironmentVariable
            );
          }
          api.applicationDeployment
            .update(this.currentNamespace.id, this.formData)
            .then(() => {
              this.$notify({
                group: "default",
                type: "success",
                title: "更新成功",
              });
              this.$router.push({
                name: "ApplicationList",
              });
            })
            .catch(() => {
              this.$notify({
                group: "default",
                type: "error",
                title: "更新失败",
              });
            })
            .finally(() => {
              this.submitting = false;
            });
        }
      }
    },
  },
};
</script>

<style scoped lang="sass">
.stepper-wrapper
  margin-top: 10px
.stepper-content
  margin-top: 8px
  margin-bottom: 18px
.v-stepper
  box-shadow: none
  border-radius: 0
  .v-stepper__header
    box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)
    border-radius: 4px
    border: thin solid rgba(0,0,0,.12)
</style>
