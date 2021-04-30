<template>
  <span>
    <template v-if="!state">
      <v-progress-circular :value="0" color="blue-grey"></v-progress-circular>
      暂无运行状态
    </template>
    <template v-if="state === 'preparing'">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      准备中
    </template>
    <template v-if="state === 'error'">
      <v-progress-circular :value="100" color="red"></v-progress-circular>
      运行错误
    </template>
    <template v-if="state === 'stopped'">
      <v-progress-circular :value="100" color="amber"></v-progress-circular>
      已停止
    </template>
    <template v-if="state === 'stopping'">
      <v-progress-circular indeterminate color="amber"></v-progress-circular>
      停止中
    </template>
    <template v-if="state === 'updating'">
      <v-progress-circular
        indeterminate
        color="deep-orange lighten-2"
      ></v-progress-circular>
      更新中
    </template>
    <template v-if="state === 'scaling'">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      扩容中
    </template>
    <template v-if="state === 'running'">
      <v-progress-circular :value="100" color="green"></v-progress-circular>
      运行中
    </template>
  </span>
</template>

<script>
export default {
  name: "RunStatus",
  props: {
    state: {
      required: true,
    },
  },
};
</script>
