const Harbor = require("mockjs");
// 获取 mock.Random 对象
// eslint-disable-next-line no-unused-vars
const Random = Harbor.Random;

Harbor.mock(
  RegExp("/docker/register/harbor/public/search"),
  "get",
  function (params) {
    console.log(params);
    return {
      status: 200,
      timestamp: 1593773822102,
      message: "success",
      data: [
        {
          repositoryName: "common/nginx",
          projectName: "common",
          projectPublic: true,
          tagsCount: 1,
          projectId: 2,
          pullCount: 0,
          pullUrl: "192.168.13.61/common/nginx",
        },
        {
          repositoryName: "common/pettyfer/alpine",
          projectName: "common",
          projectPublic: true,
          tagsCount: 1,
          projectId: 2,
          pullCount: 0,
          pullUrl: "192.168.13.61/common/pettyfer/alpine",
        },
        {
          repositoryName: "common/pettyfer/alpine-oracle-jre8",
          projectName: "common",
          projectPublic: true,
          tagsCount: 1,
          projectId: 2,
          pullCount: 0,
          pullUrl: "192.168.13.61/common/pettyfer/alpine-oracle-jre8",
        },
        {
          repositoryName: "common/pettyfer/apline-open-jre8",
          projectName: "common",
          projectPublic: true,
          tagsCount: 1,
          projectId: 2,
          pullCount: 0,
          pullUrl: "192.168.13.61/common/pettyfer/apline-open-jre8",
        },
      ],
    };
  }
);

Harbor.mock(
  RegExp("/docker/register/harbor/repository/common%2Fnginx/tag"),
  "get",
  function (params) {
    console.log(params);
    return {
      status: 200,
      timestamp: 1593773867315,
      message: "success",
      data: [
        {
          name: "latest",
          author: "NGINX Docker Maintainers <docker-maint@nginx.com>",
          dockerVersion: "18.09.7",
          labels: [],
          created: "2020-06-09T16:57:42.632836191Z",
          architecture: "amd64",
          os: "linux",
          digest:
            "sha256:0efad4d09a419dc6d574c3c3baacb804a530acd61d5eba72cb1f14e1f5ac0c8f",
          size: 53321513,
        },
      ],
    };
  }
);
