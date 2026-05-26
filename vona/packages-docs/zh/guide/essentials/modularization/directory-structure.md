# 目录结构

## 目录结构

```bash
project
├── docker-compose
├── env
├── src
│  ├── backend
│  │  ├── config
│  │  │  ├── config
│  │  │  └── locales.ts
│  │  ├── demo
│  │  ├── typing
│  ├── module
│  ├── module-vendor
│  ├── suite
│  │  └── a-home
│  │    ├── modules
│  │    │  ├── home-base
│  │    │  ├── home-index
│  │    │  └── home-user
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

Vona 对模块/套件进行了规划，方便我们在约定的目录立即开始业务开发。以下约定仅仅是建议，没有强制约束：

1. `suite/a-home`：是业务开发的起点，可以根据需要修改该套件的任何代码
2. `成长为大型系统`：随着业务的扩展，可以创建更多的套件和模块，对系统业务进行拆分

## 目录说明

| 名称                          | 说明                                              |
| ----------------------------- | ------------------------------------------------- |
| docker-compose                | docker-compose模版                                |
| env                           | [Env](../../env-config/env/introduction.md)       |
| src/backend/config/config     | [Config](../../env-config/config/introduction.md) |
| src/backend/config/locales.ts | [I18n国际化](../scope/locale.md)                  |
| src/backend/play              | [练习场](../../start/play.md)                     |
| src/backend/typing            | 项目级别的类型定义                                |
