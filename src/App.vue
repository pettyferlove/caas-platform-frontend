<template>
  <div id="app">
    <router-view></router-view>
    <notifications
      style="top: 100px"
      width="400"
      position="top center"
      group="default"
      loading-animation-name="right-to-left"
    >
      <template slot="body" slot-scope="props">
        <div :class="['notifications-wrapper', props.item.type]">
          <div
            class="notifications-wrapper-border"
            :style="{
              'animation-duration': props.item.length + 'ms',
              'animation-name': props.item.loadingAnimationName,
            }"
          ></div>
          <div class="notifications-wrapper-content">
            {{ props.item.title }}
          </div>
          <div class="notifications-wrapper-action">
            <v-btn icon color="white" @click="props.close">
              <v-icon>mdi-close-thick</v-icon>
            </v-btn>
          </div>
        </div>
      </template>
    </notifications>
  </div>
</template>
<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
<style lang="scss">
@keyframes right-to-left {
  0% {
    right: 0;
  }
  100% {
    right: 100%;
  }
}

@keyframes left-to-right {
  0% {
    left: 0;
  }
  100% {
    left: 100%;
  }
}

.notifications-wrapper {
  bottom: 0;
  display: flex;
  font-size: 0.875rem;
  justify-content: center;
  left: 0;
  pointer-events: auto;
  background-color: #2196f3 !important;
  right: 0;
  top: 0;
  width: 100%;
  padding: 0;
  align-items: center;
  position: relative;
  &-border {
    opacity: 0.16;
    border-style: solid;
    border-width: 4px 0 4px 0;
    content: "";
    position: absolute;
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    top: 0;
    left: 0;
    right: 0;
    animation: left-to-right 5s linear forwards;
  }
  &-content {
    flex-grow: 1;
    font-size: 0.875rem;
    font-weight: 400;
    letter-spacing: 0.0178571429em;
    line-height: 1.25rem;
    margin-right: auto;
    padding: 14px 16px;
    text-align: initial;
    color: white;
  }
  &-action {
    align-items: center;
    align-self: center;
    display: flex;
    margin-right: 8px;
  }
  &.error {
    background-color: #f44336 !important;
    border-color: #e57373 !important;
  }
  &.warn {
    background-color: #ff9800 !important;
    border-color: #ffb74d !important;
  }
  &.success {
    background-color: #4caf50 !important;
    border-color: #81c784 !important;
  }
}
</style>
