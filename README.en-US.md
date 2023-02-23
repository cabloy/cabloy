English | [简体中文](./README.md)

# What is CabloyJS

CabloyJS is a NodeJS full-stack framework with `workflow engine`, a low-code development platform for developers, is also a PAAS platform with both `out-of-the-box` and `flexible-customization`. Only one set of codes is needed to realize the `backend admin management system` and the `frontend applications` at the same time. And only one set of codes is needed to adapt to `PC` and `Mobile` at the same time, and the `Mobile` is close to the native experience

Each built-in feature of CabloyJS has been carefully adjusted, which reflects the seamless connection of `flexible-customization` from `out-of-the-box`, including role system, user authentication, menu permission, data permission, form rendering, form verification, workflow engine, dictionary, dashboard, online push, page theme, multilingual internationalization and CMS rendering engine, etc.

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

## Technology Stack

| **Scene**                                    | Technology Stack         |
| :------------------------------------------- | :----------------------- |
| frontend                                     | vue2 + framework7        |
| backend                                      | koa2 + egg2              |
| database                                     | mysql                    |
| Distributed components (Cache/Queue/Message) | redis、bullmq、websocket |
| Markdown Editor                              | Prosemirror              |

## Documentations

- [Website && Documentations](https://cabloy.com)
- [Tutorials](https://cabloy.com/articles/tutorial-introduce.html)

## Demo Online

CabloyJS provides a large number of online demonstrations:

1. Demonstrate how to develop the backend admin management system and the frontend applications just in one set of codes

2. Demonstrate how to adapt `PC` and `Mobile` just in one set of codes, and the `mobile` is close to the native experiences

Therefore, it is strongly recommended that you go to: [Demo Online](https://cabloy.com/articles/demo-online.html)

## Communication

[![Chat on Telegram](https://img.shields.io/badge/Chat%20on-Telegram-brightgreen.svg)](https://t.me/cabloyjs)

## Getting Started

If you want to use the CabloyJS full stack framework immediately, you can refer to the following tutorials to have a preliminary understanding of the `out-of-the-box` effect and `flexible-customization` mechanism:

### 0. Create the first CabloyJS project

- Doc: [Quick Start (Project Mode)](https://cabloy.com/articles/guide-quick-start.html)

- Video: [Bilibili Video: 新建项目](https://www.bilibili.com/video/BV1JB4y1H7iH/?vd_source=8a2b870d6d5dc83f8f4b973c95613fd8) (Translation Wanted)

### 1. Start to out-of-the-box

- Doc: [Tutorial: Create Module](https://cabloy.com/articles/a5adc438c4a24985baee645028baea56.html)

- Video: [Bilibili Video: 新建业务表单+审批工作流](https://www.bilibili.com/video/BV1yL4y1w7dc/?vd_source=8a2b870d6d5dc83f8f4b973c95613fd8) (Translation Wanted)

### 2. Start to flexible-customization

- Doc：[Tutorial: Basic process of frontend and backend development](https://cabloy.com/articles/tutorial-advanced-front-backend.html)

- Video：[Bilibili Video: 前后端开发基本流程](https://www.bilibili.com/video/BV1GU4y1D7AF/?vd_source=8a2b870d6d5dc83f8f4b973c95613fd8) (Translation Wanted)

## Preface

> Any application that can be written in Javascript, will eventually be written in Javascript | Jeff Atwood (2007)

At present, most frameworks related to NodeJS basically use NodeJS as the tool layer, aggregation layer, middle layer, and agent layer, and rarely make deep efforts at the business domains. They think that the business domains are the fields of JAVA, and NodeJS is not suitable. This trend of thought is obviously contrary to `Atwood's law`

If you want to experience different NodeJS full stack development experiences, you must try CabloyJS full stack open source framework with workflow engine. In order to improve the development efficiency and experience at the business domains, CabloyJS provides a large number of practical tools and components at the frontend and backend

## What are the real pain points that CabloyJS has solved?

In NodeJS development, the following pain points exist (as of November 2022):

### 1\. How can the backend management system support the mobile more gracefully?

With the popularization and upgrading of mobile devices, a large number of business scenarios need mobile support. For example, managers needs to view statistical data and review business documents through mobile phones; the operation and maintenance personnel can remotely view the server status through their mobile phones and make adjustments and optimizations

At present, most of the admin management frameworks on the market are compatible with PC and Mobile by using `CSS media query`. However, the UI interaction experiences of PC and Mobile are different, and the page layouts are different either. Therefore, only relying on `CSS media query` can only make PC pages available on the Mobile, but it is far from achieving the effect of the native Mobile

### 2\. There is no useful workflow engine in NodeJS development!

For `CRUD` features, most programming language development frameworks can be easily implemented, which should not be the core advantage of NodeJS in developing business systems. To enable NodeJS to develop in the business domains, the workflow engine is a core component that cannot be bypassed

### 3\. Drag-and-drop low-code platform has become a chicken bone solution!

Most business forms are not just the simple combination of some fields and crud features. Different businesses have their own unique business demands, often requiring customization of the frontend interface and backend logic. As Drag-and-drop low-code platform, there are not enough tools for business personnel to conduct in-depth customization, nor enough mechanisms for R&D personnel to conduct in-depth development

## Highlights of CabloyJS

Based on the above analysis, CabloyJS has many highlights, such as:

### 1\. Features

CabloyJS provides a lot of features that shine in front of you. Here are only three examples:

1. Adaptive Layout: `pc = mobile + pad`

CabloyJS provides a unique adaptive layout of `pc=mobile+pad`, so that only one set of codes is needed to adapt to PC and mobile at the same time, and the mobile is close to the native interactive experience

2. form-rendering engine and data-validation engine based on JSON Schema

By defining JSON Schema at one place, you can support both the automatic rendering of forms at frontend and the data validation at backend, which can be used out-of-the-box and customized flexibly

3. Built-in NodeJS workflow engine

CabloyJS makes full use of the flexibility of JS language and the convenience of JSON format, and the NodeJS workflow engine provided is much simpler and easier to use than `Activiti` by JAVA

### 2\. Architectures

CabloyJS has developed many distinctive architecture designs. Here are only three examples:

1. Business Modularization & Module Isolation

In order to meet the demands of large-scale business system development, CabloyJS adopts the modular concept to plan the system architecture, and organizes the frontend components and backend logic related to business functions into a business module, which is conducive to the cohesion and reuse of business functions and the division of teams based on business

In addition, the page, data, logic, routing, configuration and other elements inside the business module are isolated by namespace, so as to avoid variable pollution and conflict between modules. In other words, when we name a resource in our own business module, we do not have to worry about whether there are resources with the same name in other business modules, thus reducing the mental burden

2. Native distributed architecture

The positioning of EggJS is the framework of the framework. CabloyJS backend uses a custom loader mechanism to expand a set of new features that adapt to business scenarios based on EggJS

For example, the original `Worker + Agent` process model of EggJS is very convenient for a single machine. However, when it comes to multi machine clusters, especially Docker based cluster deployment, `Agent` process lose its usefulness. More importantly, if the development is based on the `Agent` process at the beginning, it is difficult to smoothly transition to the distributed scene later. Therefore, the backend of CabloyJS uses `Redis`. It starts from the bottom of the framework to design a native distributed architecture, and has derived a series of distributed development components, such as `Broadcast`, `Queue`, `Schedule`, `Startup`, which facilitates distributed development from the beginning. Therefore, after the system is scaled up, cluster expansion can be easily done

> See Also: [Broadcast](https://cabloy.com/articles/broadcast.html), [Queue](https://cabloy.com/articles/queue.html), [Schedule](https://cabloy.com/articles/schedule.html), [Startup](https://cabloy.com/articles/startup.html)

3. Frontend & Backend Separation & Cross-platform development

Through the architecture design of frontend & backend separation, only one set of codes is needed to support the cross-platform development, including backend management system and frontend applications

| Platform          | **Frontend**                     | **Backend**      |
| :---------------- | :------------------------------- | :--------------- |
| PC: Web           | CabloyJS Frontend                | CabloyJS Backend |
| PC: Exe           | CabloyJS Frontend + Electron     | CabloyJS Backend |
| Mobile: IOS       | CabloyJS Frontend + Cordova      | CabloyJS Backend |
| Mobile: Android   | CabloyJS Frontend + Cordova      | CabloyJS Backend |
| Slack             | CabloyJS Frontend + Slack API    | CabloyJS Backend |
| Wechat            | CabloyJS Frontend + Wechat API   | CabloyJS Backend |
| Wechat Enterprise | CabloyJS Frontend + Wechat API   | CabloyJS Backend |
| DingTalk          | CabloyJS Frontend + DingTalk API | CabloyJS Backend |

- Backend: Because of the complete `frontend and backend separation`, only one set of CabloyJS backend code should be developed

- Frontend: All scenarios that can be based on H5 need only develop one set of CabloyJS frontend code

## What systems can CabloyJS develop?

1. Multi-tenant `SAAS` business system can be developed

2. Backend business management system can be developed, such as OA, CRM, ERP, e-commerce, etc.

3. `CMS` content management system with `JAMStack` architecture can be developed to support SEO optimization, such as blogs, technical documents, communities, knowledge stores, etc.

4. You can first develop the backend business management system, and then extend the development of `CMS` content management system; Alternatively, the `CMS` content management system can be developed first, and then the backend business management system can be extended

5. Various App applications can be developed through `Cordova` to support IOS and Android

6. You can develop desktop applications through `Electron`

## Development Stages of CabloyJS

The development of CabloyJS started in 2016. It has gone through two stages:

### 1\. Stage One：EggBornJS

EggBornJS implements a full-stack development framework with business modules as its core

For example, the module `egg-born-front` is the core module of the frontend of the framework, while the module `egg-born-backend` is the core module of the backend of the framework, and the module `egg-born` is the command-line tool of the framework for creating the project skeleton

This is why all business modules are prefixed with `egg-born-module-`

### 2\. Stage Two：CabloyJS

EggBornJS is only a basic full-stack development framework. Considering business development, many business-related supporting features need to be provided, such as `User Management`, `Role Management`, `Permission Management`, `Menu Management`, `Settings Management`, `Form Validation`, `Login Mechanism`, and so on. Especially in the case of `frontend and backend separation`, the requirement of permission management is raised to a higher level

On the basis of EggBornJS, CabloyJS provided a set of core business modules, so as to realize a series of supporting features, which are organically combined to form a complete and flexible upper ecological architecture, thus supporting the specific business development process

> With EggBornJS, not only the components can be reused, but also the business modules do from now

> With CabloyJS, you can quickly develop all kinds of business applications

## The Faith

> Any application that can be written in Javascript, will eventually be written in Javascript | Jeff Atwood (2007)

It is believed that the deep explorers of Javascript will be inspired by Atwood’s law and work together to build a more prosperous application ecosystem for Javascript

CabloyJS is just an exploration of Atwood’s law. Instead of repeating wheels, CabloyJS uses the latest open source technology in the industry to optimize full-stack development

Welcome to join the community ecology of CabloyJS to promote the prosperity and application of Javascript

## The Origin of Framework Name

### 1\. EggBorn

The origin of this name is relatively simple, because there is Egg (backend framework), so there is EggBorn. There is an animated film called “Tianshu Qitan”. Its originator is called “DanSheng”. I like to watch it very much (inadvertently exposed the age😅)

### 2\. Cabloy

Cabloy comes from the magic spell of the Smurfs. If you spell the word Cabloy correctly, it will have a magical effect. Likewise, CabloyJS is a magic about chemistry. Based on the combination and biochemical reactions of business modules, you will achieve whatever you want

## Communication

[![Chat on Telegram](https://img.shields.io/badge/Chat%20on-Telegram-brightgreen.svg)](https://t.me/cabloyjs)

## License

[MIT](./LICENSE), Free commercial use
