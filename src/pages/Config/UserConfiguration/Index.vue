<template>
  <v-row>
    <v-col>
      <material-card
        color="warning"
        class="px-5 py-3"
        icon="mdi-cogs"
        title="个人配置"
      >
        <v-skeleton-loader
          transition="fade-transition"
          height="500"
          type="form"
          :types="types"
          :loading="initLoading"
        >
          <v-form ref="form">
            <div class="subtitle">
              <v-icon slot="icon"> mdi-git </v-icon>GitLab配置
            </div>
            <v-divider style="margin-bottom: 20px"></v-divider>

            <v-text-field
              :rules="[(v) => !!v || '请填写Gitlab地址']"
              label="Gitlab地址"
              required
              v-model="formData.gitlabHomePath"
            ></v-text-field>

            <v-text-field
              :rules="[(v) => !!v || '请填写Gitlab Api Token']"
              label="Gitlab Api Token"
              required
              type="password"
              v-model="formData.gitlabApiToken"
            ></v-text-field>

            <v-textarea
              counter
              auto-grow
              label="RSA私钥"
              disabled
              v-model="formData.privateKey"
            ></v-textarea>
            <v-alert icon="mdi-shield-lock-outline" prominent text type="info">
              Gitlab拉取代码需要RSA密钥，首次修改个人设置将自动为您生成RSA密钥，后续您可通过刷新按钮更新密钥并应用至Gitlab
            </v-alert>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                @click="refresh"
                :loading="refreshing"
                large
                color="primary"
                class="mr-4"
              >
                <v-icon> mdi-refresh </v-icon>
                更新RSA密钥
              </v-btn>
            </v-card-actions>

            <div class="subtitle">
              <v-icon slot="icon"> mdi-source-repository </v-icon
              >Subversion配置（可选）
            </div>
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

            <v-alert icon="mdi-shield-lock-outline" prominent text type="info">
              Subversion目前只支持明文密码传输
            </v-alert>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                @click="submit"
                :loading="submitting"
                large
                color="error"
                class="mr-4"
              >
                应用至系统
              </v-btn>
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
  name: "UserConfiguration",
  components: { MaterialCard },
  data() {
    return {
      formData: {},
      types: {
        form:
          "list-item, card-heading, divider, date-picker-options, date-picker-days, actions, text@4",
      },
      submitting: false,
      refreshing: false,
      initLoading: false,
    };
  },
  mounted() {
    this.initLoading = true;
    this.loadDetails().then(() => {
      this.initLoading = false;
    });
  },
  methods: {
    loadDetails() {
      return new Promise((resolve, reject) => {
        api.userConfiguration
          .get()
          .then((res) => {
            if (res.data && res.data.privateKey) {
              if (res.data.privateKey.length > 200) {
                res.data.privateKey =
                  res.data.privateKey.substring(0, 200) + "...";
              }
            }
            this.formData = res.data || {};
            this.id = res.data ? res.data.id : "";
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
        if (this.id && this.id !== "") {
          api.userConfiguration
            .update(this.formData)
            .then(() => {
              this.$notify({
                group: "default",
                type: "success",
                title: "个人设置已更新",
              });
              this.loadDetails();
            })
            .catch(() => {
              this.$notify({
                group: "default",
                type: "error",
                title: "个人设置更新失败",
              });
            })
            .finally(() => {
              this.submitting = false;
            });
        } else {
          api.userConfiguration
            .create(this.formData)
            .then(() => {
              this.$notify({
                group: "default",
                type: "success",
                title: "个人设置已更新",
              });
              this.loadDetails();
            })
            .catch(() => {
              this.$notify({
                group: "default",
                type: "error",
                title: "个人设置更新失败",
              });
            })
            .finally(() => {
              this.submitting = false;
            });
        }
      }
    },
    refresh() {
      if (this.formData.id) {
        this.refreshing = true;
        api.userConfiguration
          .refresh()
          .then(() => {
            this.$notify({
              group: "default",
              type: "success",
              title: "SSH Key已更新",
            });
            this.loadDetails();
          })
          .catch(() => {
            this.$notify({
              group: "default",
              type: "error",
              title: "SSH Key更新失败",
            });
          })
          .finally(() => {
            this.refreshing = false;
          });
      }
    },
  },
};
</script>

<style scoped lang="sass">
.subtitle
  i
    margin-right: 6px
  align-items: center
  display: flex
  height: 48px
  font-size: 0.875rem
  font-weight: 400
  padding: 16px 0
</style>
