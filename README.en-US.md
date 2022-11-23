English | [简体中文](./README.md)

# CabloyJS

A Node.js full-stack framework with workflow engine, based on koa + egg + vue + framework7 + mysql

[![LICENSE MIT][license-image]][license-url]
[![NPM version][npm-image]][npm-url]
[![Unit Test][test-image]][test-url]
[![Test coverage][codecov-image]][codecov-url]
[![NPM download][download-image]][download-url]
[![NPM Mirror download][download-image-mirror]][download-url-mirror]
[![Lerna][lerna-image]][lerna-url]
[![Chat on Telegram](https://img.shields.io/badge/Chat%20on-Telegram-brightgreen.svg)](https://t.me/cabloyjs)

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/zhennann/cabloy/blob/master/LICENSE
[npm-image]: https://img.shields.io/npm/v/cabloy.svg?style=flat-square
[npm-url]: https://npmjs.com/package/cabloy
[test-image]: https://github.com/zhennann/cabloy/workflows/actions-unittest/badge.svg
[test-url]: https://github.com/zhennann/cabloy/actions
[codecov-image]: https://img.shields.io/codecov/c/github/zhennann/cabloy.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/zhennann/cabloy
[lerna-image]: https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg
[lerna-url]: https://lernajs.io
[download-image]: https://img.shields.io/npm/dm/cabloy?color=orange&label=npm%20downloads
[download-url]: https://npmjs.com/package/cabloy
[download-image-mirror]: https://npmmirror.com/badge/d/cabloy.svg
[download-url-mirror]: https://npmmirror.com/package/cabloy

## Goals, History, Faith

- [About CabloyJS](https://cabloy.com/articles/introduce.html)

## Documentations

- [Website && Documentations](https://cabloy.com)

## Demonstration

| Scene  | Link/Qrcode                                                        |
| ------ | ------------------------------------------------------------------ |
| PC     | https://test.cabloy.com/                                           |
| Mobile | ![cabloy-demo-qrcode](./docs/assets/images/cabloy-demo-qrcode.png) |

| Account Type | Name  | Password |
| ------------ | ----- | -------- |
| Admin User   | admin | 123456   |
| Normal User  | tom   | 123456   |
| Normal User  | jane  | 123456   |

## More Websites Powered by CabloyJS

| Website Type                      | Website Link                                                                                   |
| --------------------------------- | ---------------------------------------------------------------------------------------------- |
| Admin System(PC Layout)           | [https://admin.cabloy.com](https://admin.cabloy.com)                                           |
| Admin System(Mobile Layout)       | ![cabloy-admin-qrcode](./docs/assets/images/cabloy-admin-qrcode.png)                           |
|                                   |                                                                                                |
| Blog                              | [https://zhennann.com](https://zhennann.com)                                                   |
| Technical Documentations(English) | [https://cabloy.com/index.html](https://cabloy.com/index.html)                                 |
| Technical Documentations(Chinese) | [https://cabloy.com/zh-cn/index.html](https://cabloy.com/zh-cn/index.html)                     |
| Community(English)                | [https://community.cabloy.com/index.html](https://community.cabloy.com/index.html)             |
| Community(Chinese)                | [https://community.cabloy.com/zh-cn/index.html](https://community.cabloy.com/zh-cn/index.html) |
| Cabloy Store(English)             | [https://store.cabloy.com/index.html](https://store.cabloy.com/index.html)                     |
| Cabloy Store(Chinese)             | [https://store.cabloy.com/zh-cn/index.html](https://store.cabloy.com/zh-cn/index.html)         |

## Features

### - Part One: Basic

- Bean & AOP
  1. Almost everything is Bean
  2. Bean supports AOP
  3. AOP is also Bean
- Cluster Framework based on `Redis`
  - [Broadcast](https://cabloy.com/articles/broadcast.html)
  - [Queue](https://cabloy.com/articles/queue.html)
  - [Schedule](https://cabloy.com/articles/schedule.html)
  - [Startup](https://cabloy.com/articles/startup.html)
- [Frontend and Backend Separation](https://cabloy.com/articles/3e5e9fcb2a37471889ad117ccee29c85.html)
- I18N
  - [Backend](https://cabloy.com/articles/70bbc388147540338aa626768a4836ed.html)
  - [Front](https://cabloy.com/articles/bd3ae53c2b3543ada207c6af083bb522.html)
- [Theme](https://cabloy.com/articles/theme.html)
- [Multi-Tenant/Multi-Domain/Multi-Instance](https://cabloy.com/articles/49e49e0dadfe4ed39687e4a06f012397.html)
- [Test-Driven Development](https://cabloy.com/articles/d22e7290f7d0452ebc2d051c3030e6e8.html)

### - Part Two: Business

- [NodeJS Workflow Engine](https://cabloy.com/articles/flow-introduce.html)
- [Adaptive Layout: pc = mobile + pad](https://cabloy.com/articles/adaptive-layout.html)
- Drag & Drop
  - [Move](https://cabloy.com/articles/dragdrop-move.html)
  - [Resize](https://cabloy.com/articles/dragdrop-resize.html)
- [Dashboard](https://cabloy.com/articles/e6848b3c477b4807b78986e1e0342717.html)
- [Layout PC](https://cabloy.com/articles/8635ddb9fba041778ef3621f257e1da4.html)
- [Unified Data Management](https://cabloy.com/articles/atom-basic.html)
- [Unified User Role Privilege Management](https://cabloy.com/articles/10c0b3a60d2a4e5f9c9b38d35bbf4101.html)
- Socket IO
  - Stats Value Update and Push Automatically
  - [Progress Bar](https://cabloy.com/articles/progress-bar.html)
- [Built-in many core modules](https://cabloy.com/articles/ce7ea65e7c5240ca88daf6aa849baaed.html)

## Resources

### - Version - English

- [CabloyJS Store](https://store.cabloy.com/index.html)
- [CabloyJS Community](https://community.cabloy.com/index.html)
- [CabloyJS Awesome](./docs/awesome.md)

### - Version - Chinese

- [CabloyJS 商店](https://store.cabloy.com/zh-cn/index.html)
- [CabloyJS 社区](https://community.cabloy.com/zh-cn/index.html)
- [CabloyJS Awesome](./docs/awesome.zh-CN.md)

### - CabloyJS 官方交流群

请添加个人微信，联系加群，备注：`加群`

![wx-zhennann](./docs/assets/images/wx-zhennann.jpg)

### - 文章

- [一文读懂 NodeJS 全栈开发利器：CabloyJS（万字长文）](https://community.cabloy.com/zh-cn/articles/known-cabloyjs.html)

### - 视频

- [网易免费课程 - CabloyJS 全栈业务开发实战](https://study.163.com/course/courseMain.htm?courseId=1209403891)

## License

[MIT](./LICENSE), Free commercial use
