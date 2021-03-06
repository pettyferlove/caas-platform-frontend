<template>
  <v-form ref="form">
    <v-row>
      <v-col cols="12" md="6">
        <v-select
          :disabled="operaType !== `add`"
          v-model="formData.autoBuildId"
          :items="projectBuilds"
          :loading="projectBuildLoading"
          item-text="projectName"
          item-value="id"
          @change="changeProjectBuild"
          label="选择自动构建项目"
          placeholder="使用自动构建项目来部署，简化您的部署流程"
          :rules="[(v) => !!v || '请选择自动构建项目']"
          prepend-icon="mdi-highway"
          required
        ></v-select>
      </v-col>

      <v-col cols="12" md="6">
        <EnvironmentType
          :disabled="operaType !== `add`"
          @change="changeEnvType"
          v-model="formData.envType"
        ></EnvironmentType>
      </v-col>
    </v-row>

    <v-text-field
      :disabled="operaType !== `add`"
      label="应用名称"
      :counter="40"
      v-model="formData.name"
      required
      :rules="[(v) => validKey(v) || '请填写应用名称']"
      prepend-icon="mdi-form-textbox"
    ></v-text-field>

    <v-textarea
      outlined
      v-model="formData.descriptionContent"
      name="input-7-1"
      label="描述"
    ></v-textarea>

    <div class="text-left">
      <dynamic-keyword
        :bus-id="formData.id"
        bus-type="application_deployment"
        @change="changeKeyword"
      ></dynamic-keyword>
    </div>

    <v-row>
      <v-col cols="12" md="4">
        <v-select
          :disabled="
            formData.imagesDepositoryId && formData.imagesDepositoryId !== ``
          "
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
          :disabled="
            formData.imagesDepositoryId && formData.imagesDepositoryId !== ``
          "
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
  </v-form>
</template>

<script>
import EnvironmentType from "@components/base/EnvironmentType";
import api from "@/api";
import { mapGetters } from "vuex";
import DynamicKeyword from "@components/keyword/DynamicKeyword";
export default {
  name: "ApplicationInfo",
  components: { DynamicKeyword, EnvironmentType },
  props: {
    value: [Object],
    operaType: {
      type: String,
      default: "add",
    },
  },
  watch: {
    value() {
      this.initValue();
    },
    formData: {
      deep: true,
      handler: function (val) {
        if (!this.isInit) {
          this.$emit("change", val);
        }
      },
    },
    "formData.imagesDepositoryId"() {
      this.changeImagesDepository();
    },
    "formData.autoBuildId"() {
      this.projectBuildLoading = true;
      this.loadProjectBuildProject().finally(() => {
        this.projectBuildLoading = false;
      });
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  data: () => {
    return {
      formData: {},
      isInit: false,
      projectBuildLoading: false,
      imagesDepositoryLoading: false,
      repositoryLoading: false,
      tagsLoading: false,
      projectBuilds: [],
      imagesDepository: [],
      repository: [],
      imageTags: [],
    };
  },
  methods: {
    initValue() {
      this.isInit = true;
      this.formData = this.value;
      this.isInit = false;
    },
    loadProjectBuildProject() {
      return new Promise((resolve, reject) => {
        api.projectBuild
          .select(this.currentNamespace.id, {
            envType: this.formData.envType || 1,
          })
          .then((res) => {
            this.projectBuilds = res.data;
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
    changeKeyword(keywords) {
      this.$set(this.formData, "keywords", keywords.join(","));
    },
    changeProjectBuild(value) {
      this.$set(this.formData, "imagesDepositoryId", "");
      this.$set(this.formData, "imageName", "");
      this.$set(this.formData, "imageTag", "");
      let projectBuild = this.projectBuilds.find((i) => {
        return i.id === value;
      });
      if (projectBuild.needBuildImage !== 1) {
        this.$notify({
          group: "default",
          type: "error",
          title:
            "该项目没有开启镜像构建，如果镜像仓库存在历史记录将使用最后一次构建的镜像，如果不存在则无法获取镜像",
        });
      }
      if (projectBuild) {
        this.$set(this.formData, "name", projectBuild.projectName);
        this.$set(
          this.formData,
          "imagesDepositoryId",
          projectBuild.imagesDepositoryId
        );
        this.changeImagesDepository();
      }
    },
    changeImagesDepository() {
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
    changeRepository(value) {
      let selectedRepository = this.repository.find((i) => {
        return i.pullUrl === value;
      });
      if (selectedRepository) {
        this.loadRepositoryTag(selectedRepository.repositoryName);
      }
    },
    changeEnvType(value) {
      this.loadProjectBuildProject().finally(() => {
        this.projectBuildLoading = false;
      });
      this.$emit("reset-data", {
        envType: value,
      });
    },
    validate() {
      return this.$refs.form.validate();
    },
    validKey(val) {
      if (val && !/^[a-z0-9_\\-]+$/g.test(val)) {
        return "只能输入小写英文字符和下划线";
      }
      return true;
    },
  },
  computed: {
    ...mapGetters({
      currentNamespace: "GetCurrentNamespace",
    }),
  },
  mounted() {
    if (this.value) {
      this.initValue();
    }
    this.projectBuildLoading = true;
    this.loadProjectBuildProject().finally(() => {
      this.projectBuildLoading = false;
    });
    this.imagesDepositoryLoading = true;
    this.loadImagesDepository().finally(() => {
      this.imagesDepositoryLoading = false;
    });
  },
};
</script>

<style scoped></style>
