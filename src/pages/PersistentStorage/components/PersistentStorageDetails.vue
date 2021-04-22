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
              :disabled="operaType !== `add`"
              label="持久化存储名称"
              placeholder="填写名称"
              v-model="formData.name"
              :counter="50"
              :rules="[(v) => validKey(v) || '必须填写名称']"
              prepend-icon="mdi-database-edit"
              required
            ></v-text-field>
            <v-row>
              <v-col cols="12" md="6">
                <EnvironmentType v-model="formData.envType"></EnvironmentType>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  label="初始化容量大小"
                  v-model="formData.initSize"
                  prepend-icon="mdi-database-edit"
                  :rules="[(v) => !!v || '必须填写初始化容量']"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  label="容量最大值"
                  v-model="formData.limitSize"
                  prepend-icon="mdi-database-edit"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="formData.unit"
                  :items="units"
                  item-text="name"
                  item-value="value"
                  label="容量单位"
                  :rules="[(v) => !!v || '必须选择容量单位']"
                  prepend-icon="mdi-wrench"
                ></v-select>
              </v-col>
            </v-row>
            <v-select
              v-model="formData.accessMode"
              :items="accessModes"
              item-text="name"
              item-value="value"
              label="访问模式"
              :rules="[(v) => !!v || '必须选择容量单位']"
              prepend-icon="mdi-wrench"
            ></v-select>

            <v-select
              v-model="formData.storageClassName"
              :items="storageClasses"
              :loading="storageClassesLoading"
              item-text="name"
              item-value="value"
              label="存储服务提供者"
              :rules="[(v) => !!v || '必须选择提供者']"
              prepend-icon="mdi-wrench"
            ></v-select>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                v-if="operaType === `add`"
                :loading="submitting"
                color="success"
                class="mr-4"
                @click="submit"
              >
                提交
              </v-btn>

              <v-btn
                v-if="operaType === `edit`"
                color="error"
                class="mr-4"
                @click="update"
              >
                删除旧数据并创建新的储存服务
              </v-btn>

              <v-btn color="grey" class="mr-4" @click="back"> 返回 </v-btn>
            </v-card-actions>
          </v-form>
        </v-skeleton-loader>
      </material-card>
      <v-dialog v-model="updateTips" persistent max-width="400">
        <v-card>
          <v-card-title class="headline"> 是否继续更新？ </v-card-title>
          <v-card-text
            >该操作将会删除原有的储存空间，并创建新的储存空间，将会丢失旧数据，请检查无误后继续</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" @click="updateTips = false">
              取消
            </v-btn>
            <v-btn :loading="submitting" color="error darken-1" @click="submit">
              继续
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import MaterialCard from "@components/card/MaterialCard";
import api from "@/api";
import { mapGetters } from "vuex";
import EnvironmentType from "@components/base/EnvironmentType";

export default {
  name: "PersistentStorageDetails",
  components: { EnvironmentType, MaterialCard },
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
      updateTips: false,
      storageClassesLoading: false,
      initLoading: false,
      id: "",
      formData: {
        accessMode: "ReadWriteOnce",
      },
      storageClasses: [],
      accessModes: [
        {
          name: "单节点读写",
          value: "ReadWriteOnce",
        },
        {
          name: "多节点只读",
          value: "ReadOnlyMany",
        },
        {
          name: "多节点读写",
          value: "ReadWriteMany",
        },
      ],
      units: [
        {
          name: "Gi",
          value: "Gi",
        },
        {
          name: "Mi",
          value: "Mi",
        },
        {
          name: "Ki",
          value: "Ki",
        },
      ],
    };
  },
  mounted() {
    this.id = this.$route.params.id || "";
    this.storageClassesLoading = true;
    this.loadStorageClass().finally(() => {
      this.storageClassesLoading = false;
    });
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
          api.persistentStorage
            .create({ ...this.formData, namespaceId: this.currentNamespace.id })
            .then(() => {
              this.$notify({
                group: "default",
                type: "success",
                title: "新增成功",
              });
              this.$router.push({
                name: "PersistentStorageList",
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
          api.persistentStorage
            .update({ ...this.formData, namespaceId: this.currentNamespace.id })
            .then(() => {
              this.$notify({
                group: "default",
                type: "success",
                title: "更新成功",
              });
              this.$router.push({
                name: "PersistentStorageList",
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
    update() {
      this.updateTips = true;
    },
    back() {
      this.$router.push({
        name: "PersistentStorageList",
      });
    },
    loadDetail() {
      api.persistentStorage
        .get(this.currentNamespace.id, this.id)
        .then((res) => {
          this.formData = res.data;
          this.id = res.data.id;
        });
    },
    loadStorageClass() {
      return new Promise((resolve, reject) => {
        api.storageClass
          .list()
          .then((res) => {
            this.storageClasses = res.data || [];
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
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
    validKey(val) {
      if (!val || !/^[a-z0-9_\\-]+$/g.test(val)) {
        return "只能输入小写英文字符和下划线";
      }
      return true;
    },
  },
};
</script>

<style scoped></style>
