<template>
  <v-form ref="form">
    <v-select
      v-model="formData.imagePullStrategy"
      :items="pullStrategy"
      item-text="name"
      item-value="value"
      label="镜像拉取策略"
      prepend-icon="mdi-form-select"
    ></v-select>

    <v-text-field
      v-model="formData.instancesNumber"
      label="实例数量"
      required
      prepend-icon="mdi-instrument-triangle"
    ></v-text-field>

    <v-subheader> 环境变量 </v-subheader>
    <v-scale-transition
      v-for="(item, index) in formData.localEnvironmentVariable"
      v-bind:key="`environment-variable-` + index"
    >
      <v-row>
        <v-col cols="12" md="5">
          <v-text-field
            label="名称"
            v-model="item.key"
            required
            prepend-icon="mdi-swap-vertical-bold"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="5">
          <v-text-field
            label="值"
            v-model="item.value"
            required
            prepend-icon="mdi-swap-vertical-bold"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-btn
            class="mx-2"
            fab
            dark
            small
            color="secondary"
            @click="addEnvironmentVariable(index)"
          >
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
          <v-btn
            class="mx-2"
            fab
            dark
            small
            color="warning"
            @click="removeEnvironmentVariable(index)"
          >
            <v-icon dark>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-scale-transition>

    <v-subheader> 储存挂载 </v-subheader>
    <template v-for="(item, index) in formData.mounts">
      <v-scale-transition v-bind:key="`volume-` + index">
        <v-row>
          <v-col cols="12" md="2">
            <v-text-field
              label="名称"
              v-model="item.mountName"
              required
              @input="checkNull(item)"
              prepend-icon="mdi-swap-vertical-bold"
              :rules="[
                item.isNotNull
                  ? (v) => {
                      return validKey(v) || '请填写名称';
                    }
                  : (v) => {
                      return true;
                    },
              ]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="2">
            <v-select
              v-model="item.volumeType"
              :items="volumeTypes"
              item-text="name"
              item-value="value"
              label="挂载类型"
              placeholder="选择一个挂载类型"
              clearable
              @change="checkNull(item)"
              :rules="[
                item.isNotNull
                  ? (v) => {
                      return (v && v.length > 0) || '请选择挂载类型';
                    }
                  : (v) => {
                      return true;
                    },
              ]"
              prepend-icon="mdi-form-select"
            ></v-select>
          </v-col>

          <v-col
            cols="12"
            md="3"
            v-if="item.volumeType === `PersistentVolumeClaim`"
          >
            <v-select
              v-model="item.persistentStorageId"
              :items="persistentStorages"
              item-text="name"
              item-value="id"
              :loading="persistentStorageLoading"
              label="选择持久化存储"
              clearable
              @change="checkNull(item)"
              :rules="[
                item.isNotNull
                  ? (v) => {
                      return (v && v.length > 0) || '请选择持久化存储';
                    }
                  : (v) => {
                      return true;
                    },
              ]"
              prepend-icon="mdi-ghost"
            ></v-select>
          </v-col>

          <v-col cols="12" md="3" v-if="item.volumeType === `HostPath`">
            <v-text-field
              label="路径磁盘路径"
              v-model="item.volumePath"
              required
              @input="checkNull(item)"
              :rules="[
                item.isNotNull
                  ? (v) => {
                      return (v && v.length > 0) || '请填写主机磁盘路径';
                    }
                  : (v) => {
                      return true;
                    },
              ]"
              prepend-icon="mdi-swap-vertical-bold"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3" v-if="item.volumeType === `ConfigMap`">
            <v-select
              v-model="item.configId"
              :items="configs"
              item-text="fileName"
              item-value="id"
              :loading="nodeLoading"
              label="选择配置"
              clearable
              @change="checkNull(item)"
              placeholder="选择应用的配置文件"
              :rules="[
                item.isNotNull
                  ? (v) => {
                      return (v && v.length > 0) || '请选择配置文件';
                    }
                  : (v) => {
                      return true;
                    },
              ]"
              prepend-icon="mdi-ghost"
            ></v-select>
          </v-col>
          <v-col
            cols="12"
            :md="!item.volumeType || item.volumeType === `EmptyDir` ? 6 : 3"
          >
            <v-text-field
              label="挂载路径"
              v-model="item.mountPath"
              required
              @input="checkNull(item)"
              :rules="[
                item.isNotNull
                  ? (v) => {
                      return (v && v.length > 0) || '请填写挂载路径';
                    }
                  : (v) => {
                      return true;
                    },
              ]"
              prepend-icon="mdi-swap-vertical-bold"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="2">
            <v-btn
              class="mx-2"
              fab
              dark
              small
              color="secondary"
              @click="addMount(index)"
            >
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              class="mx-2"
              fab
              dark
              small
              color="warning"
              @click="removeMount(index)"
            >
              <v-icon dark>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-scale-transition>
      <v-scale-transition v-bind:key="`alert-` + index">
        <v-row v-if="item.volumeType !== `ConfigMap`">
          <v-col cols="12">
            <v-alert dense style="padding: 0" border="left" type="warning">
              非配置文件类型的<strong>挂载路径</strong>请勿设置为<strong
                >工作目录（WorkerDir）</strong
              >
            </v-alert>
          </v-col>
        </v-row>
      </v-scale-transition>
    </template>

    <v-switch
      v-model="formData.customResource"
      label="自定义运行资源要求"
      prepend-icon="mdi-dresser-outline"
      :true-value="1"
      :false-value="0"
    ></v-switch>

    <template v-if="formData.customResource === 1">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.requestCpu"
            label="CPU最低需求"
            required
            prepend-icon="mdi-cpu-64-bit"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.limitCpu"
            label="CPU最高要求"
            required
            prepend-icon="mdi-cpu-64-bit"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.requestMemory"
            label="内存最低要求"
            required
            prepend-icon="mdi-memory"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.limitMemory"
            label="内存最高要求"
            required
            prepend-icon="mdi-memory"
          ></v-text-field>
        </v-col>
      </v-row>
    </template>

    <v-switch
      v-model="formData.autoScale"
      label="是否开始自动伸缩"
      prepend-icon="mdi-scale"
      :true-value="1"
      :false-value="0"
    ></v-switch>

    <template v-if="formData.autoScale === 1">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field label="最小实例数量" required></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field label="最大实例数量" required></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field label="CPU阈值" required></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field label="内存阈值" required></v-text-field>
        </v-col>
      </v-row>
    </template>

    <v-row>
      <v-col cols="12" md="6">
        <v-select
          v-model="formData.strategyType"
          :items="strategyType"
          item-text="name"
          item-value="value"
          label="更新策略"
          prepend-icon="mdi-strategy"
        ></v-select>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.revisionHistoryLimit"
          label="更新历史最大保存记录"
          required
          prepend-icon="mdi-history"
        ></v-text-field>
      </v-col>
    </v-row>

    <template v-if="formData.strategyType === `RollingUpdate`">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.maxSurge"
            label="升级过程中最多可以比原先设置多出的POD数量"
            prepend-icon="mdi-google-podcast"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.maxUnavaible"
            label="升级过程中最多有多少个POD处于无法提供服务的状态"
            prepend-icon="mdi-google-podcast"
          ></v-text-field>
        </v-col>
      </v-row>
    </template>

    <v-row>
      <v-col>
        <v-select
          v-model="formData.node"
          :items="nodes"
          item-text="name"
          item-value="value"
          :loading="nodeLoading"
          chips
          clearable
          dense
          persistent-hint
          label="选择部署节点"
          placeholder="指定应用部署到某一个节点，默认为随机分配"
          prepend-icon="mdi-ghost"
        ></v-select>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import api from "@/api";
