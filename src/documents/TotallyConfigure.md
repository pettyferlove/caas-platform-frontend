# 个人配置
## 1.GitLab安全配置
CAAS平台使用GitLab作为基础的源码仓库，以此提供自动触发等机制，使用平台功能需要预先设置相应安全配置
* GitLab根地址

默认为http://gitlab.ggjs.sinobest.cn/，该项无需用户手动修改直接默认即可

* Api Token

平台需要读取你的源码仓库基础信息，提供更好的操作体验，你需要前往GitLab---> Settings ---> Access Token创建一个Access Token;CAAS平台需要的权限如下所示：

| 权限对应的域    | 是否必选 | 说明                          |
| --------------- | -------- | ----------------------------- |
| api             | 是       | 授权项目的读取/写入等操作权限 |
| read_user       | 是       | 读取用户基础信息              |
| read_repository | 是       | 读取用户仓库信息              |

![ravenq](https://caas-platform.oss-cn-guangzhou.aliyuncs.com/statics/gitlab_access_token.png)

::: info
配置Api Token之后会自动创建对应的RSA密钥对，Git仓库只通过密钥对进行访问
:::

## 2.Subversion安全配置（非必选）

> 如果你不需要用户Subversion可略过该部分说明

> 注意：Subversion需要明文指定用户名和密码，该过程可能导致密码泄露

Subversion用户名密码配置后，后续需要用到Subversion的地方将会自动使用该配置

## 2.命名空间

你需要初始化一个专属的命名空间；命名空间内的应用、持久化存储等逻辑隔离，不允许互相访问

::: warning
如果你需要删除命名空间，你需要联系管理员，删除操作将会丢失该命名空间下的所有文件、应用等资源
:::