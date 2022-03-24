const validate = {
  /**
   * 手机号码规则
   * @param rule
   * @param value
   * @param callback
   * @returns {*}
   */
  telPhone: function (rule, value, callback) {
    //手机只校验规则，不校验必填
    if (value && value.length > 0) {
      if (!/^[1][3-9][0-9]{9}$/.test(value)) {
        return callback(new Error("不是有效的手机号码！"));
      }
    }
    callback();
  },

  email: function (rule, value, callback) {
    //邮箱只校验规则，不校验必填
    // eslint-disable-next-line
    let emailReg = /^([a-zA-Z0-9]+[_]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (value && value.length > 0) {
      if (!emailReg.test(value)) {
        return callback(new Error("不是有效的email地址！"));
      }
    }
    callback();
  },

  /**
   * 电话号码规则
   * @param rule
   * @param value
   * @param callback
   * @returns {*}
   */
  tel: function (rule, value, callback) {
    if (
      value &&
      value.length > 0 &&
      !/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value)
    ) {
      return callback(new Error("固定电话有误，请重填"));
    }
    callback();
  },

  /**
   * 固定电话与手机号码混合检验
   * @param rule
   * @param value
   * @param callback
   * @returns {*}
   */
  telOrPhone: function (rule, value, callback) {
    if (value && value.length > 0) {
      if (
        !/^[1][3-9][0-9]{9}$/.test(value) &&
        !/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value)
      ) {
        if (!/^[1][3-9][0-9]{9}$/.test(value)) {
          return callback(new Error("不是有效的手机号码！"));
        } else {
          return callback(new Error("固定电话有误，请重填"));
        }
      }
    }
    callback();
  },
  /**
   * 校验空值内容
   * @param rule
   * @param value
   * @param callback
   * @returns {*}
   */
  nullValue: function (rule, value, callback) {
    if (value && value.length === 0) {
      return callback(new Error("填写内容不能为空"));
    }
    callback();
  },
  /**
   * 校验只能输入中文字符
   * @param rule
   * @param value
   * @param callback
   * @returns {*}
   */
  chinese: function (rule, value, callback) {
    if (value && /[^\u4E00-\u9FA5]/g.test(value)) {
      return callback(new Error("含有非中文字符"));
    }
    callback();
  },
  /**
   * 校验不能输入中文字符
   * @param rule
   * @param value
   * @param callback
   * @returns {*}
   */
  hasChinese: function (rule, value, callback) {
    if (value && !/[^\u4E00-\u9FA5]/g.test(value)) {
      return callback(new Error("含有中文字符"));
    }
    callback();
  },
  /**
   * 校验只能输入数字
   * @param rule
   * @param value
   * @param callback
   * @returns {*}
   */
  number: function (rule, value, callback) {
    if (value !== "" && !/^[0-9]*$/.test(value)) {
      return callback(new Error("请输入数字"));
    }
    callback();
  },

  /**
   * 校验只能输入金额
   * @param rule
   * @param value
   * @param callback
   * @returns {*}
   * 可匹配到逗号的金额表达式 ^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$
   * 匹配到小数点后两位
   */
  money: function (rule, value, callback) {
    if (value && !/^([1-9]\d{0,9}|0)([.]?|(\.\d{0,6})?)$/.test(value)) {
      return callback(new Error("金额格式有误"));
    }
    callback();
  },
  /**
   * 校验不能含有特殊符号
   * @param rule
   * @param value
   * @param callback
   * @returns {*}
   */
  valihasSpecialStrCode: function (rule, value, callback) {
    if (
      value &&
      /[`~!@#$^&*()=|{}':;',\\[\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]/.test(
        value
      )
    ) {
      return callback(new Error("含有特殊字符"));
    }
    callback();
  },

  /**
   * 校验不能含有特殊符号,允许（）() 、 - · ：
   * @param rule
   * @param value
   * @param callback
   * @returns {*}
   */
  othersSpecialStr: function (rule, value, callback) {
    if (
      value &&
      /[`~!@#$^&*=|{}':;',\\[\].<>/?~！@#￥……&*|{}【】‘；”“'。，？]/.test(value)
    ) {
      return callback(new Error("含有特殊字符"));
    }
    callback();
  },

  /**
   * 校验日期格式 可用-或.间隔
   * @param rule
   * @param value
   * @param callback
   * @returns {*}
   */
  date: function (rule, value, callback) {
    if (value && !/\d{4}(\\-|\/|.)\d{1,2}\1\d{1,2}/.test(value)) {
      return callback(new Error("输入日期格式有误"));
    }
    callback();
  },
  /**
   * 校验比例
   * @param rule
   * @param value
   * @param callback
   * @returns {*}
   * 可加%号
   */
  pencent: function (rule, value, callback) {
    if ((value && parseInt(value) > 100) || parseInt(value) < 0) {
      return callback(new Error("输入比例应在0到100内"));
    } else if (value && !/^\d+\.?(\d{1,4})?%?$/.test(value)) {
      return callback(new Error("输入比例格式有误"));
    }
    callback();
  },
  key: function (rule, value, callback) {
    if (value && !/^([a-z_]{1})([\w]*)$/g.test(value)) {
      return callback(new Error("只能输入英文字符和下划线"));
    }
    callback();
  },
  numberAndLetters: function (rule, value, callback) {
    if (value && !/^[A-Za-z0-9]+$/g.test(value)) {
      return callback(new Error("只能输入字母或数字"));
    }
    callback();
  },
};

export default {
  install(Vue) {
    Vue.prototype.$validate = validate;
  },
};
