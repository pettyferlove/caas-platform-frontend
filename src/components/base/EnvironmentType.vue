<template>
  <span>
    <v-select
      :disabled="disabled"
      :dense="dense"
      :outlined="outlined"
      v-if="type === 'select'"
      v-model="childValue"
      :items="environmentTypes"
      item-text="name"
      item-value="value"
      :label="label"
      :prepend-icon="hideIcon ? `` : `mdi-wrench`"
      @change="changeValue"
    ></v-select>
    <template v-else>
      <v-chip color="primary" outlined v-if="childValue === 1" class="ma-2">
        开发环境
      </v-chip>
      <v-chip color="green" outlined v-if="childValue === 2" class="ma-2">
        测试环境
      </v-chip>
      <v-chip color="orange" outlined v-if="childValue === 9" class="ma-2">
        生产环境
      </v-chip>
    </template>
  </span>
</template>

<script>
export default {
  name: "EnvironmentType",
  props: {
    value: [Number],
    type: {
      type: String,
      default: "select",
    },
    dense: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    hideIcon: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "环境类型",
    },
  },
  watch: {
    value() {
      this.initValue();
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  data: () => {
    return {
      childValue: "",
      isInit: false,
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
  methods: {
    initValue() {
      this.isInit = true;
      this.childValue = this.value;
      this.isInit = false;
    },
    changeValue(value) {
      if (!this.isInit) {
        this.$emit("change", value);
      }
    },
  },
  mounted() {
    if (this.value) {
      this.initValue();
    }
  },
};
</script>

<style scoped></style>
