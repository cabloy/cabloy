# 目录结构

## 目录结构

```bash
project
├── env
├── src
│  ├── front
│  │  ├── config
│  │  │  ├── config
│  │  │  └── locales.ts
│  ├── module
│  ├── module-vendor
│  ├── suite
│  │  ├── a-demo
│  │  └── a-home
│  │    ├── modules
│  │    │  ├── home-base
│  │    │  ├── home-icon
│  │    │  ├── home-index
│  │    │  └── home-layout
│  └── suite-vendor
```

## 模块/套件

| 名称              | 说明                   |
| ----------------- | ---------------------- |
| src/module        | 独立模块               |
| src/module-vendor | 独立模块（来自第三方） |
| src/suite         | 套件                   |
| src/suite-vendor  | 套件（来自第三方）     |

## 开发建议

Zova 对模块/套件进行了规划，方便我们在约定的目录立即开始业务开发。以下约定仅仅是建议，没有强制约束：

1. `suite/a-demo`：包含一些测试或者演示代码，在构建时禁用即可
2. `suite/a-home`：是业务开发的起点，可以根据需要修改该套件的任何代码
3. `成长为大型系统`：随着业务的扩展，可以创建更多的套件和模块，对系统业务进行拆分

## 目录说明

| 名称                                 | 说明                                               |
| ------------------------------------ | -------------------------------------------------- |
| env                                  | [Env](../../env-config/env/introduction.md)        |
| src/front/config/config              | [Config](../../env-config/config/introduction.md)  |
| src/front/config/locales.ts          | [I18n国际化](../scope/locale.md)                   |
| src/suite/a-home/modules/home-api    | [API](../../techniques/server-data/api.md)         |
| src/suite/a-home/modules/home-base   | [导航守卫](../../page/navigation-guards.md)        |
| src/suite/a-home/modules/home-icon   | [图标](../../techniques/icon/icon-engine.md)       |
| src/suite/a-home/modules/home-index  | [路由别名](../../page/route-alias.md)              |
| src/suite/a-home/modules/home-layout | [路由字段: meta.layout](../../page/page-layout.md) |
