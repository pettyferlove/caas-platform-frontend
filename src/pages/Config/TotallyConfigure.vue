<template>
  <div>
    <v-alert border="bottom" colored-border type="warning" elevation="2">
      首次进入系统需要补充部分信息才可正常试用，请按实际情况填写如下信息
    </v-alert>
    <v-stepper v-model="step">
      <v-stepper-header>
        <template v-if="hasRole('ADMIN')">
          <v-stepper-step :complete="step > 1" step="1">
            完善系统全局配置
          </v-stepper-step>
          <v-divider></v-divider>
        </template>
        <v-stepper-step
          :complete="step > (hasRole('ADMIN') ? 2 : 1)"
          :step="hasRole('ADMIN') ? '2' : '1'"
        >
          完善用户安全配置
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :step="hasRole('ADMIN') ? '3' : '2'">
          创建命名空间
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content v-if="hasRole('ADMIN')" step="1">
          <v-form ref="globalForm">
            <v-text-field
              label="Docker镜像仓库"
              :rules="[(v) => !!v || '请填写Docker镜像仓库地址']"
              v-model="globalFormData.dockerRegistryPath"
            ></v-text-field>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Docker镜像仓库用户名"
                  v-model="globalFormData.dockerRegistryUsername"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Docker镜像仓库用户密码"
                  type="password"
                  v-model="globalFormData.dockerRegistryPassword"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-textarea
              outlined
              auto-grow
              v-model="globalFormData.clusterServer"
              name="input-7-1"
              row-height="40"
              label="CaaS集群地址"
              hint="多个地址以;号分隔"
              :rules="[(v) => !!v || '请填写CaaS集群地址']"
              required
            ></v-textarea>
          </v-form>
          <v-btn
            :loading="submitting"
            color="primary"
            @click="nextStep('global')"
          >
            下一步
          </v-btn>
        </v-stepper-content>

        <v-stepper-content :step="hasRole('ADMIN') ? '2' : '1'">
          <v-form ref="userForm">
            <v-subheader> GitLab配置 </v-subheader>
            <v-divider style="margin-bottom: 20px"></v-divider>
            <v-text-field
              :rules="[(v) => !!v || '请填写Gitlab地址']"
              label="Gitlab地址"
              required
              v-model="userFormData.gitlabHomePath"
            ></v-text-field>

            <v-text-field
              :rules="[(v) => !!v || '请填写Gitlab Api Token']"
              label="Gitlab Api Token"
              required
              type="password"
              v-model="userFormData.gitlabApiToken"
            ></v-text-field>

            <v-subheader> Subversion配置（可选） </v-subheader>
            <v-divider style="margin-bottom: 20px"></v-divider>

            <v-text-field
              label="Subversion用户名"
              required
              v-model="formData.subversionUsername"
            ></v-text-field>

            <v-text-field
              label="Subversion用户密码"
              required
              type="password"
              v-model="formData.subversionPassword"
            ></v-text-field>
          </v-form>
          <v-btn
            :loading="submitting"
            color="primary"
            @click="nextStep('user')"
          >
            下一步
          </v-btn>
          <v-btn v-if="hasRole('ADMIN')" @click="step = 1" text> 上一步 </v-btn>
        </v-stepper-content>

        <v-stepper-content :step="hasRole('ADMIN') ? '3' : '2'">
          <v-form ref="namespaceForm">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="namespaceFormData.name"
                  :rules="[(v) => validKey(v) || 'Namespace名称不可为空']"
                  label="名称"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-switch
                  v-model="namespaceFormData.istio"
                  label="是否开启Istio注入"
                ></v-switch>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-textarea
                  outlined
                  auto-grow
                  v-model="namespaceFormData.description"
                  row-height="30"
                  label="描述"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
          <v-btn
            :loading="submitting"
            color="primary"
            @click="nextStep('namespace')"
          >
            应用
          </v-btn>
          <v-btn text @click="step = hasRole('ADMIN') ? 2 : 1"> 上一步 </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import api from "@/api";
import { mapGetters } from "vuex";

export default {
  name: "TotallyConfigure",
  data: () => {
    return {
      step: 1,
      submitting: false,
      globalFormData: {
        gitlabHomePath: "http://gitlab.ggjs.sinobest.cn/",
      },
      userFormData: {},
      namespaceFormData: {
        istio: true,
      },
    };
  },
  computed: {
    ...mapGetters({
      user: "GetUser",
      roles: "getRoles",
    }),
  },
  mounted() {},
  methods: {
    validKey(val) {
      if (!val || !/^[a-z0-9_\\-]+$/g.test(val)) {
        return "只能输入小写英文字符和下划线";
      }
      return true;
    },
    nextStep(value) {
      let that = this;
      that.submitting = true;
      if (value === "global") {
        if (that.$refs.globalForm.validate()) {
          that.step++;
          that.submitting = false;
        } else {
          that.submitting = false;
        }
      }

      if (value === "user") {
        if (that.$refs.userForm.validate()) {
          that.step++;
          that.submitting = false;
        } else {
          that.submitting = false;
        }
      }

      if (value === "namespace") {
        if (that.$refs.namespaceForm.validate()) {
          let initData = {
            globalConfiguration: this.globalFormData,
            userConfiguration: this.userFormData,
            namespace: this.namespaceFormData,
          };
          api.user.initConfig(initData).then(() => {
            that.$store
              .dispatch("CheckConfig")
              .then(() => {
                that.$notify({
                  group: "default",
                  position: "top",
                  duration: 5000,
                  speed: 100,
                  type: "success",
                  title: "设置成功，可以尽情试用CaaS平台了",
                });
                that.$store.dispatch("LoadNamespaces");
                that.$router
                  .push({
                    name: "Main",
                  })
                  .catch(() => {});
              })
              .catch((error) => {
                that.errorMsg =
                  error.message === "" ? "服务异常" : error.message;
              });
          });
          that.submitting = false;
        } else {
          that.submitting = false;
        }
      }
    },
  },
};
</script>

<style scoped></style>
