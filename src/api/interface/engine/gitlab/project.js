import Http from "../../../http";

let baseUrl = process.env.VUE_APP_API_ROOT;

const gitlabProject = {
  /**
   * 查询全部项目
   * @returns {Promise<*>}
   */
  allProjects() {
    return Http.Get(baseUrl + "/gitlab/projects/all");
  },
  searchProjects(params) {
    return Http.Get(baseUrl + "/gitlab/projects/search", params);
  },
  projectBranches(params) {
    return Http.Get(baseUrl + "/gitlab/" + params + "/branches");
  },
  projectTags(params) {
    return Http.Get(baseUrl + "/gitlab/" + params + "/tags");
  },
};
export { gitlabProject };
