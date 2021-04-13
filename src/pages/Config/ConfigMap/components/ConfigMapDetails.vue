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
              label="配置名称"
              placeholder="填写配置名称"
              v-model="formData.configName"
              :counter="50"
              :rules="[(v) => !!v || '必须填写配置名称']"
              prepend-icon="mdi-database-edit"
              required
            ></v-text-field>

            <v-textarea
              outlined
              v-model="formData.description"
              name="input-5-1"
              label="配置描述"
              hint="Hint text"
            ></v-textarea>

            <v-text-field
              label="文件名称"
              placeholder="填写文件名称"
              v-model="formData.fileName"
              :counter="50"
              :rules="[(v) => !!v || '必须填写文件名称']"
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
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.configType"
                  :items="configTypes"
                  item-text="name"
                  item-value="value"
                  label="配置类型"
                  prepend-icon="mdi-wrench"
                ></v-select>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <ConfigEditor
                style="margin: 20px"
                :type="formData.configType"
                v-model="formData.content"
              ></ConfigEditor>
            </v-row>
          </v-form>
        </v-skeleton-loader>
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

          <v-btn color="grey" class="mr-4" @click="back"> 返回</v-btn>
        </v-card-actions>
      </material-card>
    </v-col>
  </v-row>
</template>

<script>
import MaterialCard from "@components/card/MaterialCard";
import ConfigEditor from "@components/editer/ConfigEditor";
import { mapGetters } from "vuex";
import api from "@/api";

export default {
  name: "ConfigMapDetails",
  components: { ConfigEditor, MaterialCard },
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
      id: "",
      initLoading: false,
      submitting: false,
      formData: {
        configType: "yaml",
        envType: 1,
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
      configTypes: [
        {
          name: "Yaml&Yml",
          value: "yaml",
        },
        {
          name: "Properties",
          value: "properties",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      currentNamespace: "GetCurrentNamespace",
    }),
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
    loadDetail() {
      api.config.get(this.id).then((res) => {
        this.formData = res.data;
        this.id = res.data.id;
      });
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.submitting = true;
        if (this.operaType === "add" && this.id === "") {
          api.config
            .create({ ...this.formData, namespaceId: this.currentNamespace.id })
            .then(() => {
              this.$notify({
                group: "default",
                type: "success",
                title: "新增成功",
              });
              this.$router.push({
                name: "ConfigList",
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
          api.config
            .update({ ...this.formData, namespaceId: this.currentNamespace.id })
            .then(() => {
              this.$notify({
                group: "default",
                type: "success",
                title: "更新成功",
              });
              this.$router.push({
                name: "ConfigList",
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
        name: "ConfigList",
      });
    },
  },
};
</script>

<style scoped></style>
