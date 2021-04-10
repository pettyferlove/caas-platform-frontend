/* Engine */
require("./mock/engine/kubernetes/namespace");
require("./mock/engine/kubernetes/pod");
require("./mock/engine/kubernetes/node");
require("./mock/engine/docker/register/harbor");
require("./mock/engine/gitlab/project");

/* Core */
require("./mock/core/auto-build");
require("./mock/core/global-configuration");
require("./mock/core/application-deployment");
require("./mock/core/images-depository");
