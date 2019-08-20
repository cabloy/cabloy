简体中文 | [English](./README.en-US.md)

# CabloyJS

CabloyJS是一款顶级NodeJS全栈业务开发框架, 基于KoaJS + EggJS + VueJS + Framework7

[![NPM version][npm-image]][npm-url]
[![David deps][david-image]][david-url]
[![NPM download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/cabloy.svg?style=flat-square
[npm-url]: https://npmjs.org/package/cabloy
[david-image]: https://img.shields.io/david/zhennann/cabloy.svg?style=flat-square
[david-url]: https://david-dm.org/zhennann/cabloy
[download-image]: https://img.shields.io/npm/dm/cabloy.svg?style=flat-square
[download-url]: https://npmjs.org/package/cabloy

## 文章

- [一文读懂NodeJS全栈开发利器：CabloyJS（万字长文）](https://community.cabloy.com/zh-cn/articles/known-cabloyjs.html)

## 文档

- [官网 && 文档](https://cabloy.com)

## 演示

- PC：[https://admin.cabloy.com](https://admin.cabloy.com)
- Mobile：

![](./docs/assets/images/cabloy-demo-qrcode.png)

## 核心资源一览表

- [CabloyJS Awesome](./awesome.md)

## 目标

支持全场景业务开发，省时、省力

## 亮点与痛点

### 1. 亮点：pc = mobile + pad

CabloyJS最大的亮点是：通过`pc=mobile+pad`的模式，把mobile场景的`操控体验`和`开发模式`带⼊pc场景。既显著减少了代码开发量，提升了开发效率，⼜保持了用户操控体验的⼀致性

![pc-mobile-layout](./docs/assets/images/pc-mobile-layout.gif)

### 2. 痛点：全场景业务开发

CabloyJS最大的痛点是：通过模块化的架构设计，可以快速开发全场景业务

|场景|前端|后端|
|--|--|--|
| PC：Web | CabloyJS前端 |CabloyJS后端|
| PC：Exe | CabloyJS前端 + Electron |CabloyJS后端|
| Mobile：IOS | CabloyJS前端 + Cordova |CabloyJS后端|
| Mobile：Android | CabloyJS前端 + Cordova |CabloyJS后端|
|微信公共号| CabloyJS前端 + 微信API |CabloyJS后端|
|企业微信| CabloyJS前端 + 微信API |CabloyJS后端|
| 钉钉 | CabloyJS前端 + 钉钉API |CabloyJS后端|
| Slack | CabloyJS前端 + Slack API |CabloyJS后端|
| 小程序：微信、支付宝、百度等 |小程序框架|CabloyJS后端|

* 后端：由于完整的前后端分离设计，只需开发一套CabloyJS后端代码即可
* 前端：所有可基于H5的场景，只需开发一套CabloyJS前端代码即可

## CabloyJS的开发历程

CabloyJS从2016年启动开发，主要历经两个开发阶段：

### 1. 第一阶段：EggBornJS

EggBornJS关注的核心就是`模块化`与`模块隔离`，并以此实现一套完整的全栈开发框架

比如模块`egg-born-front`是框架前端的核心模块，模块`egg-born-backend`是框架后端的核心模块，模块`egg-born`是框架的命令行工具，用于创建项目骨架

这也是为什么所有业务模块都是以`egg-born-module-`为命名前缀的原因

### 2. 第二阶段：CabloyJS

EggBornJS只是一个基础的全栈开发框架，如果要进行业务开发，还需要考虑许多与业务相关的支撑特性，如：`用户管理`、`角色管理`、`权限管理`、`菜单管理`、`参数设置管理`、`表单验证`、`登录机制`，等等。特别是在前后端分离的场景下，对`权限管理`的要求就提升到一个更高的水平

CabloyJS在EggBornJS的基础上，提供了一套核心业务模块，从而实现了一系列业务支撑特性，并将这些特性进行有机的组合，形成完整而灵活的上层生态架构，从而支持具体的业务开发进程

> 有了EggBornJS，从此可复用的不仅仅是组件，还有业务模块

> 有了CabloyJS，您就可以快速开发各类业务应用

## CabloyJS架构图

![](./docs/assets/images/cabloy.png)

## 信念

> 凡是可以用JavaScript来写的应用，最终都会用JavaScript来写 | Atwood定律

相信，Javascript的深度探索者都会被这句名言激发，共同努力，为Javascript生态添砖加瓦，构建更繁荣的应用生态

CabloyJS正是对这一名言的探索之作。CabloyJS不重复造轮子，而是采用业界最新的开源技术，进行全栈开发的最佳组合

欢迎您也加入CabloyJS的社区生态，一起促进Javascript的繁荣与应用

## 名称的由来

### 1. EggBorn

这个名称的由来比较简单，因为有了Egg(后端框架)，所以就有了EggBorn。有一部动画片叫《天书奇谭》，里面的萌主就叫“蛋生”，我很喜欢看（不小心暴露了年龄😅）

### 2. Cabloy

Cabloy来自蓝精灵的魔法咒语，拼对了Cabloy这个单词就会有神奇的效果。同样，CabloyJS是有关化学的魔法，基于模块的组合与生化反应，您将实现您想要的任何东西

## License

[LGPL](./LICENSE)
