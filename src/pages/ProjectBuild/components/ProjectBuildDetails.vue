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
        :title="operaType === `add` ? '新增' : '修改'"
      >
        <v-skeleton-loader
          transition="fade-transition"
          height="500"
          type="form"
          :types="types"
          :loading="initLoading"
        >
          <v-form ref="form">
            <v-text-field
              label="项目名称"
              placeholder="填写项目名称"
              v-model="formData.projectName"
              :counter="50"
              :rules="[(v) => validKey(v) || '必须填写项目名称']"
              prepend-icon="mdi-database-edit"
              required
            ></v-text-field>

            <v-textarea
              outlined
              auto-grow
              v-model="formData.projectDescribe"
              name="input-7-1"
              row-height="20"
              label="说明"
              hint="简要介绍"
              :rules="[(v) => !!v || '请说明信息']"
              required
            ></v-textarea>

            <div class="text-left">
              <dynamic-keyword
                :bus-id="id"
                bus-type="project_build"
                @change="changeKeyword"
              ></dynamic-keyword>
            </div>

            <v-switch
              v-model="formData.linkProject"
              label="需要关联其他项目？"
              :true-value="true"
              :false-value="false"
              prepend-icon="mdi-link-variant-plus"
            ></v-switch>

            <v-select
              v-if="formData.linkProject"
              v-model="formData.parentId"
              :items="projectBuilds"
              :loading="projectBuildLoading"
              item-text="projectName"
              item-value="id"
              @change="changeProjectBuild"
              label="选择需要关联的父项目"
              :rules="[(v) => !!v || '请选择关联项目']"
              prepend-icon="mdi-link-variant"
              required
            ></v-select>

            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.depositoryType"
                  :items="depositoryTypes"
                  item-text="name"
                  item-value="value"
                  label="仓库类型"
                  @change="changeDepositoryType"
                  :rules="[(v) => !!v || '必须选择仓库类型']"
                  prepend-icon="mdi-source-repository"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <EnvironmentType
                  @change="changeEnvType"
                  v-model="formData.envType"
                ></EnvironmentType>
              </v-col>
            </v-row>

            <template v-if="formData.depositoryType === `gitlab_v4`">
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

              <v-text-field
                disabled
                label="仓库地址"
                placeholder="填写仓库地址"
                v-model="formData.remotePath"
                :counter="100"
                prepend-icon="mdi-database-edit"
                required
              ></v-text-field>

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
                    v-model="formData.remoteBranch"
                    :items="projectBranches"
                    :loading="projectBranchesLoading"
                    item-text="name"
                    item-value="name"
                    label="选择分支"
                    prepend-icon="mdi-wrench"
                  ></v-select>
                </v-col>
              </v-row>
            </template>

            <template v-if="formData.depositoryType === `subversion`">
              <v-text-field
                label="仓库地址"
                placeholder="填写仓库地址"
                v-model="formData.remotePath"
                :counter="100"
                prepend-icon="mdi-database-edit"
                required
              ></v-text-field>
            </template>

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

              <v-switch
                v-model="formData.runPreShellScript"
                label="执行前置脚本？"
                prepend-icon="mdi-powershell"
              ></v-switch>

              <ShellEditor
                v-if="formData.runPreShellScript"
                v-model="formData.preShellScript"
              ></ShellEditor>

              <v-switch
                v-model="formData.runPostShellScript"
                label="执行后置脚本？"
                prepend-icon="mdi-powershell"
              ></v-switch>

              <ShellEditor
                v-if="formData.runPostShellScript"
                v-model="formData.postShellScript"
              ></ShellEditor>

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
              <v-alert
                style="padding: 10px 5px"
                text
                type="info"
                color="deep-orange"
              >
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
                <v-alert
                  style="padding: 10px 5px"
                  text
                  type="info"
                  color="deep-orange"
                >
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
                <!--                <v-row>
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      v-model="dockerfile.baseImage"
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
                      v-model="dockerfile.baseImageTag"
                      :items="imageTags"
                      :loading="tagsLoading"
                      item-text="name"
                      item-value="name"
                      label="镜像标签"
                      prepend-icon="mdi-wrench"
                    ></v-select>
                  </v-col>
                </v-row>

                <v-text-field
                  label="操作命令"
                  value="example"
                  prefix="RUN "
                ></v-text-field>

                <v-text-field
                  label="启动命令"
                  value="example"
                  prefix="RUN "
                ></v-text-field>-->

                <ConfigEditor
                  type="dockerfile"
                  v-model="formData.dockerfileContent"
                ></ConfigEditor>
                <!--                <v-textarea
                  outlined
                  auto-grow
                  v-model="formData.dockerfileContent"
                  name="input-7-1"
                  row-height="40"
                  label="编辑Dockerfile"
                  hint="Hint text"
                  :rules="[(v) => !!v || '请编辑Dockerfile']"
                  required
                ></v-textarea>-->
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

    <Document document-name="ProjectBuild.md"></Document>
  </v-row>
