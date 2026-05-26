# Config配置

Vona 基于多维变量加载 Config 配置，从而提供更加灵活的配置机制，支持更复杂的业务场景。

## meta与config文件

Vona 从`src/backend/config/config`目录中加载 config 文件，支持基于`meta`条件的文件加载：

```txt
config.ts                # 所有情况下都会加载
config.[meta].ts         # 只在指定条件下加载
config.local.ts           # 所有情况下都会加载，但会被 git 忽略
config.[meta].local.ts    # 只在指定条件下加载，但会被 git 忽略
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

系统就会自动加载下列文件中的 Config 配置，并进行合并:

```txt
config.ts
config.normal.ts
config.normal.dev.ts
config.local.ts
config.normal.local.ts
config.normal.dev.local.ts
```

## 支持异步加载

config 文件支持异步加载。

```typescript
export default async function (app: VonaApplication) {
  const config: VonaConfigOptional = {};

  // async load remote config
  ...

  return config;
}
```

## 获取全局config

在任何 bean 实例中可以直接通过`this.app.config`获取全局 config 对象。

```typescript
this.app.config.server.globalPrefix;
this.app.config.database.defaultClient;
```

## 获取实例config

在任何 bean 实例中可以直接通过`this.ctx.config`获取实例 config 对象。

```typescript
this.ctx.config.server.serve.protocol;
this.ctx.config.server.serve.host;
```

## 获取模块config

模块可以单独提供自己的 config 配置，可以通过 Scope 实例获取模块的 config 配置，参见：[Config配置](../../essentials/scope/config.md)

```typescript
this.scope.config.title;
this.$scope.homeIndex.config.title;
```

## 覆盖模块config

可以使用项目级别的 config 配置覆盖模块级别的 config 配置，参见：[Config配置](../../essentials/scope/config.md)

`src/backend/config/config/config.ts`

```typescript
// modules
config.modules = {
  'home-index': {
    title: 'Hello World!!',
  },
};
```
