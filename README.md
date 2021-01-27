简体中文 | [English](./README.en-US.md)

# CabloyJS

一款自带工作流引擎的Node.js全栈框架, 基于koa + egg + vue + framework7

[![NPM version][npm-image]][npm-url]
[![Unit Test][test-image]][test-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![NPM download][download-image]][download-url]
[![Chat on Telegram](https://img.shields.io/badge/Chat%20on-Telegram-brightgreen.svg)](https://t.me/cabloyjs)

[npm-image]: https://img.shields.io/npm/v/cabloy.svg?style=flat-square
[npm-url]: https://npmjs.org/package/cabloy
[test-image]: https://github.com/zhennann/cabloy/workflows/actions-unittest/badge.svg
[test-url]: https://github.com/zhennann/cabloy/actions
[codecov-image]: https://img.shields.io/codecov/c/github/zhennann/cabloy.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/zhennann/cabloy
[david-image]: https://img.shields.io/david/zhennann/cabloy.svg?style=flat-square
[david-url]: https://david-dm.org/zhennann/cabloy
[download-image]: https://img.shields.io/npm/dm/cabloy.svg?style=flat-square
[download-url]: https://npmjs.org/package/cabloy

## 目标、历史、信念

- [关于CabloyJS](https://cabloy.com/zh-cn/articles/introduce.html)

## 特性

### - 第一部分: 基础功能

- [Bean & AOP](https://cabloy.com/zh-cn/articles/bean.html)
  1. 几乎所有事物都是Bean
  2. Bean支持AOP
  3. AOP也是一种Bean
- 基于`Redis`的分布式集群框架
  - [Broadcast](https://cabloy.com/zh-cn/articles/broadcast.html)
  - [Queue](https://cabloy.com/zh-cn/articles/queue.html)
  - [Schedule](https://cabloy.com/zh-cn/articles/schedule.html)
  - [Startup](https://cabloy.com/zh-cn/articles/startup.html)
- [前后端分离](https://cabloy.com/zh-cn/articles/f66dc04c64ca43fa9e8ea30312ca714f.html)
- I18N
  - [后端](https://cabloy.com/zh-cn/articles/f6d5a48f10dc40d3b8aed7862c23570b.html)
  - [前端](https://cabloy.com/zh-cn/articles/1c7c9cf3861744c2a63ae134076c652f.html)
- [主题](https://cabloy.com/zh-cn/articles/theme.html)
- [多租户/多域名/多实例](https://cabloy.com/zh-cn/articles/44e45b3928ca4c6cb63809558145e000.html)
- [测试驱动开发](https://cabloy.com/zh-cn/articles/990962d4e3604fc099c27806de6d6be8.html)

### - 第二部分: 业务功能

- [NodeJS工作流引擎](https://cabloy.com/zh-cn/articles/flow-introduce.html)
- [自适应布局: pc = mobile + pad](https://cabloy.com/zh-cn/articles/adaptive-layout.html)
- 拖拽
  - [移动](https://cabloy.com/zh-cn/articles/dragdrop-move.html)
  - [调整尺寸](https://cabloy.com/zh-cn/articles/dragdrop-resize.html)
- [仪表板](https://cabloy.com/zh-cn/articles/5c90f4fd15174772adb34dfbf6d1adfb.html)
- [PC布局](https://cabloy.com/zh-cn/articles/28f14f839af5457b9243c9e9210d5324.html)
- [统一数据管理](https://cabloy.com/zh-cn/articles/atom-basic.html)
- [统一用户角色权限管理](https://cabloy.com/zh-cn/articles/535f42e8fb8c487fb33b88c9a9e56a7e.html)
- Socket IO
  - 统计值自动更新、自动推送机制
  - [进度条](https://cabloy.com/zh-cn/articles/10327f8fdae44d87b7604ba3fa9c1a89.html)
- [内置大量核心模块](https://cabloy.com/zh-cn/articles/e678d328cb5b4efdaf5d60c8df1ca691.html)

### - 第三部分: 解决方案

由于CabloyJS提供了大量的前端组件和后端特性，使得开发具体场景的业务也变得非常方便、流畅。CabloyJS仍然通过提供不同的`业务模块`来支援不同的业务场景开发

目前，CabloyJS提供了以下业务场景的解决方案

|名称|说明|
|--|--|
|[Cabloy-CMS](https://cabloy.com/zh-cn/articles/cms-introduce.html)|`动静结合(即JAMStack模式)`的CMS，可以快速构建`企业网站`、`博客`、`技术文档`、`社区`、`商城`等Web应用|
|[Cabloy-Community](https://cabloy.com/zh-cn/articles/community-introduce.html)|基于Cabloy-CMS开发的社区（论坛）Web应用|
|[Cabloy-微信](https://cabloy.com/zh-cn/articles/wechat-introduce.html)|`微信接口模块`，当前整合了`微信公众号`、`微信Web登录`和`微信小程序`的接口，达到`开箱即用`的使用效果。在`Cabloy-微信`的基础上，可以很方便的开发各类微信业务系统|
|[Cabloy-企业微信](https://cabloy.com/zh-cn/articles/wxwork-introduce.html)|`企业微信接口模块`，当前整合了`自建应用`和`企业微信小程序`的接口，达到`开箱即用`的使用效果。在`Cabloy-企业微信`的基础上，可以很方便的开发各类企业微信业务系统|
|[Cabloy-钉钉](https://cabloy.com/zh-cn/articles/dingtalk-introduce.html)|`钉钉接口模块`，当前整合了`H5微应用`和`钉钉小程序`的接口，达到`开箱即用`的使用效果。在`Cabloy-钉钉`的基础上，可以很方便的开发各类钉钉业务系统|
|[Cabloy-Uniapp](https://cabloy.com/zh-cn/articles/uniapp-introduce.html)|`Cabloy-Uniapp`专门为`Uniapp`应用提供了一套量身定制的`前端SDK`，用于便捷的访问CabloyJS提供的所有API接口，让`Uniapp`前端开发再无`后顾之忧`|

## 文档

- [官网 && 文档](https://cabloy.com)

## 在线演示

|网站类型|网站链接|
|--|--|
|管理系统（PC布局）|[https://admin.cabloy.com](https://admin.cabloy.com)|
|管理系统（Mobile布局）|![](./docs/assets/images/cabloy-demo-qrcode.png)|
|||
|博客|[https://zhennann.com](https://zhennann.com)|
|技术文档（英文）|[https://cabloy.com/index.html](https://cabloy.com/index.html)|
|技术文档（中文）|[https://cabloy.com/zh-cn/index.html](https://cabloy.com/zh-cn/index.html)|
|社区（英文）|[https://community.cabloy.com/index.html](https://community.cabloy.com/index.html)|
|社区（中文）|[https://community.cabloy.com/zh-cn/index.html](https://community.cabloy.com/zh-cn/index.html)|
|Cabloy商店（英文）|[https://store.cabloy.com/index.html](https://store.cabloy.com/index.html)|
|Cabloy商店（中文）|[https://store.cabloy.com/zh-cn/index.html](https://store.cabloy.com/zh-cn/index.html)|

## 资源

### - 英文版

- [CabloyJS Store](https://store.cabloy.com/index.html)
- [CabloyJS Community](https://community.cabloy.com/index.html)
- [CabloyJS Awesome](./docs/awesome.md)

### - 中文版

- [CabloyJS 商店](https://store.cabloy.com/zh-cn/index.html)
- [CabloyJS 社区](https://community.cabloy.com/zh-cn/index.html)
- [CabloyJS Awesome](./docs/awesome.zh-CN.md)

### - CabloyJS官方交流群

请添加个人微信，联系加群，备注：`加群`

  ![wx-zhennann](./docs/assets/images/wx-zhennann.jpg)

### - 文章

- [一文读懂NodeJS全栈开发利器：CabloyJS（万字长文）](https://community.cabloy.com/zh-cn/articles/known-cabloyjs.html)

### - 视频

- [网易免费课程 - CabloyJS全栈业务开发实战](https://study.163.com/course/courseMain.htm?courseId=1209403891)

### - 图片

一图胜千言

  ![how-to-read](./docs/assets/images/zh-cn/how-to-read.png)

## License

[MIT](./LICENSE)
