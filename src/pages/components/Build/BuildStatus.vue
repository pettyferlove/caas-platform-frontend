<template>
  <span>
    <template v-if="!state">
      <v-progress-circular :value="0" color="blue-grey"></v-progress-circular>
      暂无构建记录
    </template>
    <template v-if="state === 'send'">
      <v-progress-circular
        indeterminate
        :value="100"
        color="blue-grey"
      ></v-progress-circular>
      已发送任务
    </template>
    <template v-if="state === 'success'">
      <v-progress-circular :value="100" color="green"></v-progress-circular>
      构建成功
    </template>
    <template v-if="state === 'fail'">
      <v-progress-circular :value="100" color="orange"></v-progress-circular>
      构建失败
    </template>
    <template v-if="state === 'stoped'">
      <v-progress-circular :value="100" color="orange"></v-progress-circular>
      手动中止
    </template>
    <template v-if="state === 'building'">
      <v-progress-circular
        :value="100"
        indeterminate
        color="orange"
      ></v-progress-circular>
      构建中
    </template>
  </span>
</template>

<script>
export default {
  name: "BuildStatus",
  props: {
    state: {
      required: true,
      type: String,
    },
  },
};
</script>
