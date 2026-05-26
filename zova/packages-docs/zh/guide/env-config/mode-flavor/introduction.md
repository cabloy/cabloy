# 多维变量

Zova 基于`多维变量`加载 Env 环境变量和 Config 配置，从而提供更加灵活的配置机制，支持更复杂的业务场景。

Zova 中的`多维变量`包含三个维度：`运行环境`、`应用模式`、`Flavor`

## 运行环境

Zova 提供了两个运行环境：

| 名称        | 说明     |
| ----------- | -------- |
| development | 开发环境 |
| production  | 生产环境 |

### 1. 启用运行环境

通过执行不同的命令启用相应的运行环境。

```bash
# development
$ npm run dev
# production
$ npm run build
$ npm run preview
```

### 2. 如何判断当前运行环境

- 通过 Env 来判断

使用 Env 来判断当前运行环境，可以支持 build 时的 tree-shaking 能力。

```typescript
process.env.META_MODE === 'development';
process.env.META_MODE === 'production';
```

- 简化写法

```typescript
process.env.DEV; // boolean
process.env.PROD; // boolean
```

- 通过 Config 来判断

```typescript
sys.config.meta.mode === 'development';
sys.config.meta.mode === 'production';
```

## 应用模式

Zova 目前提供了两个应用模式，后续会逐步增加更多：

| 名称 | 说明       |
| ---- | ---------- |
| ssr  | 服务端渲染 |
| spa  | 单页面应用 |

### 1. 启用应用模式

通过执行不同的命令启用相应的应用模式。

```bash
# ssr
$ npm run dev:ssr:admin
# spa
$ npm run dev:spa
```

### 2. 如何判断当前应用模式

- 通过 Env 来判断

使用 Env 来判断当前运行环境，可以支持 build 时的 tree-shaking 能力。

```typescript
process.env.META_APP_MODE === 'ssr';
process.env.META_APP_MODE === 'spa';
```

- 简化写法

```typescript
process.env.SSR; // boolean
```

- 通过 Config 来判断

```typescript
sys.config.meta.appMode === 'ssr';
sys.config.meta.appMode === 'spa';
```

## Flavor

面对更复杂的业务场景，往往需要提供更多场景的配置能力。那么，Zova 专门提供了 Flavor 机制。通过`运行环境`、`应用模式`和`Flavor`的组合，使我们可以非常方便的定义各种场景的配置信息。

### 1. 内置Flavor

为了开箱即用，Zova 提供了几个内置 Flavor：

| 名称             | 说明                            |
| ---------------- | ------------------------------- |
| admin            | 用于Admin中后台                 |
| web              | 用于Web网站                     |
| cabloyBasicAdmin | 用于Cabloy Basic的`Admin中后台` |
| cabloyStartAdmin | 用于Cabloy Start的`Admin中后台` |
| cabloyStartWeb   | 用于Cabloy Start的`Web网站`     |

### 2. 启用Flavor

通过传递命令参数启用相应的 Flavor。

```json
"scripts": {
  "dev": "npm run dev:ssr:admin",
  "dev:ssr:admin": "npm run prerun && quasar dev --mode ssr --flavor admin",
},
```

### 3. 如何判断当前Flavor

- 通过 Env 来判断

使用 Env 来判断当前 Flavor，可以支持 build 时的 tree-shaking 能力。

```typescript
process.env.META_FLAVOR === 'admin';
process.env.META_FLAVOR === 'web';
```

- 通过 Config 来判断

```typescript
sys.config.meta.flavor === 'admin';
sys.config.meta.flavor === 'web';
```

### 4. 新建Flavor

可以基于任何业务需求来新建 Flavor，比如客户、项目、组织等等。

比如，为顾客 A 分配一个 Flavor: `customA`，从而为顾客 A 提供独立的 Env/Config 配置。

- 添加 npm scripts

```json
"scripts": {
  "dev:ssr:customA": "npm run prerun && quasar dev --mode ssr --flavor customA",
  "build:ssr:customA": "npm run prerun && quasar build --mode ssr --flavor customA",
  "preview:ssr:customA": "concurrently \"node ./dist-mock/index.js\" \"node ./dist/ssr-customA/index.js\"",
  "dev:spa:customA": "npm run prerun && quasar dev --mode spa --flavor customA",
}
```

- 如何判断 Flavor

```typescript
process.env.META_FLAVOR === 'customA';
sys.config.meta.flavor === 'customA';
```

### 5. 添加Flavor类型定义

可以添加 Flavor 类型定义，让判断 Flavor 的代码有类型提示。

在 VSCode 编辑器中，输入代码片段`recordflavor`，自动生成代码骨架，然后添加自定义的 Flavor 类型定义。

```diff
declare module '@cabloy/module-info' {
  export interface ZovaMetaFlavorExtend {
+   customA: never;
  }
}
```
