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
        >
          <v-form ref="form">
            <v-select
              :disabled="operaType !== `add`"
              v-model="formData.autoBuildId"
              :items="autoBuilds"
              :loading="autoBuildLoading"
              item-text="projectName"
              item-value="id"
              @change="changeAutoBuild"
              label="自动构建项目"
              placeholder="使用自动构建项目来部署，简化您的部署流程"
              :rules="[(v) => !!v || '请选择自动构建项目']"
              prepend-icon="mdi-highway"
              required
            ></v-select>

            <v-text-field
              :disabled="operaType !== `add`"
              label="应用名称"
              :counter="40"
              v-model="formData.name"
              required
              :rules="[(v) => !!v || '请填写应用名称']"
              prepend-icon="mdi-form-textbox"
            ></v-text-field>

            <v-textarea
              outlined
              v-model="formData.descriptionContent"
              name="input-7-1"
              label="描述"
              hint="Hint text"
              prepend-icon="mdi-sort-alphabetical-descending-variant"
            ></v-textarea>

            <v-row>
              <v-col cols="12" md="4">
                <v-select
                  :disabled="formData.autoBuildId"
                  v-model="formData.imagesDepositoryId"
                  :items="imagesDepository"
                  :loading="imagesDepositoryLoading"
                  item-text="projectName"
                  item-value="projectId"
                  label="镜像仓库"
                  prepend-icon="mdi-stackpath"
                  :rules="[(v) => !!v || '请选择镜像仓库']"
                  required
                ></v-select>
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  :disabled="formData.autoBuildId"
                  v-model="formData.imageName"
                  :items="repository"
                  :loading="repositoryLoading"
                  item-text="repositoryName"
                  item-value="pullUrl"
                  label="镜像名"
                  :rules="[(v) => !!v || '请选择镜像']"
                  @change="changeRepository"
                  placeholder="选择镜像"
                  prepend-icon="mdi-image-search"
                ></v-select>
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="formData.imageTag"
                  :items="imageTags"
                  :loading="tagsLoading"
                  item-text="name"
                  item-value="name"
                  label="镜像标签"
                  :rules="[(v) => !!v || '请选择镜像标签']"
                  prepend-icon="mdi-tag"
                ></v-select>
              </v-col>
            </v-row>

            <v-select
              v-model="formData.imagePullStrategy"
              :items="pullStrategy"
              item-text="name"
              item-value="value"
              label="镜像拉取策略"
              prepend-icon="mdi-form-select"
            ></v-select>

            <v-text-field
              v-model="formData.instancesNumber"
              label="实例数量"
              required
              prepend-icon="mdi-instrument-triangle"
            ></v-text-field>

            <v-switch
              v-model="formData.customResource"
              label="自定义运行资源要求"
              prepend-icon="mdi-dresser-outline"
              :true-value="1"
              :false-value="0"
            ></v-switch>

            <template v-if="formData.customResource === 1">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.requestCpu"
                    label="CPU最低需求"
                    required
                    prepend-icon="mdi-cpu-64-bit"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.limitCpu"
                    label="CPU最高要求"
                    required
                    prepend-icon="mdi-cpu-64-bit"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.requestMemory"
                    label="内存最低要求"
                    required
                    prepend-icon="mdi-memory"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.limitMemory"
                    label="内存最高要求"
                    required
                    prepend-icon="mdi-memory"
                  ></v-text-field>
                </v-col>
              </v-row>
            </template>

            <v-switch
              v-model="formData.autoScale"
              label="是否开始自动伸缩"
              prepend-icon="mdi-scale"
              :true-value="1"
              :false-value="0"
            ></v-switch>

            <template v-if="formData.autoScale === 1">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field label="最小实例数量" required></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field label="最大实例数量" required></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field label="CPU阈值" required></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field label="内存阈值" required></v-text-field>
                </v-col>
              </v-row>
            </template>

            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.strategyType"
                  :items="strategyType"
                  item-text="name"
                  item-value="value"
                  label="更新策略"
                  prepend-icon="mdi-strategy"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.revisionHistoryLimit"
                  label="更新历史最大保存记录"
                  required
                  prepend-icon="mdi-history"
                ></v-text-field>
              </v-col>
            </v-row>

            <template v-if="formData.strategyType === `RollingUpdate`">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.maxSurge"
                    label="升级过程中最多可以比原先设置多出的POD数量"
                    prepend-icon="mdi-google-podcast"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.maxUnavaible"
                    label="升级过程中最多有多少个POD处于无法提供服务的状态"
                    prepend-icon="mdi-google-podcast"
                  ></v-text-field>
                </v-col>
              </v-row>
            </template>

            <v-row>
              <v-col>
                <v-select
                  v-model="formData.node"
                  :items="nodes"
                  item-text="name"
                  item-value="value"
                  :loading="nodeLoading"
                  chips
                  clearable
                  dense
                  persistent-hint
                  label="选择部署节点"
                  placeholder="指定应用部署到某一个节点，默认为随机分配"
                  prepend-icon="mdi-ghost"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-select
                  v-model="formData.network"
                  :items="networkSelects"
                  item-text="name"
                  chips
                  dense
                  persistent-hint
                  item-value="value"
                  label="网络选项"
                  prepend-icon="mdi-wrench"
                ></v-select>
              </v-col>
            </v-row>
            <template
              v-if="
                formData.network === `internal` ||
                formData.network === `external`
              "
            >
              <v-select
                v-model="formData.networkType"
                :items="networkTypes"
                item-text="name"
                item-value="value"
                :loading="nodeLoading"
                label="网络类型"
                placeholder="指定网络类型，默认使用ClusterIP，该类型无法被外部访问"
                prepend-icon="mdi-phone-voip"
                persistent-hint
              ></v-select>

              <v-select
                v-model="formData.externalIpSelect"
                :items="IPs"
                item-text="name"
                item-value="value"
                multiple
                chips
                dense
                label="访问IP"
                placeholder="指定应用外部访问IP"
                prepend-icon="mdi-phone-voip"
                persistent-hint
                :rules="[
                  formData.networkType === 'LoadBalancer'
                    ? (v) => {
                        return v.length > 0 || '请选择访问IP';
                      }
                    : (v) => {},
                ]"
              ></v-select>
              <v-row
                v-for="(item, index) in formData.networks"
                v-bind:key="`networks-` + index"
              >
                <v-col cols="12" md="4">
                  <v-select
                    v-model="item.protocol"
                    :items="protocolType"
                    item-text="name"
                    item-value="value"
                    label="通信协议"
                    required
                    prepend-icon="mdi-protocol"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    label="端口"
                    v-model="item.port"
                    required
                    prepend-icon="mdi-swap-vertical-bold"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    label="目标端口"
                    v-model="item.targetPort"
                    required
                    prepend-icon="mdi-swap-vertical-bold"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-btn
                    class="mx-2"
                    fab
                    dark
                    small
                    color="secondary"
                    @click="addNetwork(index)"
                  >
                    <v-icon dark>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn
                    class="mx-2"
                    fab
                    dark
                    small
                    color="warning"
                    @click="removeNetwork(index)"
                  >
                    <v-icon dark>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </template>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :loading="submitting"
                color="success"
                class="mr-4"
                @click="submit"
              >
                提交
              </v-btn>
              <v-btn color="grey" class="mr-4" @click="back"> 返回 </v-btn>
            </v-card-actions>
          </v-form>
        </v-skeleton-loader>
      </material-card>
    </v-col>
  </v-row>
