<template>
  <transition name="fade">
    <div class="loading-bar" :style="outerStyles" v-show="show">
      <div :class="innerClasses" :style="innerStyles"></div>
    </div>
  </transition>
</template>

<style></style>

<script>
export default {
  name: "LoadingBar",
  props: {
    color: {
      type: String,
      default: "#1d8ce0",
    },
    errorColor: {
      type: String,
      default: "#ed3f14",
    },
    barHeight: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      status: true,
      percentWidth: 0,
      show: true,
    };
  },
  computed: {
    // Bar外层Style
    outerStyles() {
      return {
        height: `${this.barHeight}px`,
      };
    },
    // Bar内层Class
    innerClasses() {
      return ["loading-bar-inner"];
    },
    // Bar内层Style
    innerStyles() {
      let style = {
        width: `${this.percentWidth}%`,
        height: `${this.barHeight}px`,
      };
      if (this.status) {
        style.backgroundColor = this.color;
      } else {
        style.backgroundColor = this.errorColor;
      }
      return style;
    },
  },
};
</script>
<style lang="sass">
.loading-bar
  width: 100%
  position: fixed
  top: 0
  left: 0
  right: 0
  z-index: 2000
  .loading-bar-inner
    transform: translate3d(-0.6%, 0px, 0px)
    transition: all 200ms ease 0s
    box-shadow: 0 1px 2px 1px rgba(0, 0, 0, .08), 0 0 12px 0 rgba(0, 0, 0, .08)
</style>
