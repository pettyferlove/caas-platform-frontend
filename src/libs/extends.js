/**
 * Vue全局方法扩展
 * @param Vue
 * @param options
 */
export default {
  install(Vue) {
    /**
     * 角色判断
     * @param role
     * @return Boolean True有权限False无权限
     */
    Vue.prototype.hasRole = function (role) {
      let r = role.split(",");
      let roles = this.$store.getters.getRoles;
      let intersection = roles.filter(function (val) {
        return r.indexOf(val) > -1;
      });
      return intersection.length > 0;
    };
    /**
     * 资源标记判断
     * @param permission
     * @returns {boolean}
     */
    Vue.prototype.hasPermission = function (permission) {
      let p = permission.split(",");
      let permissions = this.$store.getters.getPermissions();
      let intersection = permissions.filter(function (val) {
        return p.indexOf(val) > -1;
      });
      return intersection.length > 0;
    };
  },
};
