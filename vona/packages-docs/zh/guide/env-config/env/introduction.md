# Env环境变量

Vona 基于多维变量加载环境文件，从而提供更加灵活的配置机制，支持更复杂的业务场景。

## meta与.env文件

Vona 使用[dotenv](https://github.com/motdotla/dotenv)从`env`目录中加载下列文件中的环境变量：

```txt
.env                # 所有情况下都会加载
.env.[meta]         # 只在指定条件下加载
.env.local           # 所有情况下都会加载，但会被 git 忽略
.env.[meta].local    # 只在指定条件下加载，但会被 git 忽略
```

- `[meta]`可以是以下两个变量值的`任意组合`

| 名称   | 类型                                                               |
| ------ | ------------------------------------------------------------------ |
| mode   | 'test' \|'dev' \| 'prod'                                           |
| flavor | 'normal' \|'play' \|'docker' \| 'ci' \| keyof VonaMetaFlavorExtend |

## npm scripts

与多维变量相对应，命令行与脚本对应关系如下：

```bash
$ npm run test
$ npm run dev
$ npm run build
$ npm run build:docker
```

```json
"scripts": {
  "test": "vona :bin:test --flavor=normal",
  "dev": "vona :bin:dev --flavor=normal",
  "build": "vona :bin:build --flavor=normal",
  "build:docker": "vona :bin:build --flavor=docker",
}
```

### 举例

在命令行执行`npm run dev`，那么，对应的 meta 变量值是：

| 名称   | 值       |
| ------ | -------- |
| mode   | 'dev'    |
| flavor | 'normal' |

系统就会自动依次加载下列文件中的环境变量，并进行合并:

```txt
.env
.env.normal
.env.normal.dev
.env.local
.env.normal.local
.env.normal.dev.local
```

## Tree-shaking

VonaJS 仅针对以下环境变量支持 build 时的 Tree-shaking 能力: `META_MODE`、`META_FLAVOR`、`NODE_ENV`

比如:

```typescript
if (process.env.META_MODE === 'dev') {
  console.log('for development');
}
```

在进行 build 时，会自动转化为:

```typescript
if ('build' === 'dev') {
  console.log('for development');
}
```

由于条件为 false，从而进行 Tree-shaking。

## 获取环境变量

### 1. process.env

对于支持 Tree-shaking 能力的环境变量，通过`process.env`来获取。

```typescript
process.env.META_MODE;
process.env.META_FLAVOR;
process.env.NODE_ENV;
```

- `process.env.NODE_ENV`: 仅用于兼容 Nodejs 生态，优先使用`process.env.META_MODE`

### 2. app.meta.env

对于不支持 Tree-shaking 能力的环境变量，通过`app.meta.env`来获取。

```typescript
this.app.meta.env.APP_NAME;
this.app.meta.env.APP_TITLE;
this.app.meta.env.SERVER_LISTEN_PORT;
```

## 内置环境变量

VonaJS 提供了若干内置的环境变量：

### meta

| 名称        | 说明   |
| ----------- | ------ |
| META_MODE   | mode   |
| META_FLAVOR | flavor |

### app

| 名称        | 说明     |
| ----------- | -------- |
| APP_NAME    | 应用名称 |
| APP_TITLE   | 应用标题 |
| APP_VERSION | 应用版本 |

### server

| 名称                   | 说明 |
| ---------------------- | ---- |
| SERVER_KEYS            |      |
| SERVER_GLOBALPREFIX    |      |
| SERVER_PUBLICDIR       |      |
| SERVER_SUBDOMAINOFFSET |      |
| SERVER_WORKERS         |      |
| SERVER_LISTEN_HOSTNAME |      |
| SERVER_LISTEN_PORT     |      |
| SERVER_LISTEN_DISABLE  |      |

### project

| 名称                     | 说明           |
| ------------------------ | -------------- |
| PROJECT_DISABLED_MODULES | 禁用的模块清单 |
| PROJECT_DISABLED_SUITES  | 禁用的套件清单 |

### logger

| 名称                      | 说明 |
| ------------------------- | ---- |
| LOGGER_DIR                |      |
| LOGGER_CLIENT_DEFAULT     |      |
| LOGGER_DUMMY              |      |
| LOGGER_ROTATE_ENABLE      |      |
| LOGGER_ROTATE_FILENAME    |      |
| LOGGER_ROTATE_DATEPATTERN |      |
| LOGGER_ROTATE_MAXSIZE     |      |
| LOGGER_ROTATE_MAXFILES    |      |

### build

| 名称                          | 说明                          |
| ----------------------------- | ----------------------------- |
| BUILD_OUTDIR                  | 指定输出目录                  |
| BUILD_SOURCEMAP               | Sourcemap                     |
| BUILD_MINIFY                  | 是否最小化                    |
| BUILD_LOG_CIRCULAR_DEPENDENCY |                               |
| BUILD_COPY_DIST               | 将dist拷贝至指定目录          |
| BUILD_COPY_RELEASE            | 将dist-releases拷贝至指定目录 |
| BUILD_DIALECT_DRIVERS         |                               |

### test

| 名称                  | 说明 |
| --------------------- | ---- |
| TEST_CONCURRENCY      |      |
| TEST_ONLY             |      |
| TEST_WHYISNODERUNNING |      |
| TEST_PATTERNS_IGNORE  |      |

### database

VonaJS 支持多数据库。为了开箱即用，提供了两个数据源的定义：`pg`/`mysql`，默认数据源是`pg`

| 名称                    | 说明             |
| ----------------------- | ---------------- |
| DATABASE_DEFAULT_CLIENT | 默认使用的数据源 |

- pg 配置

| 名称                        | 说明 |
| --------------------------- | ---- |
| DATABASE_CLIENT_PG_HOST     |      |
| DATABASE_CLIENT_PG_PORT     |      |
| DATABASE_CLIENT_PG_USER     |      |
| DATABASE_CLIENT_PG_PASSWORD |      |
| DATABASE_CLIENT_PG_DATABASE |      |

- mysql 配置

| 名称                           | 说明 |
| ------------------------------ | ---- |
| DATABASE_CLIENT_MYSQL_HOST     |      |
| DATABASE_CLIENT_MYSQL_PORT     |      |
| DATABASE_CLIENT_MYSQL_USER     |      |
| DATABASE_CLIENT_MYSQL_PASSWORD |      |
| DATABASE_CLIENT_MYSQL_DATABASE |      |

### redis

| 名称                   | 说明 |
| ---------------------- | ---- |
| REDIS_DEFAULT_HOST     |      |
| REDIS_DEFAULT_PORT     |      |
| REDIS_DEFAULT_PASSWORD |      |
| REDIS_DEFAULT_DB       |      |
