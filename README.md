# CabloyJS

CabloyJS: The Ultimate Javascript Full Stack Business Development Platform, based on EggBornJS.

> Frontend：VueJS + Framework7

> Backend：KoaJS + EggJS

> Database：MySQL

[![NPM version][npm-image]][npm-url]
[![David deps][david-image]][david-url]
[![NPM download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/cabloy.svg?style=flat-square
[npm-url]: https://npmjs.org/package/cabloy
[david-image]: https://img.shields.io/david/zhennann/cabloy.svg?style=flat-square
[david-url]: https://david-dm.org/zhennann/cabloy
[download-image]: https://img.shields.io/npm/dm/cabloy.svg?style=flat-square
[download-url]: https://npmjs.org/package/cabloy

## Docs

- [Website && Documentations](https://cabloy.org)

## Demonstration

- PC：[https://admin.cabloy.org](https://admin.cabloy.org)
- Mobile：

![](./docs/assets/images/cabloy-demo-qrcode.png)

## adaptive layout: pc = mobile + pad

All pages are developed using the `Mobile First' strategy, while perfectly adapting to the `PC layout'

### Mobile Layout

![](./docs/assets/images/layout-mobile.png)

### PC Layout

![](./docs/assets/images/layout-pc.png)

## What is EggBornJS?

EggBornJS is the Ultimate Javascript Full Stack Framework

The frontend of EggBornJS uses `VueJS + Framework7 + Webpack`, while the backend uses `KoaJS + EggJS`, and the database uses `MySQL`

Vertically, EggBornJS make the frontend and the backend work together to form an organic wholeness, so as to avoid working independently between them

Horizontally, EggBornJS has refined a code organization mode called "business modularity", which could offer a powerful basic framework for the continually growing business demands of large-scale web applications through different module combinations

## Relationship between CabloyJS and EggBornJS

In brief:

1. `EggBornJS` is a full-stack `code loader`，and has defined a set of code specifications for full-stack development

2. On the basis of `EggBornJS`, `CabloyJS` provided a set of `core business modules`, in order to facilitate rapid business development

EggBornJS is only a basic full-stack development framework. Considering business development, many business-related supporting features need to be provided, such as `User Management`, `Role Management`, `Permission Management`, `Menu Management`, `Settings Management`, `Form Validation`, `Login Mechanism`, and so on. Especially in the case of frontend and backend separation, the requirement of authority management is raised to a higher level

On the basis of `EggBornJS`, `CabloyJS` provided a set of `core business modules`, so as to realize a series of supporting features, which are organically combined to form a complete and flexible upper ecological architecture, thus supporting the specific business development process

> With EggBornJS, not only the components can be reused, but also the business modules do from now

> With CabloyJS, you can quickly develop all kinds of business applications

## Relationship between EggBornJS and EggJS

`EggBornJS` consists of `egg-born-front`和`egg-born-backend`, which correspond to the loading mechanism of `frontend` and `backend` respectively

从本质上来看，`egg-born-backend`和`EggJS`都是加载器。但是，为了实现`业务模块化`的机制，`egg-born-backend`在`EggJS`的基础上做了许多特性增强，核心特性如下：

1. 在一个`业务模块`中，可以单独设置`后端路由、控制器、服务、中间件、国际化、config配置`等资源
2. 在`EggJS`中，这些资源都是通过`约定代码位置`的方式组织并加载的。而在`egg-born-backend`的`业务模块`中，这些资源都是通过`require`的方式显式组织并加载的。因此，`业务模块`可以进行单独编译
3. `业务模块`可单独编译，从而可以单独发布、单独部署，单独升级，从而促进CabloyJS整个生态圈的繁荣，进一步加速实际业务的开发
4. 另一方面，`业务模块`可单独编译，也可以满足`保护商业代码`的需求

## CabloyJS架构图

![](./docs/assets/images/cabloy.png)

## 信念

> 凡是可以用JavaScript来写的应用，最终都会用JavaScript来写 | Atwood定律

相信，Javascript的深度探索者都会被这句名言激发，共同努力，为Javascript生态添砖加瓦，构建更繁荣的应用生态

CabloyJS正是对这一名言的探索之作。CabloyJS不重复造轮子，而是采用业界最新的开源技术，进行全栈开发的最佳组合

欢迎您也加入CabloyJS的社区生态，一起促进Javascript的繁荣与应用

## Cabloy名字的由来

Cabloy来自蓝精灵的魔法咒语，拼对了Cabloy这个单词就会有神奇的效果。同样，CabloyJS是有关化学的魔法，基于原子的组合与生化反应，您将实现您想要的任何东西
