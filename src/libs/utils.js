import { getLocalStorage, setLocalStorage } from "@/libs/localStorage";

let utils = {};

utils.updateOpenTags = function (_state, _name = "", _tag) {
  // 判断该页面是否已经打开过
  let isOpen = false;
  _state.forEach((item) => {
    if (item.name === _tag.name) {
      isOpen = true;
    }
  });
  if (!isOpen) {
    _state.push(_tag);
    // 保存至本地
    setLocalStorage({
      name: _name,
      content: JSON.stringify(_state),
    });
  }
};

utils.getOpenTags = function (_name = "") {
  return getLocalStorage({ name: _name });
};

utils.deepClone = function (obj) {
  let _obj = JSON.stringify(obj);
  return JSON.parse(_obj);
};

utils.updateRouteMeta = function (_state, _meta) {
  let index = 0;
  for (let meta of _state) {
    if (meta.componentName === _meta.componentName) {
      _state.splice(index, 1);
    }
    index++;
  }
  _state.push(_meta);
  setLocalStorage({ name: "routeMeta", content: JSON.stringify(_state) });
};

utils.getRouteMeta = function () {
  return getLocalStorage({ name: "routeMeta" });
};

/**
 * 生成GUID
 * @return {string}
 * @see https://baike.baidu.com/item/GUID/3352285
 */
utils.guid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

utils.checkStrong = (value) => {
  let modes = 0;
  if (value) {
    //正则表达式验证符合要求的
    if (value.length < 1) return modes;
    if (/\d/.test(value)) modes++; //数字
    if (/[a-z]/.test(value)) modes++; //小写
    if (/[A-Z]/.test(value)) modes++; //大写
    if (/\W/.test(value)) modes++; //特殊字符

    //逻辑处理
    switch (modes) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 3:
      case 4:
        return value.length < 12 ? 3 : 4;
    }
  }
  return modes;
};
/**
 * @author Petty
 * 判断token是否过期
 */
utils.isTokenExpired = () => {
  let expiredTime = getLocalStorage({ name: "expires_time" }) * 1000;
  let saveTime = getLocalStorage({ name: "save_time" });
  let nowTime = new Date().getTime();
  return !(saveTime + expiredTime - nowTime > 5 * 60 * 1000);
};

/**
 * 计算面包屑需要使用的Router List
 * @param result
 * @param path
 * @param list
 */
utils.calcList = (result, path, list) => {
  list.forEach(($router) => {
    let sp = "/";
    if ($router.breadcrumb) {
      let _tempObj = {
        title: $router.meta.title,
        name: $router.name,
        path:
          "/" +
          (path + sp + $router.path)
            .split("/")
            .filter((i) => i !== "")
            .join("/"),
      };
      result.push(_tempObj);
    }
    if ($router.children) {
      utils.calcList(result, path + sp + $router.path, $router.children);
    }
  });
};

/**
 * 计算可以被访问的RouteName以供动态路由计算是否需要加载
 * @param menu
 * @param result
 * @returns {*}
 */
utils.calcAuthorityRouteNames = (menu, result) => {
  menu.forEach((node) => {
    let isChild = false;
    if (node.children) {
      isChild = node.children.length !== 0;
    }
    if (node.visitType === 1) {
      result.push(node.routeName);
    }
    if (isChild) {
      utils.calcAuthorityRouteNames(node.children, result);
    }
  });
  return result;
};

utils.loadRouter = (routes, routeNames) => {
  let result = [];
  routes.forEach((route) => {
    let isChild = false;
    if (route.children) {
      isChild = route.children.length !== 0;
    }
    if (isChild) {
      result.push({
        ...route,
        children: utils.loadRouter(route.children, routeNames),
      });
    } else {
      if (route.meta.needAuthority) {
        if (routeNames.indexOf(route.name) > -1) {
          result.push(route);
        }
      } else {
        result.push(route);
      }
    }
  });
  return result;
};

// 下划线转换驼峰
utils.toHump = (name) => {
  // eslint-disable-next-line no-useless-escape
  return name.replace(/_(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
};
// 驼峰转换下划线
utils.toLine = (name) => {
  return name.replace(/([A-Z])/g, "_$1").toLowerCase();
};

utils.isNotNull = (object) => {
  let keys = Object.keys(object);
  let result = false;
  keys.forEach((i) => {
    if (object[i] && object[i] !== null && object[i] !== "") {
      result = true;
    }
  });
  return result;
};

export default utils;
