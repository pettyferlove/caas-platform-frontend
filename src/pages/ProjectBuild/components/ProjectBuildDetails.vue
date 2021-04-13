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
            <!--<v-switch
              v-model="formData.isGitlab"
              class="mx-2"
              label="Gitlab项目"
            ></v-switch>-->
            <!--<v-select
              :loading="projectsLoading"
              v-if="formData.isGitlab"
              :filter="true"
              :items="projects"
              item-text="name"
              item-value="httpUrl"
              label="Color"
            ></v-select>-->

            <v-text-field
              label="项目名称"
              placeholder="填写项目名称"
              v-model="formData.projectName"
              :counter="50"
              :rules="[(v) => !!v || '必须填写项目名称']"
              prepend-icon="mdi-database-edit"
              required
            ></v-text-field>
            <v-alert
              dense
              color="blue-grey"
              icon="mdi-tag-multiple-outline"
              prominent
              text
              type="info"
            >
              项目名将作为最终镜像（War包、Jar包）的名称，请勿添加特殊字符
            </v-alert>
            <v-autocomplete
              v-model="formData.sourceProjectName"
              :items="projects"
              :loading="projectsLoading"
              :search-input.sync="searchProjects"
              item-text="name"
              :disabled="formData.notFound"
              item-value="name"
              @change="changeSourceProject"
              label="源码仓库"
              :rules="[(v) => !!v || '必须选择源码仓库']"
              required
              placeholder="选择源码仓库"
              prepend-icon="mdi-database-search"
            >
              <template v-slot:item="{ item }">
                {{ item.nameWithNamespace }}
              </template>
            </v-autocomplete>
            <v-row v-if="formData.sourceProjectName">
              <v-col
                cols="12"
                :md="formData.triggerMethod === 'branch' ? 6 : 12"
              >
                <v-select
                  v-model="formData.triggerMethod"
                  :items="triggerMethods"
                  item-text="name"
                  item-value="value"
                  label="触发条件"
                  :rules="[(v) => !!v || '请选择触发条件']"
                  required
                  prepend-icon="mdi-wrench"
                  @change="changeTriggerMethod"
                ></v-select>
              </v-col>

              <v-col
                cols="12"
                md="6"
                v-if="formData.triggerMethod === `branch`"
              >
                <v-select
                  v-model="formData.branch"
                  :items="projectBranches"
                  :loading="projectBranchesLoading"
                  item-text="name"
                  item-value="name"
                  label="选择分支"
                  prepend-icon="mdi-wrench"
                ></v-select>
              </v-col>
            </v-row>

            <!--<v-switch
              v-model="formData.notFound"
              label="找不到你的项目？"
              prepend-icon="mdi-help-circle-outline"
            ></v-switch>

            <template v-if="formData.notFound">
              <v-text-field
                label="项目名称"
                placeholder="填写项目名称"
                v-model="formData.projectName"
                :counter="50"
                prepend-icon="mdi-database-edit"
                required
              ></v-text-field>

              <v-text-field
                label="仓库地址"
                placeholder="填写仓库地址"
                v-model="formData.cloneUrl"
                :counter="100"
                prepend-icon="mdi-database-edit"
                required
              ></v-text-field>
            </template>-->
            <v-row>
              <v-col cols="12" md="6">
                <EnvironmentType v-model="formData.envType"></EnvironmentType>
              </v-col>
            </v-row>

            <v-switch
              v-model="formData.needBuildProject"
              label="是否需要构建"
              :true-value="1"
              :false-value="0"
              prepend-icon="mdi-wrench-outline"
            ></v-switch>

            <template v-if="formData.needBuildProject === 1">
              <v-switch
                v-model="formData.openAutoBuild"
                label="是否开启自动构建"
                :true-value="1"
                :false-value="0"
                prepend-icon="mdi-wrench-outline"
              ></v-switch>

              <v-select
                v-model="formData.buildTool"
                :items="buildTools"
                item-text="name"
                item-value="value"
                label="构建工具"
                @change="changeBuildTool"
                :rules="[(v) => !!v || '必须选择构建工具']"
                prepend-icon="mdi-wrench"
              ></v-select>

              <v-text-field
                label="构建命令"
                :rules="[(v) => !!v || '必须填写构建命令']"
                v-model="formData.buildCommand"
                prepend-icon="mdi-stackpath"
                required
              ></v-text-field>

              <v-textarea
                outlined
                v-model="formData.buildParams"
                name="input-7-1"
                label="构建参数"
                hint="Hint text"
              ></v-textarea>
            </template>

            <v-switch
              v-model="formData.persistentBuildFile"
              label="需要持久化构建文件？"
              prepend-icon="mdi-file-code-outline"
              :true-value="1"
              :false-value="0"
            ></v-switch>

            <template v-if="formData.persistentBuildFile === 1">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="构建目标路径"
                    placeholder="请填写相对地址"
                    v-model="formData.buildTargetPath"
                    prepend-icon="mdi-stackpath"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    label="构建目标文件&文件夹（多个文件或文件夹请以空格区分）"
                    placeholder="与构建目标路径配合使用；可使用*通配符"
                    v-model="formData.buildTargetName"
                    prepend-icon="mdi-stackpath"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-alert text type="info" color="deep-orange">
                <h3 class="headline">说明</h3>
                <div>项目文件夹作为根目录</div>
                <v-divider class="my-4 info" style="opacity: 0.22"></v-divider>
                <v-row align="center" no-gutters>
                  <v-col class="grow">
                    Maven项目示例：构建目标路径为项目根目录下的target目录，则构建目标路径填写./target或target，构建目标文件则填写pom文件定义的jar&war包名称
                  </v-col>
                </v-row>
                <v-row align="center" no-gutters>
                  <v-col class="grow">
                    NodeJS项目示例：构建目标路径一般为项目根目录下的dist目录，则构建目标路径填写./dist或dist，构建目标文件则填写具体html名称，如果全部持久化则填写*全匹配
                  </v-col>
                </v-row>
                <v-row align="center" no-gutters>
                  <v-col class="grow"> 具体请按实际项目情况填写 </v-col>
                </v-row>
              </v-alert>
            </template>

            <v-text-field
              label="镜像仓库别名"
              placeholder="填写镜像仓库别名，别名是为了更好的划分一组镜像，你可以自定义名称也可以使用默认的"
              v-model="formData.imagesDepositoryAlias"
              :counter="40"
              :disabled="operaType === `edit`"
              :prefix="user.username + `-`"
              prepend-icon="mdi-stackpath"
              :rules="[(v) => !!v || '请填写别名']"
              required
            ></v-text-field>

            <v-switch
              v-model="formData.needBuildImage"
              label="是否需要构建镜像？"
              prepend-icon="mdi-file-code-outline"
              :true-value="1"
              :false-value="0"
            ></v-switch>

            <template v-if="formData.needBuildImage === 1">
              <v-switch
                v-model="formData.dockerfileAlreadyExists"
                label="已有Dockerfile？"
                prepend-icon="mdi-file-code-outline"
                :true-value="1"
                :false-value="0"
              ></v-switch>
              <template v-if="formData.dockerfileAlreadyExists === 1">
                <v-text-field
                  label="Dockerfile路径"
                  placeholder="填写Dockerfile相对路径，需包含文件名"
                  v-model="formData.dockerfilePath"
                  prepend-icon="mdi-stackpath"
                  required
                ></v-text-field>
                <v-alert text type="info" color="deep-orange">
                  <h3 class="headline">说明</h3>
                  <div>项目文件夹作为根目录</div>
                  <v-divider
                    class="my-4 info"
                    style="opacity: 0.22"
                  ></v-divider>
                  <v-row align="center" no-gutters>
                    <v-col class="grow"> 填写时请包含Dockerfile文件名 </v-col>
                  </v-row>
                </v-alert>
              </template>

              <template v-if="formData.dockerfileAlreadyExists === 0">
                <!--              <v-row>
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      v-model="formData.basicImage"
                      :items="repository"
                      :loading="repositoryLoading"
                      :search-input.sync="searchRepository"
                      item-text="repositoryName"
                      item-value="pullUrl"
                      label="基础镜像"
                      @change="changeImage"
                      placeholder="选择基础镜像"
                      prepend-icon="mdi-database-search"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="formData.imageTag"
                      :items="imageTags"
                      :loading="tagsLoading"
                      item-text="name"
                      item-value="name"
                      label="镜像标签"
                      prepend-icon="mdi-wrench"
                    ></v-select>
                  </v-col>
                </v-row>-->

                <!--<v-text-field
                  label="操作命令"
                  value="example"
                  prefix="RUN "
                ></v-text-field>

                <v-text-field
                  label="启动命令"
                  value="example"
                  prefix="RUN "
                ></v-text-field>-->

                <v-textarea
                  outlined
                  auto-grow
                  v-model="formData.dockerfileContent"
                  name="input-7-1"
                  row-height="40"
                  label="编辑Dockerfile"
                  hint="Hint text"
                  :rules="[(v) => !!v || '请编辑Dockerfile']"
                  required
                ></v-textarea>
              </template>
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
import api from "@/api";
import MaterialCard from "@components/card/MaterialCard";
import { mapGetters } from "vuex";
import EnvironmentType from "@components/base/EnvironmentType";

