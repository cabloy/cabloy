# Cabloy.js

Cabloy.js是基于EggBorn.js开发的一款顶级Javascript全栈业务开发框架

> Vue.js + Framework7 + Koa.js + Egg.js + MySQL

[![NPM version][npm-image]][npm-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![NPM download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/cabloy.svg?style=flat-square
[npm-url]: https://npmjs.org/package/cabloy
[david-image]: https://img.shields.io/david/zhennann/cabloy.svg?style=flat-square
[david-url]: https://david-dm.org/zhennann/cabloy
[snyk-image]: https://snyk.io/test/npm/cabloy/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/cabloy
[download-image]: https://img.shields.io/npm/dm/cabloy.svg?style=flat-square
[download-url]: https://npmjs.org/package/cabloy

## 文档

- [官网 && 文档](http://cabloy.org)

## 演示

- PC：[http://demo.cabloy.org](http://demo.cabloy.org)
- Mobile：![](./docs/assets/images/cabloy-demo-qrcode.png)

## EggBorn.js是什么
EggBorn.js是一款顶级Javascript全栈开发框架。前端采用Vue.js + Framework7 + Webpack，后端采用Koa.js + Egg.js，数据库采用mysql。
EggBorn.js在纵向上，将前端和后端打通，形成一个有机的整体，避免前端和后端各自为政的状况；
EggBorn.js在横向上，提炼出“业务模块化”的代码组织模式，通过不同的模块组合实现业务开发，也为大型Web应用不断增长的业务需求提供有力的基础架构。

## 再谈Cabloy.js
EggBorn.js只是一个基础的全栈开发框架，如果要进行业务开发，还需要考虑许多与业务相关的支撑特性，如：用户管理、角色管理、权限管理、菜单管理、参数设置管理、表单验证、登录机制，等等。特别是在前后端分离的场景下，对权限管理的要求就提升到一个更高的水平。
Cabloy.js在EggBorn.js的基础上，通过“业务模块”的方式，实现一系列支持特性，并将这些特性进行有机的组合，形成完整而灵活的上层生态架构，从而支持具体的业务开发进程。

## Cabloy.js架构图

![](./docs/assets/images/cabloy.png)

## 先决条件

!> 凡是可以用 JavaScript 来写的应用，最终都会用 JavaScript 来写。 ——Atwood定律

相信，Javascript的深度探索者都会被这句名言激发，共同努力，为Javascript生态添砖加瓦，构建更繁荣的应用生态。
Cabloy.js正是对这一名言的探索之作。Cabloy.js不重复造轮子，而是采用业界最新的开源技术，进行全栈开发的最佳组合。因此，也深度建议您在继续后面的阅读之前，最好能对以下框架有所了解和认知。

- 前端
   - [Vue.js](https://vuejs.org)
   - [Framework7](http://framework7.io)
   - [Webpack](http://framework7.io)
- 后端
   - [koa.js](https://koajs.com)
   - [Egg.js](https://eggjs.org)
   - [EggBorn.js](/zh-cn/eggborn/basic/)

## Cabloy名字的由来

Cabloy来自蓝精灵的魔法咒语，拼对了Cabloy这个单词就会有神奇的效果。同样，Cabloy.js是有关化学的魔法，基于原子的组合与生化反应，您将实现您想要的任何东西。