</template>

<script>
import api from "@/api";
import MaterialCard from "@components/card/MaterialCard";
import { mapGetters } from "vuex";
import EnvironmentType from "@components/base/EnvironmentType";
import ShellEditor from "@components/editer/ShellEditor";
import Document from "@/pages/components/Document";
import ConfigEditor from "@components/editer/ConfigEditor";
import DynamicKeyword from "@components/keyword/DynamicKeyword";

export default {
  name: "ProjectBuildDetails",
  components: {
    DynamicKeyword,
    ConfigEditor,
    Document,
    ShellEditor,
    EnvironmentType,
    MaterialCard,
  },
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
        depositoryType: "gitlab_v4",
        triggerMethod: "branch",
        remoteBranch: "master",
        dockerfileAlreadyExists: 0,
        persistentBuildFile: 0,
        openAutoBuild: 1,
        needBuildProject: 1,
        needBuildImage: 1,
        envType: 1,
      },
      // dockerfile: {
      //   baseImage: "",
      //   baseImageTag: "",
      // },
      projectBuildLoading: false,
      projects: [],
      projectBuilds: [],
      repository: [],
      imageTags: [],
      projectBranches: [
        {
          name: "master",
        },
      ],
      types: {
        form: "list-item, card-heading, divider, date-picker-options, date-picker-days, actions, text@4",
      },
      projectsLoading: true,
      submitting: false,
      repositoryLoading: false,
      initLoading: false,
      tagsLoading: false,
      projectBranchesLoading: false,
      searchProjects: null,
      searchRepository: null,
      depositoryTypes: [
        {
          name: "GitLab V4",
          value: "gitlab_v4",
        },
        {
          name: "Subversion",
          value: "subversion",
        },
      ],
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

    if (this.operaType === "add") {
      this.projectBuildLoading = true;
      this.loadProjectBuildProject().finally(() => {
        this.projectBuildLoading = false;
      });
    }

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
    currentNamespace() {
      this.$router.push({
        name: "ProjectBuildList",
      });
    },
    searchProjects(value) {
      if (this.formData.depositoryType === `gitlab_v4`) {
        if (value !== undefined && value !== null && value !== "") {
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
      user: "GetUser",
      currentNamespace: "GetCurrentNamespace",
    }),
  },
  methods: {
    loadProjectBuildProject() {
      return new Promise((resolve, reject) => {
        api.projectBuild
          .select(this.currentNamespace.id, {
            envType: this.formData.envType || 1,
            currentId: this.formData.id,
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
      this.initLoading = true;
      api.projectBuild
        .get(this.id)
        .then((res) => {
          let data = res.data;
          this.formData = data;
          if (data.depositoryType === `gitlab_v4`) {
            this.searchProjects = data.sourceProjectName;
          }
          if (this.formData.remoteProjectId) {
            this.loadProjectBranches(this.formData.remoteProjectId);
          }
          this.projectBuildLoading = true;
          this.loadProjectBuildProject().finally(() => {
            this.projectBuildLoading = false;
          });
          this.id = res.data.id;
        })
        .finally(() => {
          this.initLoading = false;
        });
    },
    changeProjectBuild(value) {
      let projectBuild = this.projectBuilds.find((i) => {
        return i.id === value;
      });
      if (projectBuild) {
        this.$set(this.formData, "parentId", projectBuild.id);
      }
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
    changeKeyword(keywords) {
      this.$set(this.formData, "keywords", keywords.join(","));
    },
    changeTriggerMethod(value) {
      if (value === "branch") {
        this.loadProjectBranches(this.formData.projectId);
      } else {
        this.$set(this.formData, "remoteBranch", "master");
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
    changeDepositoryType() {
      this.searchProjects = this.formData.sourceProjectName;
      this.changeSourceProject(this.formData.sourceProjectName);
    },
    changeEnvType() {
      this.loadProjectBuildProject().finally(() => {
        this.projectBuildLoading = false;
      });
    },
    changeSourceProject(value) {
      let project = this.projects.find((i) => {
        return i.name === value;
      });
      if (project) {
        this.$set(this.formData, "remotePath", project.httpUrl);
        this.$set(this.formData, "remoteProjectId", project.id);
        this.$set(this.formData, "projectName", project.name);
        this.$set(this.formData, "sourceProjectWebUrl", project.webUrl);
        this.loadProjectBranches(project.id);
      }
    },
    validKey(val) {
      if (!val || !/^[a-z0-9_\\-]+$/g.test(val)) {
        return "只能输入小写英文字符和下划线";
      }
      return true;
    },
  },
};
</script>

<style scoped lang="sass"></style>