import utils from "@/libs/utils";

export default {
  name: "ApplicationAdvanced",
  props: {
    value: [Object],
    operaType: {
      type: String,
      default: "add",
    },
    namespace: {
      type: Object,
      required: true,
    },
  },
  watch: {
    value() {
      this.initValue();
    },
    formData: {
      deep: true,
      handler: function (val) {
        if (!this.isInit) {
          this.$emit("change", val);
        }
      },
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  data: () => {
    return {
      formData: {},
      isInit: false,
      nodeLoading: false,
      configLoading: false,
      persistentStorageLoading: false,
      nodes: [],
      configs: [],
      persistentStorages: [],
      pullStrategy: [
        {
          name: "不存在镜像则拉取",
          value: "IfNotPresent",
        },
        {
          name: "每次都拉取最新镜像",
          value: "Always",
        },
        {
          name: "不拉取最近镜像",
          value: "Never",
        },
      ],
      strategyType: [
        {
          name: "重建",
          value: "Recreate",
        },
        {
          name: "滚动更新",
          value: "RollingUpdate",
        },
      ],
      volumeTypes: [
        {
          name: "配置文件",
          value: "ConfigMap",
        },
        {
          name: "空目录",
          value: "EmptyDir",
        },
        {
          name: "主机目录",
          value: "HostPath",
        },
        {
          name: "持久化存储",
          value: "PersistentVolumeClaim",
        },
      ],
    };
  },
  methods: {
    initValue() {
      this.isInit = true;
      this.formData = this.value;
      this.isInit = false;
    },
    validate() {
      return this.$refs.form.validate();
    },
    loadNode() {
      return new Promise((resolve, reject) => {
        api.node
          .list()
          .then((res) => {
            let t = res.data || [];
            this.nodes = [];
            t.forEach((i) => {
              this.nodes.push({
                name: i.hostName,
                value: i.hostName,
              });
            });
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    loadConfig() {
      return new Promise((resolve, reject) => {
        api.config
          .select(this.namespace.id)
          .then((res) => {
            this.configs = res.data || [];
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    loadPersistentStorage() {
      return new Promise((resolve, reject) => {
        api.persistentStorage
          .select(this.namespace.id)
          .then((res) => {
            this.persistentStorages = res.data || [];
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    addEnvironmentVariable(index) {
      this.formData.localEnvironmentVariable.splice(index + 1, 0, {});
    },
    removeEnvironmentVariable(index) {
      if (this.formData.localEnvironmentVariable.length === 1) {
        return;
      }
      this.formData.localEnvironmentVariable.splice(index, 1);
    },
    addMount(index) {
      this.formData.mounts.splice(index + 1, 0, {});
    },
    removeMount(index) {
      if (this.formData.mounts.length === 1) {
        return;
      }
      this.formData.mounts.splice(index, 1);
    },
    checkNull(object) {
      delete object.isNotNull;
      object.isNotNull = utils.isNotNull(object);
    },
    validKey(val) {
      if (val && !/^[a-z0-9_\\-]+$/g.test(val)) {
        return "只能输入小写英文字符和下划线";
      }
      return true;
    },
  },
  mounted() {
    if (this.value) {
      this.initValue();
    }
    this.nodeLoading = true;
    this.loadNode().finally(() => {
      this.nodeLoading = false;
    });
    this.configLoading = true;
    this.loadConfig().finally(() => {
      this.configLoading = false;
    });
    this.persistentStorageLoading = true;
    this.loadPersistentStorage().finally(() => {
      this.persistentStorageLoading = false;
    });
  },
};
</script>

<style scoped></style>
