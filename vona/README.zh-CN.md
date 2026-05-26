简体中文 | [English](./README.md)

# Vona 是什么

Vona 是一款全栈框架，支持单代码库构建`SSR/SPA/Web网站/Admin中后台`，采用前后端分离架构，并内置前后端类型共享能力

- 提供 DTO 动态推断与生成能力，减少重复的类型定义工作，提升开发效率
- 支持双层页签导航，实现高效页面切换，并保持页面状态
- 可动态渲染 CRUD 的列表页、条目页、搜索表单，并且提供了`Tanstack Table/Tanstack Form/Tanstack Query`的最佳实践

[![LICENSE MIT][license-image]][license-url]
[![NPM version][npm-image]][npm-url]
[![Test coverage][cov-image]][cov-url]
[![NPM download][download-image]][download-url]

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/vonajs/vona/blob/master/LICENSE
[npm-image]: https://img.shields.io/npm/v/vona.svg?style=flat-square
[npm-url]: https://npmjs.com/package/vona
[cov-image]: https://img.shields.io/codecov/c/github/vonajs/vona.svg?style=flat-square
[cov-url]: https://app.codecov.io/github/vonajs/vona
[download-image]: https://img.shields.io/npm/dm/vona?color=orange&label=npm%20downloads
[download-url]: https://npmjs.com/package/vona

## 全栈机制

Vona 采用前后端分离的架构。前端使用 Zova 框架，将构建生成的 JS bundle 放入 Vona 后端，在后端直接进行 SSR 渲染

前后端类型共享机制:

- 后端生成 Swagger/Openapi Schema，用于在前端生成 Api SDK
- 前端生成图标、路由和组件的类型，用于在后端提供类型提示

## 文档

- [文档](https://vona.js.org/zh/guide/start/introduction.html)

## 在线演示

使用同一套代码实现 Cabloy Store 的`Web网站`和`Admin中后台`

- Web 网站：[https://cabloy.com](https://cabloy.com)
- Admin 中后台：[https://cabloy.com/admin](https://cabloy.com/admin)

## 动图演示

- 双层页签导航

![](./packages-docs/zh/assets/img/start/cabloy-start-two-level-tabs.gif)

## 技术栈

### 通用

| 名称       | 版本      |
| ---------- | --------- |
| pnpm       | >=10.19.0 |
| Nodejs     | >=24.8.0  |
| Typescript | >=5.9.3   |

### 后端(Vona)

| 名称       | 版本     |
| ---------- | -------- |
| Koa        | >=3.0.0  |
| Knex       | >=3.1.0  |
| Zod        | >=4.1.13 |
| Redis      | >=7.2.6  |
| Sqlite3    | 内置     |
| MySQL      | >=8      |
| Postgresql | >=16     |

- `Redis`: VonaJS 基于 Redis 提供了以下能力:
  - `队列、定时任务、启动项、广播、缓存、二级缓存、分布式锁`
- `Sqlite3`: 需要预先准备 node-gyp 环境，确保在安装依赖时可以正常编译出`better_sqlite3.node`

### 前端(Zova)

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

## License

[MIT](./LICENSE)

Copyright (c) 2016-present, Vona
