<template>
  <v-form ref="form">
    <div class="subtitle">
      <v-icon slot="icon"> mdi-moped </v-icon> 存活探针
    </div>

    <v-switch
      v-model="formData.openLivenessProbe"
      label="启用存活状态检测？"
      prepend-icon="mdi-moped"
    ></v-switch>

    <template v-if="formData.openLivenessProbe">
      <v-scale-transition
        v-for="(item, index) in formData.livenessProbe.probes"
        v-bind:key="`probe-detection-` + index"
      >
        <v-row>
          <v-col cols="12" md="3">
            <v-select
              v-model="item.strategyType"
              :items="detectionMethods"
              item-text="name"
              item-value="value"
              label="探测方式"
              :rules="[(v) => !!v || '请选择探测方式']"
              prepend-icon="mdi-strategy"
            ></v-select>
          </v-col>

          <template v-if="item.strategyType === `HTTPGet`">
            <v-col cols="12" md="3">
              <v-text-field
                label="URL"
                prepend-icon="mdi-link-variant"
                v-model="item.path"
                :rules="[(v) => !!v || '请填写URL']"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                label="Port"
                prepend-icon="mdi-swap-vertical-bold"
                v-model="item.port"
                :rules="[(v) => !!v || '请填写端口号']"
                type="number"
                required
              ></v-text-field>
            </v-col>
          </template>

          <template v-if="item.strategyType === `Exec`">
            <v-col cols="12" md="6">
              <v-text-field
                label="命令"
                prepend-icon="mdi-apple-keyboard-command"
                v-model="item.command"
                :rules="[(v) => !!v || '请填写探测命令']"
                required
              ></v-text-field>
            </v-col>
          </template>

          <template v-if="item.strategyType === `TCPSocket`">
            <v-col cols="12" md="6">
              <v-text-field
                label="Port"
                prepend-icon="mdi-swap-vertical-bold"
                :rules="[(v) => !!v || '请填写端口号']"
                type="number"
                v-model="item.port"
                required
              ></v-text-field>
            </v-col>
          </template>

          <v-col cols="12" md="3">
            <v-btn
              class="mx-2"
              fab
              dark
              small
              color="secondary"
              @click="addLivenessProbe(index)"
            >
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              class="mx-2"
              fab
              dark
              small
              color="warning"
              @click="removeLivenessProbe(index)"
            >
              <v-icon dark>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-scale-transition>

      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            label="探测延迟执行时间"
            prepend-icon="mdi-clock-time-five-outline"
            v-model="formData.livenessProbe.initialDelaySeconds"
            :rules="[(v) => validNumber(v) || '请填写探测延迟执行时间']"
            type="number"
            suffix="秒"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            label="探测超时时间"
            prepend-icon="mdi-clock-time-five-outline"
            v-model="formData.livenessProbe.timeoutSeconds"
            :rules="[(v) => validNumber(v) || '请填写探测超时时间']"
            type="number"
            suffix="秒"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            label="探测频率"
            prepend-icon="mdi-clock-time-five-outline"
            v-model="formData.livenessProbe.periodSeconds"
            :rules="[(v) => validNumber(v) || '请填写探测频率']"
            type="number"
            suffix="秒"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            label="探测成功阈值"
            prepend-icon="mdi-clock-time-five-outline"
            v-model="formData.livenessProbe.successThreshold"
            :rules="[(v) => validNumber(v) || '请填写探测成功阈值']"
            type="number"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="探测失败阈值"
            :rules="[(v) => validNumber(v) || '请填写探测失败阈值']"
            type="number"
            prepend-icon="mdi-clock-time-five-outline"
            v-model="formData.livenessProbe.failureThreshold"
            required
          ></v-text-field>
        </v-col>
      </v-row>
    </template>

    <div class="subtitle">
      <v-icon slot="icon"> mdi-thermometer-plus </v-icon> 就绪探针
    </div>

    <v-switch
      v-model="formData.openReadinessProbe"
      label="启用就绪状态检测？"
      prepend-icon="mdi-moped"
    ></v-switch>

    <template v-if="formData.openReadinessProbe">
      <v-scale-transition
        v-for="(item, index) in formData.readinessProbe.probes"
        v-bind:key="`probe-detection-` + index"
      >
        <v-row>
          <v-col cols="12" md="3">
            <v-select
              v-model="item.strategyType"
              :items="detectionMethods"
              item-text="name"
              item-value="value"
              label="探测方式"
              :rules="[(v) => !!v || '请选择探测方式']"
              prepend-icon="mdi-strategy"
            ></v-select>
          </v-col>

          <template v-if="item.strategyType === `HTTPGet`">
            <v-col cols="12" md="3">
              <v-text-field
                label="URL"
                prepend-icon="mdi-link-variant"
                v-model="item.path"
                :rules="[(v) => !!v || '请填写URL']"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                label="Port"
                prepend-icon="mdi-swap-vertical-bold"
                v-model="item.port"
                :rules="[(v) => !!v || '请填写端口号']"
                type="number"
                required
              ></v-text-field>
            </v-col>
          </template>

          <template v-if="item.strategyType === `Exec`">
            <v-col cols="12" md="6">
              <v-text-field
                label="命令"
                prepend-icon="mdi-apple-keyboard-command"
                v-model="item.command"
                :rules="[(v) => !!v || '请填写探测命令']"
                required
              ></v-text-field>
            </v-col>
          </template>

          <template v-if="item.strategyType === `TCPSocket`">
            <v-col cols="12" md="6">
              <v-text-field
                label="Port"
                prepend-icon="mdi-swap-vertical-bold"
                :rules="[(v) => !!v || '请填写端口号']"
                type="number"
                v-model="item.port"
                required
              ></v-text-field>
            </v-col>
          </template>

          <v-col cols="12" md="3">
            <v-btn
              class="mx-2"
              fab
              dark
              small
              color="secondary"
              @click="addReadinessProbe(index)"
            >
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              class="mx-2"
              fab
              dark
              small
              color="warning"
              @click="removeReadinessProbe(index)"
            >
              <v-icon dark>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-scale-transition>

      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            label="探测延迟执行时间"
            prepend-icon="mdi-clock-time-five-outline"
            v-model="formData.readinessProbe.initialDelaySeconds"
            :rules="[(v) => validNumber(v) || '请填写探测延迟执行时间']"
            type="number"
            suffix="秒"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            label="探测超时时间"
            prepend-icon="mdi-clock-time-five-outline"
            v-model="formData.readinessProbe.timeoutSeconds"
            :rules="[(v) => validNumber(v) || '请填写探测超时时间']"
            type="number"
            suffix="秒"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            label="探测频率"
            prepend-icon="mdi-clock-time-five-outline"
            v-model="formData.readinessProbe.periodSeconds"
            :rules="[(v) => validNumber(v) || '请填写探测频率']"
            type="number"
            suffix="秒"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            label="探测成功阈值"
            prepend-icon="mdi-clock-time-five-outline"
            v-model="formData.readinessProbe.successThreshold"
            :rules="[(v) => validNumber(v) || '请填写探测成功阈值']"
            type="number"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="探测失败阈值"
            :rules="[(v) => validNumber(v) || '请填写探测失败阈值']"
            type="number"
            prepend-icon="mdi-clock-time-five-outline"
            v-model="formData.readinessProbe.failureThreshold"
            required
          ></v-text-field>
        </v-col>
      </v-row>
    </template>
  </v-form>
