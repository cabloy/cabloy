# 简介

## 什么是Zova？

Zova: 直观的前端框架 = Vue3 响应式 + React TSX + Angular IOC。

- 内置开箱即用的 SSR 解决方案，可在同一个代码库中实现`SSR/SPA/Web网站/Admin中后台`
- 支持双层页签导航，实现高效页面切换，并保持页面状态
- 可动态渲染 CRUD 的列表页、条目页、搜索表单，并且提供了`Tanstack Table/Tanstack Form/Tanstack Query`的最佳实践

## 与UI库的配合

Zova 可以搭配任何 UI 库使用，并且内置了几款 UI 库的项目模版，便于开箱即用，包括：

- Daisyui
- Quasar
- Vuetify
- Empty：可以在此基础上使用其他 UI 库

## 在线演示1

- [vue3 + ts + tsx + tailwindcss + daisyui](https://zova.js.org/zova-demo/)
  - admin/123456

## 在线演示2

使用同一套代码实现 Cabloy Store 的`Web网站`和`Admin中后台`

- Web 网站：[https://cabloy.com](https://cabloy.com)
- Admin 中后台：[https://cabloy.com/admin](https://cabloy.com/admin)

## 动图演示

- 双层页签导航

![](../../assets/img/start/cabloy-start-two-level-tabs.gif)

## 代码风格

Zova 提供更直观、更优雅、更强大的代码风格，融合 Vue3、React、Angular 的核心设计：

- `Vue3`: 直观响应式
- `React`: 灵活 TSX 渲染
- `Angular`: 强大 IOC 容器

## 特性

- `SSR`: 内置开箱即用的 SSR 解决方案，可在同一个代码库中实现`SSR/SPA/Web网站/Admin中后台`
- `双层页签导航`: 支持双层页签导航，实现高效页面切换，并保持页面状态
- `CRUD动态渲染`: 可动态渲染 CRUD 的列表页、条目页、搜索表单，并且提供了`Tanstack Table/Tanstack Form/Tanstack Query`的最佳实践
- `响应式系统`: 有了 IOC 容器的加持，定义响应式状态不再需要`ref/reactive`。因为不用`ref`，自然也就不用再写大量的`ref.value`
- `CSS-in-JS`: 内置 CSS-in-JS 的能力，让样式的开发更加灵活、便捷，同时提供了开箱即用的主题切换能力
- `统一状态管理`: 采用统一的 Model 机制封装状态数据，包括 Cookie、Localstorage 和 TanStack Query 管理的服务端数据
- `IOC + AOP`: 提供强大的 IOC + AOP 能力，让系统具有无与伦比的可扩展性和可维护性

## 技术栈

### 核心

| 名称           | 版本     |
| -------------- | -------- |
| Vite           | >=8.0.0  |
| Vue            | >=3.5.6  |
| Vue Router     | >=4.4.5  |
| Zod            | >=4.1.13 |
| Tanstack Query | >=5.92.5 |
| Tanstack Form  | >=1.23.5 |
| Tanstack Table | >=8.21.3 |

### UI库

Zova 可以搭配任何 UI 库使用，并且内置了几款 UI 库的项目模版，便于开箱即用。

| 名称        | 版本     |
| ----------- | -------- |
| Daisyui     | >=5.3.2  |
| Tailwindcss | >=4.1.14 |
| Quasar      | >=2.18.1 |
| Vuetify     | >=4.0.1  |

## 架构哲学

许多框架用最简场景证明设计优雅，却忽略业务复杂性带来的编码挑战。

随着业务增长与变化，项目代码容易迅速劣化、难以维护。

Zova 正视大型业务复杂性，提出一系列工程化解决方案，。

让大型业务系统的代码依然优雅直观，提升开发效率与体验，并更利于后续迭代与维护。

## 联系方式

- [Twitter](https://x.com/zhennann2024)
- [B站：濮水代码](https://space.bilibili.com/454737998)

## 致谢

- 向 Angular 表达感谢，Angular 激发了在 Vue 中实现 ioc 容器的灵感
- 向 React 表达感谢，React 首创的 JSX 语法显著提升了前端的开发效率和开发体验
- 向 Vue 表达感谢，Vue 提供了非常强大的响应式系统和生态。如果没有这些生态的支持，Zova 的实现将非常困难

## License

MIT License.

Copyright (c) 2016-present, Zova.
