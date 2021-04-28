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
        :title="operaType === `add` ? `新增用户` : `修改用户`"
      >
        <v-skeleton-loader
          transition="fade-transition"
          height="500"
          type="form"
          :types="types"
          :loading="initLoading"
        >
          <v-form ref="form">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="登录名"
                  placeholder="填写登录名"
                  v-model="formData.loginName"
                  :rules="[(v) => !!v || '必须填写登录名']"
                  prepend-icon="mdi-account"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="用户名"
                  placeholder="填写用户名"
                  v-model="formData.userName"
                  :rules="[(v) => !!v || '必须填写用户名']"
                  prepend-icon="mdi-account-box-outline"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-text-field
              v-if="operaType === `add`"
              label="账号密码"
              placeholder="填写账号密码"
              v-model="formData.password"
              :rules="[(v) => !!v || '必须填写账号密码']"
              prepend-icon="mdi-form-textbox-password"
              required
            ></v-text-field>

            <v-select
              v-model="formData.roleIds"
              :items="roles"
              item-text="name"
              item-value="value"
              chips
              clearable
              multiple
              label="选择角色"
              prepend-icon="mdi-ghost"
            ></v-select>

            <v-radio-group v-model="formData.userSex" mandatory>
              <v-radio label="男" value="1"></v-radio>
              <v-radio label="女" value="0"></v-radio>
            </v-radio-group>

            <v-row>
              <v-col cols="12" md="6">
                <v-menu
                  ref="menu"
                  v-model="userBornMenu"
                  :close-on-content-click="false"
                  :return-value.sync="formData.userBorn"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="formData.userBorn"
                      label="选择日期"
                      prepend-icon="mdi-calendar"
                      readonly
                      hint="MM/DD/YYYY format"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    locale="zh-cn"
                    v-model="formData.userBorn"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="userBornMenu = false">
                      关闭
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu.save(formData.userBorn)"
                    >
                      确定
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6"> </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="电子邮件"
                  placeholder="填写电子邮件"
                  v-model="formData.email"
                  prepend-icon="mdi-email"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="移动电话"
                  placeholder="填写移动电话"
                  v-model="formData.mobileTel"
                  prepend-icon="mdi-cellphone"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="联系电话"
                  placeholder="填写联系电话"
                  v-model="formData.userTel"
                  prepend-icon="mdi-phone"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6"> </v-col>
            </v-row>
            <v-switch
              v-model="formData.status"
              label="是否有效"
              :true-value="1"
              :false-value="0"
              prepend-icon="mdi-account-remove"
            ></v-switch>
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
export default {
  name: "UserDetails",
  components: { MaterialCard },
  props: {
    operaType: {
      type: String,
      default: "add",
    },
  },
  data: () => {
    return {
      types: {
        form:
          "list-item, card-heading, divider, date-picker-options, date-picker-days, actions, text@4",
      },
      userBornMenu: false,
      submitting: false,
      initLoading: false,
      id: "",
      formData: {
        roleIds: ["0000000000000000002"],
        status: 1,
      },
      roles: [
        {
          name: "系统管理员",
          value: "0000000000000000003",
        },
        {
          name: "开发人员",
          value: "0000000000000000001",
        },
        {
          name: "普通用户",
          value: "0000000000000000002",
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
      console.log(this.id);
      if (this.$refs.form.validate()) {
        this.submitting = true;
        if (this.operaType === "add" && this.id === "") {
          api.user
            .create({ ...this.formData })
            .then(() => {
              this.$notify({
                group: "default",
                type: "success",
                title: "新增成功",
              });
              this.$router.push({
                name: "UserList",
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
          delete this.formData.password;
          api.user
            .update({ ...this.formData })
            .then(() => {
              this.$notify({
                group: "default",
                type: "success",
                title: "更新成功",
              });
              this.$router.push({
                name: "UserList",
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
        name: "UserList",
      });
    },
    loadDetail() {
      this.initLoading = true;
      api.user
        .get(this.id)
        .then((res) => {
          this.formData = res.data;
          this.id = res.data.id;
        })
        .finally(() => {
          this.initLoading = false;
        });
    },
  },
};
</script>

<style lang="sass">
.v-picker.v-card
  margin-top: 0
  margin-bottom: 0
</style>
