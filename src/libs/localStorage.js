/**
 * 保存数据至LocalStorage
 * @param params
 */
export const setLocalStorage = (params) => {
  const { name, content, type } = params;
  const obj = {
    dataType: typeof content,
    content: content,
    type: type,
    datetime: new Date().getTime(),
  };
  if (type) window.sessionStorage.setItem(name, JSON.stringify(obj));
  else window.localStorage.setItem(name, JSON.stringify(obj));
};
/**
 * 获取LocalStorage数据
 * @param params
 * @returns {number}
 */
export const getLocalStorage = (params) => {
  const { name } = params;
  let obj = {};
  let content;
  obj = window.localStorage.getItem(name);
  obj = JSON.parse(obj);
  if (obj === null) {
    content = obj;
  } else {
    if (obj.dataType === "string") {
      content = obj.content;
    } else if (obj.dataType === "number") {
      content = Number(obj.content);
    } else if (obj.dataType === "boolean") {
      content = eval(obj.content);
    } else if (obj.dataType === "object") {
      content = obj.content;
    }
  }
  return content;
};
/**
 * 删除LocalStorage
 */
export const removeLocalStorage = (name) => {
  window.localStorage.removeItem(name);
  window.sessionStorage.removeItem(name);
};

/**
 * 删除LocalStorage
 */
export const clearLocalStorage = () => {
  window.localStorage.clear();
};
