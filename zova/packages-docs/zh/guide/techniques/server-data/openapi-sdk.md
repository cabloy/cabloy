# Openapi SDK

Zova 采用[openapi-typescript](https://github.com/openapi-ts/openapi-typescript)基于 Swagger/Openapi 元数据，自动生成前端的 Client SDK，提供顺畅的 Typescript 开发体验。

Zova 采用模块化体系，因此可以根据业务需求将后端提供的 Swagger/Openapi 元数据拆分成多个部分，在不同的模块中独立管理。

## 初始化Openapi配置

首先，在模块 demo-student 中初始化 Openapi 配置。

### 1. Cli命令

```bash
$ zova :openapi:config demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Zova Tools/Generate Openapi Config`
:::

## Openapi配置

### 1. 模块配置

`src/module/demo-student/cli/openapi.config.ts`

```diff
export default function (): ZovaOpenapiConfigModule {
  return {
+   operations: {
+     match: [/^HomeBaseMenu_*/],
+   },
  };
}
```

在`operations.match`中指定需要在当前模块中管理的 API，可以使用正则表达式指定一组 API。

### 2. 项目配置

系统会自动在项目目录创建文件`openapi.config.ts`，可以指定 Swagger/Openapi 的下载源。

`openapi.config.ts`

```diff
export default function (): ZovaOpenapiConfig {
  return {
    default: {
+     source: 'http://localhost:7102/swagger/json?version=V31',
    },
    modules: {},
  };
}
```

## 生成Openapi SDK

现在就可以自动下载 Swagger/Openapi，然后在模块 demo-student 中生成指定的 API 服务。

### 1. Cli命令

```bash
$ zova :openapi:generate demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Zova Tools/Generate Openapi SDK`
:::

现在就可以使用 API 服务了。参见: [$api](./api.md)

> 约定：为了规范代码，一个模块要么使用Openapi SDK自动创建API服务，要么手工创建API服务。二者选其一
