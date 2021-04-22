import { login } from "./interface/system/login";
import { user } from "./interface/system/user";

/*Core*/
import { applicationDeployment } from "./interface/core/application-deployment";
import { serviceDiscovery } from "./interface/core/service-discovery";
import { projectBuild } from "./interface/core/project-build";
import { sqlBuild } from "./interface/core/sql-build";
import { log } from "./interface/core/log";
import { config } from "./interface/core/config";
import { imagesDepository } from "./interface/core/images-depository";
import { globalConfiguration } from "./interface/core/global-configuration";
import { userConfiguration } from "./interface/core/user-configuration";
import { namespace } from "./interface/core/namespace";
import { pod } from "./interface/core/pod";
import { persistentStorage } from "./interface/core/persistent-storage";

/*Engine*/
import { deployment } from "./interface/engine/kubernetes/deployment";
import { node } from "./interface/engine/kubernetes/node";
import { storageClass } from "./interface/engine/kubernetes/storage-class";
import { gitlabProject } from "./interface/engine/gitlab/project";
import { harborRegister } from "./interface/engine/docker/register/harbor";

/*System*/
import { buildFile } from "./interface/system/build-file";

export default {
  login,
  user,
  buildFile,
  deployment,
  namespace,
  node,
  storageClass,
  pod,
  persistentStorage,
  globalConfiguration,
  userConfiguration,
  projectBuild,
  sqlBuild,
  log,
  config,
  applicationDeployment,
  serviceDiscovery,
  imagesDepository,
  gitlabProject,
  harborRegister,
};