export default {
  name: "ProjectBuildDetails",
  components: { EnvironmentType, MaterialCard },
  props: {
    operaType: {
      type: String,
      default: "add",
    },
  },
  data: () => {
    return {
      id: "",
      formData: {
        triggerMethod: "branch",
        branch: "master",
        dockerfileAlreadyExists: 0,
        persistentBuildFile: 0,
        openAutoBuild: 1,
        needBuildProject: 1,
        needBuildImage: 1,
        envType: 1,
      },
      projects: [],
      repository: [],
      imageTags: [],
      projectBranches: [
        {
          name: "master",
        },
      ],
      types: {
        form:
          "list-item, card-heading, divider, date-picker-options, date-picker-days, actions, text@4",
      },
      projectsLoading: true,
      submitting: false,
      repositoryLoading: false,
      initLoading: false,
      tagsLoading: false,
      projectBranchesLoading: false,
      searchProjects: null,
      searchRepository: null,
      buildTools: [
        {
          name: "Maven",
          value: "maven",
          disabled: false,
        },
        {
          name: "Gradle",
          value: "gradle",
          disabled: true,
        },
        {
          name: "Npm",
          value: "npm",
          disabled: false,
        },
        {
          name: "Yarn",
          value: "yarn",
          disabled: false,
        },
      ],
      triggerMethods: [
        {
          name: "Branch",
          value: "branch",
        },
        {
          name: "Tag",
          value: "tag",
        },
      ],
    };
  },
  mounted() {
    this.projectsLoading = true;
    this.loadProjects()
      .catch((err) => {
        this.$notify({
          group: "default",
          position: "top",
          duration: 5000,
          speed: 100,
          type: "error",
          title: err.message,
        });
      })
      .finally(() => {
        this.projectsLoading = false;
      });

    this.repositoryLoading = true;
    this.loadRepository()
      .catch((err) => {
        this.$notify({
          group: "default",
          position: "top",
          duration: 5000,
          speed: 100,
          type: "error",
          title: err.message,
        });
      })
      .finally(() => {
        this.repositoryLoading = false;
      });

    this.id = this.$route.params.id || "";
  },
  watch: {
    id() {
      if (this.id.length !== 0) {
        this.loadDetail();
      }
    },
    searchProjects(value) {
      if (!this.formData.notFound) {
        if (value !== null && value !== "") {
          this.projectsLoading = true;
          api.gitlabProject
            .searchProjects({
              name: value,
            })
            .then((res) => {
              this.projects = res.data;
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
              this.projectsLoading = false;
            });
        }
      }
    },
    searchRepository(value) {
      this.repositoryLoading = true;
      api.harborRegister
        .searchPublicRepository({
          q: value,
        })
        .then((res) => {
          this.repository = res.data;
        })
        .catch(() => {})
        .finally(() => {
          this.repositoryLoading = false;
        });
    },
  },
  computed: {
    ...mapGetters({
      user: "getUser",
      currentNamespace: "GetCurrentNamespace",
    }),
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.submitting = true;
        if (this.operaType === "add" && this.id === "") {
          api.projectBuild
            .create({ ...this.formData, namespaceId: this.currentNamespace.id })
            .then(() => {
              this.$notify({
                group: "default",
                type: "success",
                title: "新增成功",
              });
              this.$router.push({
                name: "ProjectBuildList",
              });
            })
            .catch(() => {
              this.$notify({
                group: "default",
                type: "error",
                title: "新增失败",
              });
            })
            .finally(() => {
              this.submitting = false;
            });
        } else {
          api.projectBuild
            .update({ ...this.formData, namespaceId: this.currentNamespace.id })
            .then(() => {
              this.$notify({
                group: "default",
                type: "success",
                title: "更新成功",
              });
              this.$router.push({
                name: "ProjectBuildList",
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
        name: "ProjectBuildList",
      });
    },
    loadDetail() {
      api.projectBuild.get(this.id).then((res) => {
        let data = res.data;
        data.imagesDepositoryAlias = data.imagesDepositoryAlias.replace(
          this.user.username + "-",
          ""
        );
        this.formData = data;
        this.searchProjects = data.sourceProjectName;
        if (this.formData.projectId) {
          this.loadProjectBranches(this.formData.projectId);
        }
        this.id = res.data.id;
      });
    },
    loadProjects() {
      return new Promise((resolve, reject) => {
        api.gitlabProject
          .allProjects()
          .then((res) => {
            this.projects = res.data;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    loadRepository() {
      return new Promise((resolve, reject) => {
        api.harborRegister
          .searchPublicRepository()
          .then((res) => {
            this.repository = res.data;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    loadRepositoryTag(value) {
      console.log(value);
      this.tagsLoading = true;
      api.harborRegister
        .queryRepositoryTag(value)
        .then((res) => {
          this.imageTags = res.data;
        })
        .catch(() => {})
        .finally(() => {
          this.tagsLoading = false;
        });
    },
    loadProjectBranches(value) {
      this.projectBranchesLoading = true;
      api.gitlabProject
        .projectBranches(value)
        .then((res) => {
          this.projectBranches = res.data;
        })
        .catch(() => {})
        .finally(() => {
          this.projectBranchesLoading = false;
        });
    },
    changeTriggerMethod(value) {
      if (value === "branch") {
        this.loadProjectBranches(this.formData.projectId);
      } else {
        this.$set(this.formData, "branch", "master");
      }
    },
    changeBuildTool(value) {
      if (value === "maven") {
        this.$set(this.formData, "buildCommand", "mvn clean package");
      } else if (value === "npm") {
        this.$set(this.formData, "buildCommand", "npm run build");
      } else if (value === "yarn") {
        this.$set(this.formData, "buildCommand", "yarn run build");
      }
    },
    changeImage(value) {
      let repo = this.repository.find((i) => {
        return i.pullUrl === value;
      });
      if (repo) {
        this.loadRepositoryTag(repo.repositoryName);
      }
    },
    changeSourceProject(value) {
      let project = this.projects.find((i) => {
        return i.name === value;
      });
      if (project) {
        this.$set(this.formData, "cloneUrl", project.httpUrl);
        this.$set(this.formData, "projectId", project.id);
        this.$set(this.formData, "projectName", project.name);
        this.$set(this.formData, "sourceProjectWebUrl", project.webUrl);
        this.loadProjectBranches(project.id);
        if (project.owner) {
          this.$set(
            this.formData,
            "imagesDepositoryAlias",
            project.owner.username
          );
        }
      }
    },
  },
};
</script>

<style scoped></style>
