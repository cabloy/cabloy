# Env环境变量

Zova 基于多维变量加载环境文件，从而提供更加灵活的配置机制，支持更复杂的业务场景。

## meta与.env文件

Zova 使用[dotenv](https://github.com/motdotla/dotenv)从`env`目录中加载下列文件中的环境变量：

```txt
.env                # 所有情况下都会加载
.env.[meta]         # 只在指定条件下加载
.env.local           # 所有情况下都会加载，但会被 git 忽略
.env.[meta].local    # 只在指定条件下加载，但会被 git 忽略
```

- `[meta]`可以是以下三个变量值的`任意组合`

| 名称    | 类型                          |
| ------- | ----------------------------- |
| mode    | 'development' \| 'production' |
| appMode | 'spa' \| 'ssr'                |
| flavor  | 'web' \| 'admin'              |

## npm scripts

与多维变量相对应，命令行与脚本对应关系如下：

```bash
$ npm run dev:ssr:admin
$ npm run build:ssr:admin
```

```json
"scripts": {
  "dev": "npm run dev:ssr:admin",
  "build": "npm run build:ssr:admin",
  "preview": "npm run preview:ssr",
  "dev:ssr:admin": "npm run prerun && quasar dev --mode ssr --flavor admin",
  "build:ssr:admin": "npm run prerun && quasar build --mode ssr --flavor admin",
  "preview:ssr": "concurrently \"node ./dist-mock/index.js\" \"node ./dist/ssr/index.js\"",
},
```

### 举例

在命令行执行`npm run dev`，那么，对应的 meta 变量值是：

| 名称    | 值            |
| ------- | ------------- |
| mode    | 'development' |
| appMode | 'ssr'         |
| flavor  | 'admin'       |

系统就会自动加载下列文件中的环境变量，并进行合并:

```txt
.env
.env.ssr
.env.ssr.admin
.env.ssr.admin.development
.env.local
.env.ssr.local
.env.ssr.admin.local
.env.ssr.admin.development.local
```

## Tree-shaking

ZovaJS 仅针对以下环境变量支持 build 时的 Tree-shaking 能力：

| 名称          | 说明                                      |
| ------------- | ----------------------------------------- |
| META_MODE     | 运行环境                                  |
| META_APP_MODE | 应用模式                                  |
| META_FLAVOR   | Flavor                                    |
| NODE_ENV      | = process.env.META_MODE                   |
| DEV           | = process.env.META_MODE === 'development' |
| PROD          | = process.env.META_MODE === 'production'  |
| SSR           | = process.env.META_APP_MODE === 'ssr'     |
| CLIENT        | 是否是客户端                              |
| SERVER        | 是否是服务端                              |

比如:

```typescript
if (process.env.DEV) {
  console.log('for development');
}
```

在进行 build 时，会自动转化为:

```typescript
if (false) {
  console.log('for development');
}
```

由于条件为 false，从而进行 Tree-shaking。

## 获取环境变量

### 1. process.env

对于支持 Tree-shaking 能力的环境变量，通过`process.env`来获取。

```typescript
process.env.META_MODE;
process.env.META_APP_MODE;
process.env.META_FLAVOR;
process.env.NODE_ENV;
process.env.DEV;
process.env.PROD;
process.env.SSR;
process.env.CLIENT;
process.env.SERVER;
```

- `process.env.NODE_ENV`: 仅用于兼容 Nodejs 生态，优先使用`process.env.META_MODE`

### 2. sys.env

对于不支持 Tree-shaking 能力的环境变量，通过`sys.env`来获取。

```typescript
this.sys.env.APP_NAME;
this.sys.env.APP_TITLE;
this.sys.env.APP_PUBLIC_PATH;
```

## 内置环境变量

ZovaJS 提供了若干内置的环境变量：

### meta

| 名称          | 说明     |
| ------------- | -------- |
| META_MODE     | 运行环境 |
| META_APP_MODE | 应用模式 |
| META_FLAVOR   | Flavor   |

### app

| 名称               | 说明                                                                           |
| ------------------ | ------------------------------------------------------------------------------ |
| APP_NAME           | 应用名称                                                                       |
| APP_TITLE          | 应用标题                                                                       |
| APP_DESCRIPTION    | 应用描述                                                                       |
| APP_VERSION        | 应用版本                                                                       |
| APP_META_VIEWPORT  | html.head.meta.viewport                                                        |
| APP_PUBLIC_PATH    | [Vite: Public Base Path](https://vitejs.dev/guide/build.html#public-base-path) |
| APP_LOCALE_DEFAULT | 缺省Locale值                                                                   |

### router

| 名称        | 说明                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------- |
| ROUTER_MODE | [Vue Router: History Modes](https://router.vuejs.org/guide/essentials/history-mode.html) |

### dev server

| 名称                | 说明                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------- |
| DEV_SERVER_HOSTNAME | 开发服务的host [Vite: server.host](https://vitejs.dev/config/server-options.html#server-host) |
| DEV_SERVER_PORT     | 开发服务的port                                                                                |

### project

| 名称                     | 说明           |
| ------------------------ | -------------- |
| PROJECT_DISABLED_MODULES | 禁用的模块清单 |
| PROJECT_DISABLED_SUITES  | 禁用的套件清单 |

### 构建

| 名称            | 说明              |
| --------------- | ----------------- |
| BUILD_OUTDIR    | 指定输出目录      |
| BUILD_MINIFY    | 是否最小化        |
| BUILD_SOURCEMAP | 是否生成Sourcemap |
| BUILD_ANALYZE   | 是否显示分析信息  |

### API

| 名称         | 说明        |
| ------------ | ----------- |
| API_BASE_URL |             |
| API_PREFIX   |             |
| API_JWT      | 是否启用JWT |

### Proxy

| 名称               | 说明                                                                                            |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| PROXY_API_ENABLED  | 是否启用proxy：[Vite: server.proxy](https://vitejs.dev/config/server-options.html#server-proxy) |
| PROXY_API_BASE_URL | proxy target                                                                                    |
| PROXY_API_PREFIX   | proxy key                                                                                       |

### SSR

参见：[SSR](../../techniques/ssr/env.md)

### Mock

参见：[Mock](../../techniques/mock/introduction.md)

## 动态环境变量

以下是根据运行环境动态设定的环境变量：

| 名称   | 说明           |
| ------ | -------------- |
| SSR    | 是否是SSR模式  |
| DEV    | 是否是开发环境 |
| PROD   | 是否是生产环境 |
| CLIENT | 是否是客户端   |
| SERVER | 是否是服务端   |
