简体中文 | [English](./README.en-US.md)

# CabloyJS 是什么

CabloyJS 是一款自带`工作流引擎`的 Node.js 全栈框架，面向开发者的低代码开发平台。实现了真正意义的“`一次开发，到处运行`”的跨端跨平台理念。只需一套代码，即可同时实现`B端中后台管理系统`和`C端前台应用`。只需一套代码，即可同时跨端`PC`和`Mobile`，并且`Mobile端`是接近原生体验

CabloyJS 内置的每一项特性都做到精心调校，均体现了从`开箱即用`到`灵活定制`的无缝衔接，包括：角色系统、用户认证、菜单权限、数据权限、表单渲染、表单验证、工作流引擎、字典、仪表板、在线推送、页面主题、多语言国际化、CMS 渲染引擎、微信接口、企业微信接口、钉钉接口，等等

[![LICENSE MIT][license-image]][license-url]
[![NPM version][npm-image]][npm-url]
[![Unit Test][test-image]][test-url]
[![Test coverage][codecov-image]][codecov-url]
![](https://visitor-badge.glitch.me/badge?page_id=zhannann.cabloy)
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

## 技术栈

| 场景                     | 技术栈                   |
| ------------------------ | ------------------------ |
| 前端                     | vue2 + framework7        |
| 后端                     | koa2 + egg2              |
| 数据库                   | mysql                    |
| 分布式（缓存/队列/消息） | redis、bullmq、websocket |
| Markdown 富文本编辑      | Prosemirror              |

## 文档

- [官网 && 文档](https://cabloy.com)
- [在线教程](https://cabloy.com/zh-cn/articles/tutorial-introduce.html)

## API

- [Postman API 集](https://www.postman.com/cabloyjs/workspace/cabloyjs)(持续更新中)

## 视频课程

- [CabloyJS 全栈框架：从入门到精通(共 48 集)](https://course.cabloy.com/zh-cn/articles/A-001.html)
- [CabloyJS 全栈框架：功能特性演示(共 16 集)](https://course.cabloy.com/zh-cn/articles/A-002.html)
- [微信一起点菜项目进度复盘(持续更新中)](https://course.cabloy.com/zh-cn/articles/B-001.html)

## 在线演示

CabloyJS 提供了大量在线演示:

1. 演示如何在一套代码中同时开发`B端中后台管理系统`和`C端前台应用`
2. 演示如何在一套代码中同时跨端`pc`和`mobile`，并且`mobile端`是接近原生体验

因此，强烈建议您移步查看：[在线演示](https://cabloy.com/zh-cn/articles/demo-online2.html)

## CabloyJS 官方交流群

请添加个人微信，联系加群，备注：`加群`

![wx-zhennann](./docs/assets/images/wx-zhennann.jpg)

## 入门起步

如果您想在第一时间把 CabloyJS 全栈框架用起来，可以先查阅以下教程，对`开箱即用`的效果和`灵活定制`的机制有一个初步的认知：

### 0. 创建第一个 CabloyJS 项目

- 文档：[快速开始（项目模式）](https://cabloy.com/zh-cn/articles/guide-quick-start.html)

- 视频：[B 站：新建项目](https://www.bilibili.com/video/BV1JB4y1H7iH/?vd_source=8a2b870d6d5dc83f8f4b973c95613fd8)

### 1. 开箱即用起步

- 文档：[教程：业务表单与审批流](https://cabloy.com/zh-cn/articles/tutorial-crud-flow.html)

- 视频：[B 站：新建业务表单+审批工作流](https://www.bilibili.com/video/BV1yL4y1w7dc/?vd_source=8a2b870d6d5dc83f8f4b973c95613fd8)

### 2. 灵活定制起步

- 文档：[教程：前后端开发基本流程](https://cabloy.com/zh-cn/articles/tutorial-advanced-front-backend.html)

- 视频：[B 站：前后端开发基本流程](https://www.bilibili.com/video/BV1GU4y1D7AF/?vd_source=8a2b870d6d5dc83f8f4b973c95613fd8)

## 引言

> 凡是可以用 JavaScript 来写的应用，最终都会用 JavaScript 来写 | Atwood 定律

目前市面上出现的大多数与 NodeJS 相关的框架，基本都将 NodeJS 定位在`工具层`、`聚合层`、`中间层`、`代理层`，很少在业务层面进行深耕，认为这是 JAVA 的领域，NodeJS 不适合。这种思潮明显是与`Atwood 定律`相悖的

如果您想感受不同的 NodeJS 全栈开发体验，一定要试试自带工作流引擎的 CabloyJS 全栈开源框架。为了提升业务层面的开发效率和开发体验，CabloyJS 在前端和后端均提供了大量实用的工具和组件

## CabloyJS 解决了哪些现实痛点问题？

在 NodeJS 开发领域，目前(截止 2022 年 1 月)存在以下几个痛点问题：

### 1. 中后台管理系统如何更优雅的支持移动端？

随着移动终端的普及和升级换代，大量业务场景都需要移动端的支持，比如管理层需要通过手机查看统计数据、审核业务单据；运维人员通过手机远程查看服务器状态，并进行调整优化

我们知道，市面上大多数中后台管理系统，都是优先适配 PC 端，然而移动端体验却不佳，处于`勉强可用，但不好用`的阶段

此外，大多数`XXX Admin框架`和`中后台管理框架`其本质是`代码模版`。在具体开发项目时，直接在`代码模版`中编写代码。这样，虽然修改起来很直接，但是不利于模版的持续升级和优化；也不利于业务代码的持续沉淀和迁移（至其他项目）。因此，当把`代码模版`从源码仓库下载下来之后，`修改三分之一`，`增加三分之一`，`删减三分之一`，从此就与`代码模版`的后续升级版本绝缘了

### 2. NodeJS 领域没有好用的工作流引擎！

如果单说 CRUD，大多数编程语言的开发框架都可以轻松实现，这不应该成为 NodeJS 开发业务系统的核心优势。若要让 NodeJS 深入业务领域的开发，`工作流引擎`是一个绕不过去的核心组件

### 3. 拖拽式低代码平台已经成为鸡肋方案！

大多数业务表单不仅仅是一些字段的简单组合和增删改查，不同的业务都有自己独特的业务诉求，往往需要前端界面的定制和后端逻辑的定制。拖拽式低代码平台，对于业务人员而言没有足够的工具进行深入定制，对于研发人员而言也没有足够的机制深入开发

许多拖拽式低代码平台认识到了这一点，所以针对不同的业务场景提供官方预配置的套装解决方案，这同样也把业务人员和研发人员置于`不上不下`的尴尬境地，成为`食之无味 弃之可惜`的鸡肋平台

## CabloyJS 亮点介绍

基于上述分析的问题，CabloyJS 实现了如下`功能四大亮点`和`架构四大亮点`

### 1. 功能四大亮点

1. **自适应布局：pc = mobile + pad**

CabloyJS 首创`pc = mobile + pad`的自适应布局机制：只需要一套代码，`mobile端`达到原生效果，同时将`mobile端`的操控体验和开发模式无缝带入`pc端`

请大家分别在 PC 端和手机端打开`演示链接`: [https://test.cabloy.com/](https://test.cabloy.com/) ，来体会与众不同的自适应机制

2. **基于 JSON Schema 的表单自动渲染与数据验证引擎**

通过在一处定义`JSON Schema`，就可以同时支持前端的`表单自动渲染`和后端的`数据验证`，既能开箱即用又可灵活定制

3. **所见即所得的 Markdown 富文本编辑器及渲染引擎**

CabloyJS 基于`ProseMirror`搭建出来的`Markdown富文本编辑器`兼顾易用性和灵活性。`一般用户`即便不懂 Markdown 语法也可以无痛的使用，而懂得 Markdown 语法的`专业用户`则可以享受更加`便捷高效`的输入体验

4. **内置 NodeJS 工作流引擎**

CabloyJS 充分利用 JS 语言的灵活性和 JSON 格式的便捷性，提供的 `NodeJS工作流引擎`远比 JAVA 领域的`Activiti` 简洁易用

比如，我们一般只知道如何使用`Activiti`中提供的`活动节点`和`边界事件`，却很少有途径来了解如何开发`自定义的活动节点`和`自定义的边界事件`。由于`Activiti`的架构繁杂，大多数人甚至不愿意尝试去阅读源码。但是 CabloyJS 提供的`工作流引擎`却可以轻松的定制所有的工作流元素，而且源码层次清晰，易于学习

### 2. 架构四大亮点

作为一款面向开发者的低代码开发平台，为了将低代码的`开箱即用`和专业代码的`灵活定制`有机融合，CabloyJS 在架构层面主要做了以下几点：

1. **模块化开发体系与模块隔离**

为了满足大型业务系统开发的诉求，CabloyJS 采用`模块思维`规划系统架构，以业务功能为单位（比如出差申请），将与业务功能相关的前端组件与后端逻辑组织为一个`业务模块`，从而有利于业务功能的内聚与重用，也有利于以业务为单位进行团队分工

此外，业务模块内部的页面、数据、逻辑、路由、配置等元素均进行了命名空间隔离处理，从而避免模块之间的变量污染与冲突。换句话说，当我们在自己的业务模块中为某个资源命名时，不用担心其他业务模块是否存在相同名称的资源，从而减少心智负担

2. **原生分布式架构，支持集群部署**

EggJS 的定位是框架的框架，CabloyJS 后端在 EggJS 的基础上采用`自定义Loader`机制扩展出来了一套适配业务场景的新特性

比如，EggJS 原有的`Worker + Agent`进程模型，对于单机而言非常便利。但是面对多机集群，特别是基于`docker`的集群部署而言，`Agent进程`就失去了用武之地。更重要的是，如果一开始基于`Agent进程`进行开发，后续很难平滑的过渡到分布式场景。因此，CabloyJS 后端采用`Redis`，从框架底层就开始原生分布式的架构设计，并衍生出了`Broadcast、Queue、Schedule、Startup`等一系列分布式的开发组件，方便我们从一开始就进行分布式的开发。因此当系统起量后，可以轻松做集群扩展，参见：[Broadcast](https://cabloy.com/zh-cn/articles/broadcast.html), [Queue](https://cabloy.com/zh-cn/articles/queue.html), [Schedule](https://cabloy.com/zh-cn/articles/schedule.html), [Startup](https://cabloy.com/zh-cn/articles/startup.html)

3. **原生多实例/多域名/多租户设计，支援 SAAS 系统开发**

CabloyJS 通过`多实例`的概念来支持`多域名/多租户`SAAS 系统的开发。只需启动一个后端服务，即可支持多个实例同时运行。实例`共享数据表架构`，但运行中产生的数据是`相互隔离`的

4. **前后端分离，全平台跨端开发**

通过前后端分离的架构设计，可以支持全平台业务的快速跨端开发

| 场景                   | 前端                         | 后端          |
| ---------------------- | ---------------------------- | ------------- |
| PC：Web                | CabloyJS 前端                | CabloyJS 后端 |
| PC：Desktop            | CabloyJS 前端 + Electron     | CabloyJS 后端 |
| Mobile：IOS            | CabloyJS 前端 + Cordova      | CabloyJS 后端 |
| Mobile：Android        | CabloyJS 前端 + Cordova      | CabloyJS 后端 |
| 微信公众号             | CabloyJS 前端 + 微信 API     | CabloyJS 后端 |
| 企业微信               | CabloyJS 前端 + 企业微信 API | CabloyJS 后端 |
| 钉钉                   | CabloyJS 前端 + 钉钉 API     | CabloyJS 后端 |
| Slack                  | CabloyJS 前端 + Slack API    | CabloyJS 后端 |
| 小程序：微信、支付宝等 | Uni-app + CabloyJS 前端 SDK  | CabloyJS 后端 |

- `后端`：由于完整的前后端分离设计，只需开发一套 CabloyJS 后端代码即可
- `前端`：所有可基于 H5 的场景，只需开发一套 CabloyJS 前端代码即可
- `小程序`：提供 CabloyJS 前端 SDK 让 Uni-app 可以轻松对接 CabloyJS 后端代码

## CabloyJS 可以开发什么系统

1. 可以开发`多租户SAAS业务系统`
2. 可以开发前后端分离的`中后台业务管理系统`，如 OA、CRM、ERP、电商，等等
3. 可以开发`JAMStack`架构的`CMS内容管理系统`，支持 SEO 优化，如博客、技术文档、社区、知识店铺，等等
4. 既可以先开发`后台业务管理系统`，再延伸开发`CMS内容管理系统`；也可以反过来，先开发`CMS内容管理系统`，再延伸开发`后台业务管理系统`
5. 可以通过`Cordova`开发各类 App 应用，支持 IOS、Android
6. 可以通过`Electron`开发桌面应用
7. 可以开发微信公众号、企业微信、钉钉，等第三方平台的应用，解决`信息孤岛`的问题
8. 可以为`Uniapp小程序`开发后端 API 接口

## CabloyJS 的研发历程

CabloyJS 从 2016 年启动开发，主要历经两个研发阶段：

### 1. 第一阶段：EggBornJS

EggBornJS 关注的核心就是`模块化体系`与`模块隔离`，并以此实现一套完整的全栈开发框架

比如模块`egg-born-front`是框架前端的核心模块，模块`egg-born-backend`是框架后端的核心模块，模块`egg-born`是框架的命令行工具，用于创建项目骨架

> 这也是为什么所有业务模块都是以`egg-born-module-`为命名前缀的原因

### 2. 第二阶段：CabloyJS

EggBornJS 只是一个基础的全栈开发框架，如果要支持业务的快速开发，还需要考虑许多与业务相关的支撑特性，如：`工作流引擎`、`用户管理`、`角色管理`、`权限管理`、`菜单管理`、`参数设置管理`、`表单验证`、`登录机制`，等等。特别是在前后端分离的场景下，对`权限管理`的要求就提升到一个更高的水平

CabloyJS 在 EggBornJS 的基础上，提供了一套核心业务模块，从而实现了一系列业务支撑特性，并将这些特性进行有机的组合，形成完整而灵活的上层生态架构，从而支持具体的业务开发进程

> 有了 EggBornJS，从此可复用的不仅仅是组件，还有业务模块

> 有了 CabloyJS，您就可以快速开发各类业务应用

## 信念

> 凡是可以用 JavaScript 来写的应用，最终都会用 JavaScript 来写 | Atwood 定律

相信，Javascript 的深度探索者都会被这句名言激发，共同努力，为 Javascript 生态添砖加瓦，构建更繁荣的应用生态

CabloyJS 正是对这一名言的探索之作。欢迎您也加入 CabloyJS 的社区生态，一起促进 Javascript 的繁荣与应用

## 名称的由来

### 1. EggBorn

这个名称的由来比较简单，因为有了 Egg(后端框架)，所以就有了 EggBorn。有一部动画片叫《天书奇谭》，里面的萌主就叫“蛋生”，我很喜欢看（不小心暴露了年龄 😅）

### 2. Cabloy

Cabloy 来自蓝精灵的魔法咒语，拼对了 Cabloy 这个单词就会有神奇的效果。同样，CabloyJS 是有关化学的魔法，基于模块的组合与生化反应，您将实现您想要的任何东西

## 资源

### - 英文版

- [CabloyJS Store](https://store.cabloy.com/index.html)
- [CabloyJS Courses](https://course.cabloy.com/index.html)
- [CabloyJS Community](https://community.cabloy.com/index.html)
- [CabloyJS Awesome](./docs/awesome.md)

### - 中文版

- [CabloyJS 商店](https://store.cabloy.com/zh-cn/index.html)
- [CabloyJS 课程](https://course.cabloy.com/zh-cn/index.html)
- [CabloyJS 社区](https://community.cabloy.com/zh-cn/index.html)
- [CabloyJS Awesome](./docs/awesome.zh-CN.md)

### - CabloyJS 官方交流群

请添加个人微信，联系加群，备注：`加群`

![wx-zhennann](./docs/assets/images/wx-zhennann.jpg)

## License

[MIT](./LICENSE)，可免费商用