</template>

<script>
import MaterialCard from "@components/card/MaterialCard";
import { mapGetters } from "vuex";
import api from "@/api";
export default {
  name: "ApplicationDetails",
  components: { MaterialCard },
  props: {
    operaType: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      id: "",
      initLoading: false,
      autoBuildLoading: false,
      nodeLoading: false,
      imagesDepositoryLoading: false,
      repositoryLoading: false,
      tagsLoading: false,
      submitting: false,
      autoBuilds: [],
      imagesDepository: [],
      repository: [],
      imageTags: [],
      searchRepository: null,
      formData: {
        instancesNumber: 1,
        imagePullStrategy: "Always",
        strategyType: "RollingUpdate",
        revisionHistoryLimit: 10,
        maxSurge: 1,
        maxUnavaible: 1,
        networks: [{}],
      },
      types: {
        form:
          "list-item, card-heading, divider, date-picker-options, date-picker-days, actions, text@4",
      },
      networkSelects: [
        {
          name: "无",
          value: "none",
        },
        {
          name: "内部服务",
          value: "internal",
        },
        {
          name: "外部服务",
          value: "external",
        },
      ],
      pullStrategy: [
        {
          name: "不存在镜像则拉取",
          value: "IfNotPresent",
        },
        {
          name: "每次都拉取最新镜像",
          value: "Always",
        },
        {
          name: "不拉取最近镜像",
          value: "Never",
        },
      ],
      strategyType: [
        {
          name: "重建",
          value: "Recreate",
        },
        {
          name: "滚动更新",
          value: "RollingUpdate",
        },
      ],
      protocolType: [
        {
          name: "TCP",
          value: "TCP",
        },
        {
          name: "UDP",
          value: "UDP",
        },
      ],
      networkTypes: [
        {
          name: "NodePort",
          value: "NodePort",
        },
        {
          name: "ClusterIP",
          value: "ClusterIP",
        },
        {
          name: "LoadBalancer",
          value: "LoadBalancer",
        },
      ],
      nodes: [],
      IPs: [],
    };
  },
  mounted() {
    this.autoBuildLoading = true;
    this.loadAutoBuildProject().finally(() => {
      this.autoBuildLoading = false;
    });
    this.imagesDepositoryLoading = true;
    this.loadImagesDepository().finally(() => {
      this.imagesDepositoryLoading = false;
    });
    this.nodeLoading = true;
    this.loadNode().finally(() => {
      this.nodeLoading = false;
    });
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
    "formData.imagesDepositoryId"() {
      this.repositoryLoading = true;
      api.harborRegister
        .queryRepository({
          projectId: this.formData.imagesDepositoryId,
        })
        .then((res) => {
          this.repository = res.data;
          let depository = this.imagesDepository.find((i) => {
            return i.projectId === this.formData.imagesDepositoryId;
          });
          let imageNameTemp = "";
          if (this.formData.id) {
            imageNameTemp = this.formData.imageName.substr(
              this.formData.imageName.indexOf(depository.projectName),
              this.formData.imageName.length
            );
          } else {
            imageNameTemp = depository.projectName + "/" + this.formData.name;
          }

          let defaultRepository = this.repository.find((i) => {
            return imageNameTemp === i.repositoryName;
          });
          this.$set(this.formData, "imageName", defaultRepository.pullUrl);
          this.changeRepository(defaultRepository.pullUrl);
        })
        .catch(() => {})
        .finally(() => {
          this.repositoryLoading = false;
        });
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
          this.id = res.data.id;
        });
    },
    loadNode() {
      return new Promise((resolve, reject) => {
        api.node
          .list()
          .then((res) => {
            let t = res.data || [];
            this.nodes = [];
            this.IPs = [];
            t.forEach((i) => {
              this.nodes.push({
                name: i.hostName,
                value: i.hostName,
              });
              this.IPs.push({
                name: i.ip,
                value: i.ip,
              });
            });
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    loadAutoBuildProject() {
      return new Promise((resolve, reject) => {
        api.projectBuild
          .select()
          .then((res) => {
            this.autoBuilds = res.data;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    loadImagesDepository() {
      return new Promise((resolve, reject) => {
        api.imagesDepository
          .select()
          .then((res) => {
            this.imagesDepository = res.data;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    loadRepositoryTag(value) {
      this.tagsLoading = true;
      api.harborRegister
        .queryRepositoryTag(value)
        .then((res) => {
          this.imageTags = res.data;
          if (this.imageTags.length > 0) {
            this.$set(this.formData, "imageTag", this.imageTags[0].name);
          }
        })
        .catch(() => {})
        .finally(() => {
          this.tagsLoading = false;
        });
    },
    changeAutoBuild(value) {
      let projectBuild = this.autoBuilds.find((i) => {
        return i.id === value;
      });
      if (projectBuild) {
        this.$set(this.formData, "name", projectBuild.projectName);
        this.$set(
          this.formData,
          "imagesDepositoryId",
          projectBuild.imagesDepositoryId
        );
      }
    },
    changeRepository(value) {
      let selectedRepository = this.repository.find((i) => {
        return i.pullUrl === value;
      });
      if (selectedRepository) {
        this.loadRepositoryTag(selectedRepository.repositoryName);
      }
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.submitting = true;
        if (this.operaType === "add" && this.id === "") {
          if (this.formData.externalIpSelect) {
            this.formData.externalIp = this.formData.externalIpSelect.join(",");
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
    back() {
      this.$router.push({
        name: "ApplicationList",
      });
    },
    addNetwork(index) {
      this.formData.networks.splice(index + 1, 0, {});
    },
    removeNetwork(index) {
      this.formData.networks.splice(index, 1);
    },
  },
};
</script>

<style scoped></style>
