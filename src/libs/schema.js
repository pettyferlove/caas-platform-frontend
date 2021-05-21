import * as jsonpatch from "fast-json-patch";
import { isEmpty, set } from "lodash";
import YAML from "yaml";

const { nullOptions } = require("yaml/types");
nullOptions.nullStr = "";

function getDefinedPath(allElementsButTheLast, doc) {
  let currentPath = [];
  let foundUndefined = false;
  allElementsButTheLast.forEach((p) => {
    if (!foundUndefined) {
      const pathToEvaluate = currentPath.concat(p);
      const elem = doc.getIn(pathToEvaluate);
      if (elem === undefined || elem === null) {
        foundUndefined = true;
      } else {
        currentPath = pathToEvaluate;
      }
    }
  });
  return currentPath;
}

function splitPath(path) {
  return (
    (path ?? "")
      // ignore the first slash, if exists
      .replace(/^\//, "")
      // split by slashes
      .split("/")
  );
}

function unescapePath(path) {
  // jsonpath escapes slashes to not mistake then with objects so we need to revert that
  return path.map((p) => jsonpatch.unescapePathComponent(p));
}

function parsePath(path) {
  return unescapePath(splitPath(path));
}

function parsePathAndValue(doc, path, value) {
  if (isEmpty(doc.contents)) {
    return { value: set({}, path.replace(/^\//, ""), value), splittedPath: [] };
  }
  let splittedPath = splitPath(path);
  const allElementsButTheLast = splittedPath.slice(0, splittedPath.length - 1);
  const parentNode = doc.getIn(allElementsButTheLast);
  if (parentNode === undefined) {
    const definedPath = getDefinedPath(allElementsButTheLast, doc);
    const remainingPath = splittedPath.slice(definedPath.length + 1);
    value = set({}, remainingPath.join("."), value);
    splittedPath = splittedPath.slice(0, definedPath.length + 1);
  }
  return { splittedPath: unescapePath(splittedPath), value };
}

// setValue modifies the current values (text) based on a path
export function setValue(values, path, newValue) {
  const doc = YAML.parseDocument(values);
  const { splittedPath, value } = parsePathAndValue(doc, path, newValue);
  doc.setIn(splittedPath, value);
  return doc.toString();
}

// parseValues returns a processed version of the values without modifying anything
export function parseValues(values) {
  return YAML.parseDocument(values).toString();
}

export function deleteValue(values, path) {
  const doc = YAML.parseDocument(values);
  const { splittedPath } = parsePathAndValue(doc, path);
  doc.deleteIn(splittedPath);
  // If the document is empty after the deletion instead of returning {}
  // we return an empty line "\n"
  return doc.contents && !isEmpty(doc.contents.items) ? doc.toString() : "\n";
}

// getValue returns the current value of an object based on YAML text and its path
export function getValue(values, path, defaultValue) {
  const doc = YAML.parseDocument(values);
  const splittedPath = parsePath(path);
  const value = doc.getIn(splittedPath);
  return value === undefined || value === null ? defaultValue : value;
}
