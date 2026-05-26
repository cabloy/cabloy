# CabloyJS

CabloyJS 不是独立的框架，而是基于`Vona/Zova套件`的形式提供一组开箱即用的高级功能模块，加速全栈项目的开发。

## 1. Vona套件: vona-suite-a-cabloy (MIT)

该套件包含如下模块:

| 名称           | 说明           |
| -------------- | -------------- |
| a-ssr          | SSR适配层      |
| a-datasharding | 读写分离       |
| a-datasource   | 动态数据源     |
| a-socket       | Web Socket     |
| a-status       | 服务端状态管理 |

## 2. Zova套件: zova-suite-a-cabloy (MIT)

该套件包含如下模块:

| 名称          | 说明                                                                                                      |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| rest-actions  | 用于Zova JSX的Actions。包括： alert/confirm/copy/create/delete/edit/setValue/view                         |
| rest-resource | 支持CRUD渲染的通用组件。包括：列表页、条目页，提供`Tanstack Table/Tanstack Form/Tanstack Query`的最佳实践 |

## 3. 项目模版 {#templates}

针对不同 UI 库，CabloyJS 分别提供了两个项目模版。

| 模版名称                                        | UI库                  | 说明                                   | 演示                                                                   |
| ----------------------------------------------- | --------------------- | -------------------------------------- | ---------------------------------------------------------------------- |
| [cabloy-basic](../cabloy-basic/introduction.md) | Daisyui + Tailwindcss | 提供开箱即用的`Admin中后台`            |                                                                        |
| [cabloy-start](../cabloy-start/introduction.md) | VuetifyJS             | 提供开箱即用的`Web网站`和`Admin中后台` | [Web网站](https://cabloy.com), [Admin中后台](https://cabloy.com/admin) |

## 模版对比

|                                                         | cabloy-basic                                             | cabloy-start                           |
| ------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------- |
| 全栈能力                                                | 提供开箱即用的`Admin中后台`。可自行补充开发`Web网站`能力 | 提供开箱即用的`Web网站`和`Admin中后台` |
| UI库                                                    | Daisyui + Tailwindcss                                    | VuetifyJS                              |
| Form/Table动态渲染                                      | 提供基于Daisyui的UI组件                                  | 提供基于VuetifyJS的UI组件              |
| Admin中后台支持 SSR                                     | ✅                                                       | ✅                                     |
| 双层页签导航                                            | ✅                                                       | ✅                                     |
| `Tanstack Table/Tanstack Form/Tanstack Query`的最佳实践 | ✅                                                       | ✅                                     |

## 研发历程

### 1. 2016年：V1-V4

2016 年启动 CabloyJS 开发。CabloyJS 最初是基于 JavaScript 的全栈 NodeJS 框架，经过 V1、V2、V3、V4 等大版本的演进，不断完善架构。

- 有网友评价：`CabloyJS 是教科书式的框架`
- 也有建议：`如果 CabloyJS 支持 TypeScript，采用前后端分离架构，就可以带来全新的全栈开发体验`

### 2. 2023年: V5研发

2023 年，经过充分评估和验证，CabloyJS V5 采用全新架构理念进行彻底重构。基于 TypeScript 开发，采用前后端分离架构，孵化出两个底层框架：

- **ZovaJS**：直观的前端框架 = Vue3 响应式 + React TSX + Angular IOC
- **VonaJS**：全栈框架，支持单代码库构建`SSR/SPA/Web网站/Admin中后台`，内置前后端类型共享能力

### 3. 2026年：V5发布

2026-04-13，ZovaJS V5 和 VonaJS V5 正式发布。CabloyJS V5 在全新底层框架之上，不断提供更多高级能力，进一步提升开发体验和效率，践行`教科书式框架`的愿景和使命。

## License

MIT License.

Copyright (c) 2016-present, Vona/Zova/Cabloy.
