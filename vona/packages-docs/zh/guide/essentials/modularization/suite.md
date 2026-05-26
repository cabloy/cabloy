# 套件

## 套件的由来

随着项目不断迭代演进，创建的业务模块也会随之膨胀。此外，对于某些业务场景，往往需要多个模块的配合实现。针对以上问题，Vona 引入了`套件`的概念。简而言之，`套件`就是一组业务模块的组合，往往对应于某个具体的业务场景，比如`电商`、`CRM`、`供应链`，等等。

## 命名约定

套件采用与模块类似的命名约定：

```bash
完整名: vona-suite-{providerId}-{suiteName}
短名: {providerId}-{suiteName}
```

| 名称       | 说明      |
| ---------- | --------- |
| providerId | 提供者 Id |
| suiteName  | 套件名称  |

## 目录结构

套件是一组业务模块的组合，因此目录结构也非常简单。以套件`a-home`为例：

```bash
a-home
├── modules
│   ├── home-base
│   ├── home-index
│   ├── home-user
│   └── ...
└── package.json
```

## 新建套件

### 1. Cli 命令

```bash
$ vona :create:suite suiteName
```

| 名称      | 说明     |
| --------- | -------- |
| suiteName | 套件名称 |

### 2. 菜单命令

::: tip
右键菜单 - [项目路径/src/suite]: `Vona Create/Suite`
:::

依据提示输入套件名称，比如`demo-student`，VSCode 插件会自动创建套件的代码骨架。
