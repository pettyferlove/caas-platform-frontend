import Notifications from "./Notifications";
import { events } from "./events";

const Notify = {};

Notify.install = (Vue, params = {}) => {
  if (Notify.installed) {
    return;
  }
  Notify.installed = true;
  Notify.params = params;

  Vue.component(Notifications.name, Notifications);
  const notify = (params) => {
    if (typeof params === "string") {
      params = { title: "", text: params };
    }
    if (typeof params === "object") {
      events.$emit("add", params);
    }
  };
  notify.close = function (id) {
    events.$emit("close", id);
  };

  notify.closeAll = function () {
    events.$emit("close-all");
  };

  Vue.prototype.$notify = notify;
  Vue.notify = notify;
};

export default Notify;
