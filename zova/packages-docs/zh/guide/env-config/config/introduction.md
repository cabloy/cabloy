# Config配置

Zova 基于多维变量加载 Config 配置，从而提供更加灵活的配置机制，支持更复杂的业务场景。

## meta与config文件

Zova 从`src/front/config/config`目录中加载 config 文件，支持基于`meta`条件的文件加载：

```txt
config.ts                 # 所有情况下都会加载
config.[meta].ts          # 只在指定条件下加载
config.local.ts            # 所有情况下都会加载，但会被 git 忽略
config.[meta].local.ts     # 只在指定条件下加载，但会被 git 忽略
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

系统就会自动加载下列文件中的 Config 配置，并进行合并:

```txt
config.ts
config.ssr.ts
config.ssr.admin.ts
config.ssr.admin.development.ts
config.local.ts
config.ssr.local.ts
config.ssr.admin.local.ts
config.ssr.admin.development.local.ts
```

## 支持异步加载

config 文件支持异步加载。

```typescript
export default async function (_sys: ZovaSys) {
  const config: ZovaConfigOptional = {};

  // async load remote config
  ...

  return config;
}
```

## 获取全局config

在任何 bean 实例中可以直接通过`this.sys.config`获取全局 config 对象。

```typescript
this.sys.config.api.baseURL;
this.sys.config.api.prefix;
```

## 获取模块config

模块可以单独提供自己的 config 配置，可以通过 Scope 实例获取模块的 config 配置，参见：[Config配置](../../essentials/scope/config.md)

## 覆盖模块config

可以使用项目级别的 config 配置覆盖模块级别的 config 配置，参见：[Config配置](../../essentials/scope/config.md)
