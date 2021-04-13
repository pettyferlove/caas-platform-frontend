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
    <v-row
      v-for="(item, index) in formData.localEnvironmentVariable"
      v-bind:key="`environment-variable-` + index"
    >
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
export default {
  name: "ApplicationAdvanced",
  props: {
    value: [Object],
    operaType: {
      type: String,
      default: "add",
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
      nodes: [],
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
    addEnvironmentVariable(index) {
      this.formData.localEnvironmentVariable.splice(index + 1, 0, {});
    },
    removeEnvironmentVariable(index) {
      if (this.formData.localEnvironmentVariable.length === 1) {
        return;
      }
      this.formData.localEnvironmentVariable.splice(index, 1);
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
  },
};
</script>

<style scoped></style>
