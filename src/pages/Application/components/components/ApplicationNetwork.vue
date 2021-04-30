<template>
  <v-form ref="form">
    <v-row>
      <v-col>
        <v-select
          v-model="formData.network"
          :items="networkSelects"
          item-text="name"
          chips
          dense
          persistent-hint
          item-value="value"
          label="网络选项"
          prepend-icon="mdi-wrench"
        ></v-select>
      </v-col>
    </v-row>
    <template
      v-if="formData.network === `internal` || formData.network === `external`"
    >
      <v-select
        v-model="formData.networkType"
        :items="networkTypes"
        item-text="name"
        item-value="value"
        label="网络类型"
        placeholder="指定网络类型，默认使用ClusterIP，该类型无法被外部访问"
        prepend-icon="mdi-phone-voip"
        persistent-hint
      ></v-select>

      <v-select
        v-model="formData.externalIp"
        :items="IPs"
        :loading="ipLoading"
        item-text="name"
        item-value="value"
        multiple
        chips
        dense
        label="访问IP"
        placeholder="指定应用外部访问IP"
        prepend-icon="mdi-phone-voip"
        persistent-hint
        :rules="[
          formData.networkType === 'LoadBalancer'
            ? (v) => {
                return v.length > 0 || '请选择访问IP';
              }
            : (v) => {
                return true;
              },
        ]"
      ></v-select>
      <v-row
        v-for="(item, index) in formData.ports"
        v-bind:key="`ports-` + index"
      >
        <v-col cols="12" md="4">
          <v-select
            v-model="item.protocol"
            :items="protocolType"
            item-text="name"
            item-value="value"
            label="通信协议"
            :rules="[(v) => !!v || '请选择通信协议']"
            required
            prepend-icon="mdi-protocol"
          ></v-select>
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            label="访问端口"
            v-model="item.port"
            :rules="[(v) => !!v || '请指定访问端口']"
            required
            prepend-icon="mdi-swap-vertical-bold"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            label="目标端口"
            v-model="item.targetPort"
            :rules="[(v) => !!v || '请指定目标端口']"
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
            @click="addPort(index)"
          >
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
          <v-btn
            class="mx-2"
            fab
            dark
            small
            color="warning"
            @click="removePort(index)"
          >
            <v-icon dark>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </v-form>
</template>

<script>
import api from "@/api";
export default {
  name: "ApplicationNetwork",
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
      ipLoading: false,
      protocolType: [
        {
          name: "TCP",
          value: "TCP",
        },
        {
          name: "UDP",
          value: "UDP",
        },
      ],
      networkSelects: [
        {
          name: "无",
          value: "none",
        },
        {
          name: "内部服务",
          value: "internal",
        },
        {
          name: "外部服务",
          value: "external",
        },
      ],
      networkTypes: [
        {
          name: "NodePort",
          value: "NodePort",
        },
        {
          name: "ClusterIP",
          value: "ClusterIP",
        },
        {
          name: "LoadBalancer",
          value: "LoadBalancer",
        },
      ],
      IPs: [],
    };
  },
  methods: {
    initValue() {
      this.isInit = true;
      this.formData = this.value;
      this.isInit = false;
    },
    validate() {
      if (this.formData.ports.length < 1) {
        return false;
      }
      return this.$refs.form.validate();
    },
    loadNode() {
      return new Promise((resolve, reject) => {
        api.node
          .list()
          .then((res) => {
            let t = res.data || [];
            this.IPs = [];
            t.forEach((i) => {
              this.IPs.push({
                name: i.ip,
                value: i.ip,
              });
            });
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    addPort(index) {
      this.formData.ports.splice(index + 1, 0, { protocol: "TCP" });
    },
    removePort(index) {
      if (this.formData.ports.length === 1) {
        return;
      }
      this.formData.ports.splice(index, 1);
    },
  },
  mounted() {
    if (this.value) {
      this.initValue();
    }
    this.ipLoading = true;
    this.loadNode().finally(() => {
      this.ipLoading = false;
    });
  },
};
</script>

<style scoped></style>
