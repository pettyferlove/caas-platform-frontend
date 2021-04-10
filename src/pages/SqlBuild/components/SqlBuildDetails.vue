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
            <v-text-field
              label="项目名称"
              placeholder="填写项目名称"
              v-model="formData.projectName"
              :counter="50"
              :rules="[(v) => !!v || '必须填写项目名称']"
              prepend-icon="mdi-database-edit"
              required
            ></v-text-field>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.envType"
                  :items="environmentTypes"
                  item-text="name"
                  item-value="value"
                  label="环境类型"
                  prepend-icon="mdi-wrench"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.depositoryType"
                  :items="depositoryTypes"
                  item-text="name"
                  item-value="value"
                  @change="changeDepositoryType"
                  label="仓库类型"
                  :rules="[(v) => !!v || '必须选择仓库类型']"
                  prepend-icon="mdi-wrench"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.authType"
                  :items="authTypes"
                  item-text="name"
                  item-value="value"
                  :rules="[(v) => !!v || '必须选择认证方式']"
                  label="认证方式"
                  prepend-icon="mdi-wrench"
                ></v-select>
              </v-col>
            </v-row>
            <v-textarea
              outlined
              v-model="formData.describeInfo"
              name="input-5-1"
              label="项目介绍"
              hint="Hint text"
            ></v-textarea>

            <v-text-field
              label="远程地址"
              placeholder="填写远程地址"
              v-model="formData.remotePath"
              :counter="200"
              :rules="[(v) => !!v || '必须填写远程地址']"
              prepend-icon="mdi-database-edit"
              required
            ></v-text-field>
            <v-alert
              transition="scale-transition"
              v-if="formData.depositoryType === 1"
              dense
              border="left"
              type="warning"
            >
              由于Http方式需要明文传输用户名&密码，将会产生额外安全性问题；建议使用SSH方式访问源码仓库
            </v-alert>
            <v-row v-if="formData.depositoryType === 1">
              <v-col cols="12" md="6">
                <v-text-field
                  label="分支名"
                  v-model="formData.remoteBranch"
                  prepend-icon="mdi-database-edit"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row v-if="formData.authType === 2">
              <v-col cols="12" md="6">
                <v-text-field
                  label="仓库用户名"
                  v-model="formData.username"
                  prepend-icon="mdi-database-edit"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="仓库用户密码"
                  v-model="formData.password"
                  prepend-icon="mdi-database-edit"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-switch
              v-model="formData.full"
              label="是否全量构建"
              :true-value="true"
              :false-value="false"
              prepend-icon="mdi-wrench-outline"
            ></v-switch>

            <v-row v-if="!formData.full">
              <v-col cols="12" md="6">
                <v-text-field
                  label="起始版本号"
                  v-model="formData.sqlFrom"
                  :rules="[(v) => !!v || '必须填写起始版本号']"
                  prepend-icon="mdi-database-edit"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="目标版本号"
                  v-model="formData.sqlTo"
                  prepend-icon="mdi-database-edit"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-textarea
              outlined
              v-model="formData.config"
              name="input-5-1"
              label="构建配置"
              hint="Hint text"
            ></v-textarea>

            <v-textarea
              outlined
              v-model="formData.env"
              name="input-5-1"
              label="环境变量"
              hint="Hint text"
            ></v-textarea>

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
import api from "@/api";
import { mapGetters } from "vuex";

export default {
  name: "SqlBuildDetails",
  components: { MaterialCard },
  props: {
    operaType: {
      type: String,
      default: "add",
    },
  },
  computed: {
    ...mapGetters({
      currentNamespace: "GetCurrentNamespace",
    }),
  },
  data: () => {
    return {
      types: {
        form:
          "list-item, card-heading, divider, date-picker-options, date-picker-days, actions, text@4",
      },
      submitting: false,
      initLoading: false,
      id: "",
      formData: {
        sqlTo: "HEAD",
      },
      environmentTypes: [
        {
          name: "开发环境",
          value: 1,
        },
        {
          name: "测试环境",
          value: 2,
        },
        {
          name: "生产环境",
          value: 9,
        },
      ],
      depositoryTypes: [
        {
          name: "Git",
          value: 1,
        },
        {
          name: "Subversion",
          value: 2,
        },
      ],
      authTypes: [
        {
          name: "RSA",
          value: 1,
        },
        {
          name: "Username&Password",
          value: 2,
        },
      ],
    };
  },
  mounted() {
    this.id = this.$route.params.id || "";
  },
  watch: {
    id() {
      if (this.id.length !== 0) {
        this.loadDetail();
      }
    },
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.submitting = true;
        if (this.operaType === "add" && this.id === "") {
          api.sqlBuild
            .create({ ...this.formData, namespaceId: this.currentNamespace.id })
            .then(() => {
              this.$notify({
                group: "default",
                type: "success",
                title: "新增成功",
              });
              this.$router.push({
                name: "SqlBuildList",
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
          api.sqlBuild
            .update({ ...this.formData, namespaceId: this.currentNamespace.id })
            .then(() => {
              this.$notify({
                group: "default",
                type: "success",
                title: "更新成功",
              });
              this.$router.push({
                name: "SqlBuildList",
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
        name: "SqlBuildList",
      });
    },
    loadDetail() {
      api.sqlBuild.get(this.id).then((res) => {
        this.formData = res.data;
        this.id = res.data.id;
      });
    },
    changeDepositoryType(value) {
      let authTypes = [];
      if (value === 1) {
        authTypes.push({
          name: "RSA",
          value: 1,
        });
        this.$set(this.formData, "remoteBranch", "master");
      } else {
        this.$set(this.formData, "remoteBranch", "trunk");
      }
      authTypes.push({
        name: "Username&Password",
        value: 2,
      });
      this.authTypes = authTypes;
    },
  },
};
</script>

<style scoped></style>
