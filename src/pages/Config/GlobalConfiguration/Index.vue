<template>
  <v-row>
    <v-col>
      <material-card color="warning" class="px-5 py-3" text="全局配置">
        <v-skeleton-loader
          transition="fade-transition"
          height="500"
          type="form"
          :types="types"
          :loading="initLoading"
        >
          <v-form ref="form">
            <v-text-field
              label="Docker Registry Path"
              v-model="formData.dockerRegistryPath"
            ></v-text-field>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Docker Registry Username"
                  v-model="formData.dockerRegistryUsername"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Docker Registry Password"
                  type="password"
                  v-model="formData.dockerRegistryPassword"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-textarea
              outlined
              auto-grow
              v-model="formData.clusterServer"
              name="input-7-1"
              row-height="40"
              label="CaaS集群地址"
              hint="多个地址以;号分隔"
              :rules="[(v) => !!v || '请填写CaaS集群地址']"
              required
            ></v-textarea>

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
import api from "@/api";
import MaterialCard from "@components/card/MaterialCard";
export default {
  name: "GlobalConfiguration",
  components: { MaterialCard },
  data: () => {
    return {
      id: "",
      formData: {},
      types: {
        form: "list-item, card-heading, divider, date-picker-options, date-picker-days, actions, text@4",
      },
      submitting: false,
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
        api.globalConfiguration
          .get()
          .then((res) => {
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
          api.globalConfiguration
            .update(this.formData)
            .then(() => {
              this.$notify({
                group: "default",
                type: "success",
                title: "系统配置已更新",
              });
            })
            .catch(() => {
              this.$notify({
                group: "default",
                type: "error",
                title: "系统配置更新失败",
              });
            })
            .finally(() => {
              this.submitting = false;
            });
        } else {
          api.globalConfiguration
            .create(this.formData)
            .then(() => {
              this.$notify({
                group: "default",
                type: "success",
                title: "系统配置已更新",
              });
            })
            .catch(() => {
              this.$notify({
                group: "default",
                type: "error",
                title: "系统配置更新失败",
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

<style scoped></style>