</template>

<script>
export default {
  name: "ApplicationProbe",
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
  data: () => {
    return {
      isInit: false,
      formData: {},
      detectionMethods: [
        {
          name: "HTTPGet",
          value: "HTTPGet",
        },
        {
          name: "Exec",
          value: "Exec",
        },
        {
          name: "TCPSocket",
          value: "TCPSocket",
        },
      ],
    };
  },
  methods: {
    initValue() {
      console.log(this.value);
      this.isInit = true;
      this.formData = this.value;
      this.isInit = false;
    },
    addReadinessProbe(index) {
      this.formData.readinessProbe.probes.splice(index + 1, 0, {
        strategyType: "HTTPGet",
      });
    },
    removeReadinessProbe(index) {
      if (this.formData.readinessProbe.probes.length === 1) {
        return;
      }
      this.formData.readinessProbe.probes.splice(index, 1);
    },
    addLivenessProbe(index) {
      this.formData.livenessProbe.probes.splice(index + 1, 0, {
        strategyType: "HTTPGet",
      });
    },
    removeLivenessProbe(index) {
      if (this.formData.livenessProbe.probes.length === 1) {
        return;
      }
      this.formData.livenessProbe.probes.splice(index, 1);
    },
    validate() {
      console.log(this.formData);
      return this.$refs.form.validate();
    },
    validNumber(val) {
      if (!val) {
        return "不可为空";
      }
      if (/^0+$/g.test(val)) {
        return "最小值为1";
      } else if (!/^[0-9]+$/g.test(val)) {
        return "只能输入数字";
      }
      return true;
    },
  },
  mounted() {
    if (this.value) {
      this.initValue();
    }
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
