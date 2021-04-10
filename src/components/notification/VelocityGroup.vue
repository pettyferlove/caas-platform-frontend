<template>
  <transition-group
    :css="false"
    @enter="enter"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <slot />
  </transition-group>
</template>
<script>
export default {
  name: "VelocityGroup",
  methods: {
    enter(el, complete) {
      this.$emit("enter", { el, complete });
    },
    leave(el, complete) {
      this.$emit("leave", { el, complete });
    },
    afterLeave() {
      // eslint-disable-next-line vue/custom-event-name-casing
      this.$emit("afterLeave");
    },
  },
};
</script>
