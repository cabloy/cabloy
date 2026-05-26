简体中文 | [English](./README.md)

# Zova

Zova: 直观的前端框架 = Vue3 响应式 + React TSX + Angular IOC

- 内置开箱即用的 SSR 解决方案，可在同一个代码库中实现`SSR/SPA/Web网站/Admin中后台`
- 支持双层页签导航，实现高效页面切换，并保持页面状态
- 可动态渲染 CRUD 的列表页、条目页、搜索表单，并且提供了`Tanstack Table/Tanstack Form/Tanstack Query`的最佳实践
- 提供强大的 IOC + AOP 能力，让系统具有无与伦比的可扩展性和可维护性

[![LICENSE MIT][license-image]][license-url]
[![NPM version][npm-image]][npm-url]
[![NPM download][download-image]][download-url]

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/zovajs/zova/blob/master/LICENSE
[npm-image]: https://img.shields.io/npm/v/zova.svg?style=flat-square
[npm-url]: https://npmjs.com/package/zova
[download-image]: https://img.shields.io/npm/dm/zova?color=orange&label=npm%20downloads
[download-url]: https://npmjs.com/package/zova

## 与UI库的配合

Zova 可以搭配任何 UI 库使用，并且内置了几款 UI 库的项目模版，便于开箱即用，包括：

- Daisyui
- Quasar
- Vuetify
- Empty：可以在此基础上使用其他 UI 库

## 文档

- [文档](https://zova.js.org/zh/guide/start/introduction.html)

## 在线演示1

- [vue3 + ts + tsx + tailwindcss + daisyui](https://zova.js.org/zova-demo/)
  - admin/123456

## 在线演示2

使用同一套代码实现 Cabloy Store 的`Web网站`和`Admin中后台`

- Web 网站：[https://cabloy.com](https://cabloy.com)
- Admin 中后台：[https://cabloy.com/admin](https://cabloy.com/admin)

## 动图演示

- 双层页签导航

![](./packages-docs/zh/assets/img/start/cabloy-start-two-level-tabs.gif)

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

Zova 可以搭配任何 UI 库使用，并且内置了几款 UI 库的项目模版，便于开箱即用

| 名称        | 版本     |
| ----------- | -------- |
| Daisyui     | >=5.3.2  |
| Tailwindcss | >=4.1.14 |
| Quasar      | >=2.18.1 |
| Vuetify     | >=4.0.1  |

## 联系方式

- [Twitter](https://x.com/zhennann2024)
- [B站：濮水代码](https://space.bilibili.com/454737998)

## 致谢

- 向 Angular 表达感谢，Angular 激发了在 Vue 中实现 ioc 容器的灵感
- 向 React 表达感谢，React 首创的 JSX 语法显著提升了前端的开发效率和开发体验
- 向 Vue 表达感谢，Vue 提供了非常强大的响应式系统和生态。如果没有这些生态的支持，Zova 的实现将非常困难

## License

[MIT](./LICENSE)

Copyright (c) 2016-present, Zova
