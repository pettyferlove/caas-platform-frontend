/**
 * @author Pettyfer
 * @see Vue 页面加载进度条组件
 */
import LoadingBar from "./LoadingBar.vue";
import Vue from "vue";

let loadingBarInstance;
let timer;
let color = "#1d8ce0";
let errorColor = "#ed3f14";
let height = 2;
/**
 * 创建组件实例
 * @param props 初始化参数
 * @return {*}
 */
LoadingBar.createInstance = (props) => {
  const _props = props || {};

  const ComponentInstance = new Vue({
    data: _props,
    render(h) {
      return h(LoadingBar, {
        props: _props,
      });
    },
  });

  // 手动挂在元素
  const component = ComponentInstance.$mount();
  document.body.appendChild(component.$el);
  const vpLoadingBar = ComponentInstance.$children[0];

  return {
    update(options) {
      if ("percentWidth" in options) {
        vpLoadingBar.percentWidth = options.percentWidth;
      }
      if ("status" in options) {
        vpLoadingBar.status = options.status;
      }
      if ("show" in options) {
        vpLoadingBar.show = options.show;
      }
    },
    component: vpLoadingBar,
    // 销毁组件
    destroy() {
      document.body.removeChild(
        document.getElementsByClassName("loading-bar")[0]
      );
    },
  };
};

// 获取组件实例
function getLoadingBarInstance() {
  loadingBarInstance =
    loadingBarInstance ||
    LoadingBar.createInstance({
      color: color,
      errorColor: errorColor,
      barHeight: height,
    });
  return loadingBarInstance;
}

function update(options) {
  let instance = getLoadingBarInstance();
  instance.update(options);
}

function hide() {
  setTimeout(() => {
    update({
      show: false,
    });
    setTimeout(() => {
      update({
        percent: 0,
      });
    }, 200);
  }, 800);
}

function clearTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

export default {
  start() {
    if (timer) return;
    let percent = 0;
    update({
      percentWidth: percent,
      status: true,
      show: true,
    });

    timer = setInterval(() => {
      percent += Math.floor(Math.random() * 3 + 5);
      if (percent > 80) {
        clearTimer();
      }
      update({
        percentWidth: percent,
        status: true,
        show: true,
      });
    }, 200);
  },
  update(percent) {
    clearTimer();
    update({
      percentWidth: percent,
      status: true,
      show: true,
    });
  },
  finish() {
    clearTimer();
    update({
      percentWidth: 100,
      status: true,
      show: true,
    });
    hide();
  },
  error() {
    clearTimer();
    update({
      percentWidth: 100,
      status: false,
      show: true,
    });
    hide();
  },
  config(options) {
    if (options.color) {
      color = options.color;
    }
    if (options.failedColor) {
      errorColor = options.failedColor;
    }
    if (options.height) {
      height = options.height;
    }
  },
  destroy() {
    clearTimer();
    let instance = getLoadingBarInstance();
    loadingBarInstance = null;
    instance.destroy();
  },
};
