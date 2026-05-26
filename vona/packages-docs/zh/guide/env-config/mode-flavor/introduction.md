# 运行环境与Flavor

Vona 基于`多维变量`加载 Env 环境变量和 Config 配置，从而提供更加灵活的配置机制，支持更复杂的业务场景。

Vona 中的`多维变量`包含两个维度：`运行环境`和`Flavor`

## 运行环境

Vona 提供了三个运行环境：

| 名称 | 说明     |
| ---- | -------- |
| test | 测试环境 |
| dev  | 开发环境 |
| prod | 生产环境 |

### 1. 启用运行环境

通过执行不同的命令启用相应的运行环境。

```bash
# test
$ npm run test
$ npm run cov
$ npm run db:reset
# dev
$ npm run dev
$ npm run dev:one
# prod
$ npm run start
$ npm run start:one
$ npm run start:docker
```

### 2. 如何判断当前运行环境

- 通过 Env 来判断

使用 Env 来判断当前运行环境，可以支持 build 时的 tree-shaking 能力。

```typescript
process.env.META_MODE === 'test';
process.env.META_MODE === 'dev';
process.env.META_MODE === 'prod';
```

- 通过 Config 来判断

```typescript
app.config.meta.mode === 'test';
app.config.meta.mode === 'dev';
app.config.meta.mode === 'prod';
```

- 简化写法

```typescript
app.meta.isTest;
app.meta.isDev;
app.meta.isProd;
```

## Flavor

面对更复杂的业务场景，往往需要提供更多场景的配置能力。那么，Vona 专门提供了 Flavor 机制。通过`运行环境`和`Flavor`的组合，使我们可以非常方便的定义各种场景的配置信息。

### 1. 内置Flavor

为了开箱即用，Vona 提供了几个内置 Flavor：

| 名称   | 说明                              |
| ------ | --------------------------------- |
| normal | 默认的Flavor                      |
| play   | 用于[练习场](../../start/play.md) |
| docker | 用于Docker环境                    |
| ci     | 用于CI环境，比如Github Actions    |

### 2. 启用Flavor

通过传递命令参数启用相应的 Flavor。

```bash
# normal
$ npm run dev
# docker
$ npm run dev -- --flavor=docker
$ npm run build -- --flavor=docker
# ci
$ npm run build -- --flavor=ci
```

### 3. 如何判断当前Flavor

- 通过 Env 来判断

使用 Env 来判断当前 Flavor，可以支持 build 时的 tree-shaking 能力。

```typescript
process.env.META_FLAVOR === 'normal';
process.env.META_FLAVOR === 'docker';
process.env.META_FLAVOR === 'ci';
```

- 通过 Config 来判断

```typescript
app.config.meta.flavor === 'normal';
app.config.meta.flavor === 'docker';
app.config.meta.flavor === 'ci';
```

### 4. 新建Flavor

可以基于任何业务需求来新建 Flavor，比如客户、项目、组织等等。

比如，为顾客 A 分配一个 Flavor: `customA`，从而为顾客 A 提供独立的 Env/Config 配置。

- 启用 Flavor

```bash
$ npm run dev -- --flavor=customA
```

- 如何判断 Flavor

```typescript
process.env.META_FLAVOR === 'customA';
app.config.meta.flavor === 'customA';
```

### 5. 添加Flavor类型定义

可以添加 Flavor 类型定义，让判断 Flavor 的代码有类型提示。

在 VSCode 编辑器中，输入代码片段`recordflavor`，自动生成代码骨架，然后添加自定义的 Flavor 类型定义。

```diff
declare module '@cabloy/module-info' {
  export interface VonaMetaFlavorExtend {
+   customA: never;
  }
}
```
