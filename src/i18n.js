import Vue from "vue";
import VueI18n from "vue-i18n";

import en from "vuetify/lib/locale/en";
import zh_cn from "vuetify/lib/locale/zh-Hans";
// eslint-disable-next-line no-unused-vars
import zh_tw from "vuetify/lib/locale/zh-Hant";

Vue.use(VueI18n);

const messages = {
  en: {
    ...require("@/locales/en.json"),
    $vuetify: en,
  },
  zh_cn: {
    ...require("@/locales/zh_cn.json"),
    $vuetify: zh_cn,
  },
};

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || "zh_cn",
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "zh_cn",
  messages,
});
