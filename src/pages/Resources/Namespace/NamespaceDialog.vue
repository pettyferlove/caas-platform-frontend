<template>
  <div class="text-end pt-2" style="margin-bottom: 10px">
    <v-dialog v-model="visible" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">基础信息</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    :disabled="id.length !== 0"
                    v-model="formData.name"
                    :rules="[(v) => !!v || 'Namespace名称不可为空']"
                    label="名称"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="formData.istio"
                    label="是否开启Istio注入"
                  ></v-switch>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-textarea
                    outlined
                    auto-grow
                    v-model="formData.description"
                    row-height="30"
                    label="描述"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-select
                    v-model="formData.envType"
                    :items="environmentTypes"
                    item-text="name"
                    item-value="value"
                    label="环境类型"
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel">取消</v-btn>
          <v-btn color="blue darken-1" text @click="submit">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import api from "@/api";

export default {
  name: "NamespaceDialog",
  props: {
    id: {
      required: false,
      type: String,
    },
    dialogVisible: {
      required: true,
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visible() {
      return this.dialogVisible;
    },
  },
  data() {
    return {
      formData: {
        istio: false,
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
    };
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
      api.namespace.get(this.id).then((res) => {
        this.formData = res.data;
      });
    },
    cancel() {
      this.formData = {};
      this.$emit("close");
    },
    submit() {
      if (this.$refs.form.validate()) {
        if (this.id.length !== 0) {
          api.namespace
            .update(this.formData)
            .then(() => {
              this.formData = {
                istioInjection: false,
              };
              this.$notify({
                group: "default",
                type: "success",
                title: "新增成功",
              });
              this.formData = {};
              this.$emit("close");
            })
            .catch(() => {
              this.$notify({
                group: "default",
                type: "error",
                title: "新增失败",
              });
            });
        } else {
          api.namespace
            .create(this.formData)
            .then(() => {
              this.formData = {
                istioInjection: false,
              };
              this.$notify({
                group: "default",
                type: "success",
                title: "新增成功",
              });
              this.formData = {};
              this.$emit("close");
            })
            .catch(() => {
              this.$notify({
                group: "default",
                type: "error",
                title: "新增失败",
              });
            });
        }
      }
    },
  },
};
</script>

<style scoped></style>
