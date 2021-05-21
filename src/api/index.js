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
import { daemonSet } from "./interface/engine/kubernetes/daemon-set";
import { ingress } from "./interface/engine/kubernetes/ingress";
import { secret } from "./interface/engine/kubernetes/secret";
import { service } from "./interface/engine/kubernetes/service";
import { statefulSet } from "./interface/engine/kubernetes/stateful-set";
import { storageClass } from "./interface/engine/kubernetes/storage-class";
import { gitlabProject } from "./interface/engine/gitlab/project";
import { harborRegister } from "./interface/engine/docker/register/harbor";
import { appCenter } from "./interface/engine/appcenter/app-center";

/*System*/
import { buildFile } from "./interface/system/build-file";
import { message } from "./interface/system/system";

export default {
  login,
  user,
  message,
  buildFile,
  deployment,
  namespace,
  node,
  storageClass,
  pod,
  daemonSet,
  ingress,
  secret,
  service,
  statefulSet,
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
  appCenter,
};
