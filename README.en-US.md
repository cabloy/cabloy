English | [简体中文](./README.md)

# CabloyJS

CabloyJS: The Ultimate NodeJS Full Stack Business Development Platform, based on KoaJS + EggJS + VueJS + Framework7

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

## Articles

- [一文读懂NodeJS全栈开发利器：CabloyJS（万字长文）](https://community.cabloy.com/zh-cn/articles/known-cabloyjs.html)

## Docs

- [Website && Documentations](https://cabloy.com)

## Demonstration

- PC：[https://admin.cabloy.com](https://admin.cabloy.com)
- Mobile：

![](./docs/assets/images/cabloy-demo-qrcode.png)

## Core Modules

### Build-in Modules

|Name|Description|
|--|--|
|[egg-born-front](https://github.com/zhennann/egg-born-front)|The Core of Frontend|
|[egg-born-backend](https://github.com/zhennann/egg-born-backend)|The Core of Backend|
|[egg-born-bin](https://github.com/zhennann/egg-born-bin)|Command-line tools|
|[egg-born-scripts](https://github.com/zhennann/egg-born-scripts)|Command-line tools for start/stop backend service|
|[egg-born-module-a-version](https://github.com/zhennann/egg-born-module-a-version)|Module Data Version|
|[egg-born-module-a-authgithub](https://github.com/zhennann/egg-born-module-a-authgithub)|Github Login|
|[egg-born-module-a-authsimple](https://github.com/zhennann/egg-born-module-a-authsimple)|Username/Password Login|
|[egg-born-module-a-base-sync](https://github.com/zhennann/egg-born-module-a-base-sync)|The core of business：User、Role、Right、Atom、Simple Workflow, etc.|
|[egg-born-module-a-baseadmin](https://github.com/zhennann/egg-born-module-a-baseadmin)|The UI Management of the core of business|
|[egg-born-module-a-cache](https://github.com/zhennann/egg-born-module-a-cache)|Cache|
|[egg-born-module-a-captcha](https://github.com/zhennann/egg-born-module-a-captcha)|Captcha Framework|
|[egg-born-module-a-captchasimple](https://github.com/zhennann/egg-born-module-a-captchasimple)|A implementation for captcha|
|[egg-born-module-a-components-sync](https://github.com/zhennann/egg-born-module-a-components-sync)|Frontend UI Components|
|[egg-born-module-a-event](https://github.com/zhennann/egg-born-module-a-event)|Backend Event Mechanism|
|[egg-born-module-a-file](https://github.com/zhennann/egg-born-module-a-file)|File Upload|
|[egg-born-module-a-hook](https://github.com/zhennann/egg-born-module-a-hook)|Backend Hook|
|[egg-born-module-a-index](https://github.com/zhennann/egg-born-module-a-index)|Index of database|
|[egg-born-module-a-instance](https://github.com/zhennann/egg-born-module-a-instance)|Subdomains & Multiple Instances|
|[egg-born-module-a-layoutmobile](https://github.com/zhennann/egg-born-module-a-layoutmobile)|Mobile Layout|
|[egg-born-module-a-layoutpc](https://github.com/zhennann/egg-born-module-a-layoutpc)|PC Layout|
|[egg-born-module-a-login](https://github.com/zhennann/egg-born-module-a-login)|Login|
|[egg-born-module-a-mail](https://github.com/zhennann/egg-born-module-a-mail)|Send Email|
|[egg-born-module-a-markdownstyle](https://github.com/zhennann/egg-born-module-a-markdownstyle)|Markdown style, based on Github|
|[egg-born-module-a-mavoneditor](https://github.com/zhennann/egg-born-module-a-mavoneditor)|Markdown Editor, based on [mavonEditor](https://github.com/hinesboy/mavonEditor)|
|[egg-born-module-a-progress](https://github.com/zhennann/egg-born-module-a-progress)|Advanced progress indicator, supporing multi-level progress|
|[egg-born-module-a-sequence](https://github.com/zhennann/egg-born-module-a-sequence)|Sequence of atom data|
|[egg-born-module-a-settings](https://github.com/zhennann/egg-born-module-a-settings)|Settings Management|
|[egg-born-module-a-status](https://github.com/zhennann/egg-born-module-a-status)|Status Management|
|[egg-born-module-a-user](https://github.com/zhennann/egg-born-module-a-user)|User-related Functions|
|[egg-born-module-a-validation](https://github.com/zhennann/egg-born-module-a-validation)|Data Validation|
|[egg-born-module-test-cook](https://github.com/zhennann/egg-born-module-test-cook)|Test module, effective only in development and test environments|

### Optional Modules

|Name|Description|
|--|--|
|[egg-born-module-a-cms](https://github.com/zhennann/egg-born-module-a-cms)|CMS Module, quickly create static websites such as blogs, technical documents, communities(forums), company official websites, and provide necessary dynamic functions, such as comments, etc.|
|[egg-born-module-cms-sitecommunity](https://github.com/zhennann/egg-born-module-cms-sitecommunity)|Community Module|
|[egg-born-module-cms-themeaws](https://github.com/zhennann/egg-born-module-cms-themeaws)|Theme: AWS-style Blog|
|[egg-born-module-cms-themeblog](https://github.com/zhennann/egg-born-module-cms-themeblog)|Theme: Blog|
|[egg-born-module-cms-themecommunity](https://github.com/zhennann/egg-born-module-cms-themecommunity)|Theme: Community|
|[egg-born-module-cms-themedocs](https://github.com/zhennann/egg-born-module-cms-themedocs)|Theme: Technical Documents|
|[egg-born-module-cms-pluginbase](https://github.com/zhennann/egg-born-module-cms-pluginbase)|Plugin: Basic Functions|
|[egg-born-module-cms-pluginarticle](https://github.com/zhennann/egg-born-module-cms-pluginarticle)|Plugin: Basic Functions of Articles|
|[egg-born-module-cms-pluginbacktotop](https://github.com/zhennann/egg-born-module-cms-pluginbacktotop)|Plugin: Back to top|
|[egg-born-module-cms-pluginblock](https://github.com/zhennann/egg-born-module-cms-pluginblock)|Plugin: Markdown Customizable Block Framework|
|[egg-born-module-cms-pluginfixcontainersite](https://github.com/zhennann/egg-born-module-cms-pluginfixcontainersite)|Plugin: Fix the height of container|
|[egg-born-module-cms-pluginmarkdowngithub](https://github.com/zhennann/egg-born-module-cms-pluginmarkdowngithub)|Plugin: Markdown style, based on Github|
|[egg-born-module-cms-pluginrss](https://github.com/zhennann/egg-born-module-cms-pluginrss)|Plugin: RSS|
|[egg-born-module-cms-pluginsidebar](https://github.com/zhennann/egg-born-module-cms-pluginsidebar)|Plugin: Sidebar Components|
|[egg-born-module-cms-pluginsocialshare](https://github.com/zhennann/egg-born-module-cms-pluginsocialshare)|Plugin: Social Share (a set of buttons)|
|[egg-born-module-cms-plugintrack](https://github.com/zhennann/egg-born-module-cms-plugintrack)|Plugin: Google/Baidu/QQ Statistics|

## Bright Point and Pain Point

### 1. Bright Point：pc = mobile + pad

The most prominent bright point on CabloyJS: 
Through the mode of `pc = mobile + pad`, the `manipulation experience` and `development mode` of the mobile scene are brought into the PC scene. It not only significantly reduces the amount of code development and improves the efficiency of development, but also maintains the consistency of user manipulation experience

![pc-mobile-layout](./docs/assets/images/pc-mobile-layout.gif)

#### Mobile Layout

![](./docs/assets/images/layout-mobile.png)

#### PC Layout

![](./docs/assets/images/layout-pc.png)

### 2. Pain Point：Full Scene Business Development

The most prominent pain point on CabloyJS: Through modular architecture design, full-scene business can be rapidly developed

|Scene|Frontend|Backend|
|--|--|--|
| PC：Web | CabloyJS Frontend |CabloyJS Backend|
| PC：Exe | CabloyJS Frontend + Electron |CabloyJS Backend|
| Mobile：IOS | CabloyJS Frontend + Cordova |CabloyJS Backend|
| Mobile：Android | CabloyJS Frontend + Cordova |CabloyJS Backend|
| Wechat| CabloyJS Frontend + Wechat API |CabloyJS Backend|
| Wechat Enterprise| CabloyJS Frontend + Wechat API |CabloyJS Backend|
| DingTalk | CabloyJS Frontend + DingTalk API |CabloyJS Backend|
| Slack | CabloyJS Frontend + Slack API |CabloyJS Backend|

* Backend：Because of the complete frontend and backend separation design, only a set of CabloyJS backend code can be developed
* Frontend：All scenarios that can be based on H5 need only develop a set of CabloyJS frontend code

## Characteristics and Ideas

### 1. Characteristics

* CabloyJS is the best practice for full-stack development with NodeJS
* CabloyJS does not 'Reinvent the Wheel', but uses the latest open source technology, so as to achieve the best combination of the full-stack development technology
* The frontend of CabloyJS uses VueJS + Framework7, while the backend uses KoaJS + EggJS, and the database uses MySQL
* CabloyJS keeps track of the latest achievements in open source technology, and continues to optimize to keep the entire framework in the best status

### 2. Ideas

> Developed quickly and customized flexibly

To achieve this ideas, CabloyJS built-in developed a large number of core modules, so that you can build a complete web project in the shortest possible time. For example, when you build a new web project, you already have a complete user login and authentication system, also has `user management`, `role management`, `authority management`, and other functions

In addition, these built-in modules provide flexible customization features. You can also develop new modules to replace the built-in modules to achieve customization of the system

## What are the key issues to solve in CabloyJS?

1. Scene Fragmentation
2. Business Modularization

### 1. Scene Fragmentation

#### 1) Firstly, let's start with the `Mobile Scenario`

As we know, with the increasing popularity of smart phones, the demand scenarios and development scenarios faced by our developers are becoming increasingly fragmented, such as browsers, IOS, Android, as well as a large number of third-party platforms: Wechat, Wechat Enterprise, DingTalk, Facebook, Slack and so on.

With the performance of smart devices getting better and faster, H5 development will be the trend of the times for so many development scenarios. Only a set of code can be developed to run in all the above smart devices, which can not only significantly reduce the amount of development, but also significantly improve the efficiency of development. It is a great benefit to the development team and end users

#### 2) Then let's talk about the `PC scenario`

As mentioned above, using H5 technology, only a set of code can be developed to run in all smart devices. But there's another development scenario that hasn't been unified: `PC Scenario`

Due to the different screen display sizes, `PC Scene` and `Mobile Scene` have different operating styles. Some frontend UI frameworks, using the adaptive strategy, develop pages for PC scenarios. Although they can be viewed and used in Mobil scenarios, the experience is often unsatisfactory

> This is why some frontend frameworks always appear in pairs: such as Element-UI and Mint-UI, Ant Design and Ant Design Mobile

This also means that we still need to develop two sets of code when we are faced with both `PC Scene` and `Mobile Scene`. These duplicate workloads are often unacceptable in the face of many development requirements

#### 3) PC = MOBILE + PAD

The frontend of CabloyJS uses Framework7, which has been upgraded to the latest version of Framework7 V4. CabloyJS is a ingenious extension based on Framework7, which divides the pages of PC into several areas, and achieves the effect of multiple mobile and PAD on one PC side at the same time. In other words, when you buy a Mac, you work with multiple virtual mobile devices at the same time as you buy multiple IPhones and IPads, which significantly improves productivity and provides a very interesting experience.

#### 4) Actual Effect

> Picture Is Truth

![pc-mobile-layout](./docs/assets/images/pc-mobile-layout.gif)

### 2. Business Modularization

With the developing of the NodeJS technology, the experience of the frontend and backend development becomes smoother, and the development efficiency enhance significantly. However, some friends still doubt whether it can be competent for the development of large-scale web applications. Large-scale web applications are characterized by the need to develop a large number of page components as business grows. Faced with this situation, generally there are two solutions:

1. Build as a single page application: The disadvantage is that the deployment package is very large
2. All page components are loaded asynchronously: The disadvantage is that the pages are too scattered, so the frontend should interact with the backend frequently

CabloyJS implements the third solution:

3. The page components are classified by business requirements, which is business modularization, and implements the business module’s asynchronous loading mechanism. Thus it makes up the shortcomings of the first two solutions and satisfies the needs of the large-scale web application

In CabloyJS, all business development is based on business modules. For example, if we want to develop CMS, we will build a new business module, such as the implemented module `egg-born-module-a-cms`. The CMS module contains more than ten Vue page components, which will be built into a single JS bundle when officially released. At runtime, you can access any Vue page component in the CMS module by loading this JS bundle asynchronously

Therefore, in a large web system, even if there are dozens or even hundreds of business modules, code organization and development according to CabloyJS modularization strategy will neither appear a single huge deployment bundle nor a large number of fragmented JS bundles.

The modular system of CabloyJS has the following remarkable characteristics:

#### 1) Zero Configuration, Zero Code

That is to say, the modular asynchronous packaging strategy mentioned above is the core feature of the system that has been carefully tuned. We only need to develop the Vue page components as usual. At the time of building, the system will automatically package at the module level, and load asynchronously at run time

#### 2) Module Self-Consistent, Plug and Play

Each business module is a self-consistent whole, including the frontend code and backend code related to the business of this module, and adopts the frontend and backend separation mode

`Module self-consistency` is conducive not only to its own `high cohesion`, but also to the `full decoupling` of the whole system. Business modules only need to consider their own logical implementation, which is easy to achieve `full precipitation and sharing` of business and achieve `plug and play` effect

For example, if we want to develop file upload function, we still need to develop a lot of docking code when we find the appropriate upload component on the Internet and use it in our own project. That is to say, the upload components found on the Internet do not achieve sufficient precipitation, are not self-consistent, and can not achieve convenient sharing, to achieve the effect of `plug and play`


While, CabloyJS's built-in file upload module `egg-born-module-a-file` has realized the full precipitation of functions. Why? Because the business module itself contains frontend code and backend code, it has a large space to implement and can fully refine the upload logic

Therefore, it is extremely convenient to call the file upload function in CabloyJS. Taking CMS module as an example, uploading picture and getting picture URL only need 20 lines of code

`egg-born-module-a-cms/src/module/a-cms/front/src/pages/article/contentEdit.vue`

``` javascript
...
    onUpload(mode, atomId) {
      return new Promise((resolve, reject) => {
        this.$view.navigate('/a/file/file/upload', {
          context: {
            params: {
              mode,
              atomId,
            },
            callback: (code, data) => {
              if (code === 200) {
                resolve({ text: data.realName, addr: data.downloadUrl });
              }
              if (code === false) {
                reject();
              }
            },
          },
        });
      });

```

#### 3) Modular Isolation

In large-scale web projects, it is unavoidable to consider the conflict of names among various resources, variables and entities. To solve this problem, different development teams mostly standardize the naming of various entities. With the expansion of the project, this naming specification will still become very complex. If we are faced with an open system using modules developed by different teams, the risk of naming conflicts becomes more serious

CabloyJS uses a clever design to solve the hidden danger of naming conflicts once and for all. In CabloyJS, business modules adopt the following naming specifications:

```
egg-born-module-{providerId}-{moduleName}
```

* `providerId`: Provider Id, Github's Username is strongly recommended to ensure that modules contributed to the community do not conflict
* `moduleName`: Module Name

Because of the design mechanism of `module self-consistency`, we only need to solve the problem of uniqueness of module naming, so we can no longer be entangled by naming conflicts in module development

For example, the CMS module provides a frontend page route `config/list`. Obviously, such a short path has a high probability of appearing in other business modules. But in CabloyJS, such naming does not produce conflicts. When making page jumps within CMS modules, you can use `config/list` directly, which is called `relative path` reference. However, if other business modules want to jump to this page, they use `/a/cms/config/list`, which is called `absolute path` reference

For example, in the previous example, we call the upload file page by using the `absolute path`: `/a/file/file/upload`

`Module isolation` is the core feature of business module. This is because there are a large number of entities at the frontend and backend of the module that need this isolation. CabloyJS completes this isolation mechanism from the system level, which makes it easy and convenient for us to develop the actual module business

> Modular Frontend Isolation

`Modular Frontend Isolation` is accomplished by the core module `egg-born-front`, which achieves the isolation of the following entities:

1. Frontend Page Route: [See also](https://cabloy.com/zh-cn/articles/7503a4d34b83409ba6477135fa840736.html)
2. Frontend Configuration: [See also](https://cabloy.com/zh-cn/articles/3952948bf69e4fc2ae6930d1fc58ba0f.html)
3. Frontend State Management: [See also](https://cabloy.com/zh-cn/articles/096584b6a8174fea9039d745a812bea7.html)
4. Frontend I18n：[See also](https://cabloy.com/zh-cn/articles/1c7c9cf3861744c2a63ae134076c652f.html)

> Modular Backend Isolation
 
`Modular Backend Isolation` is accomplished by the core module `egg-born-backend`, which achieves the isolation of the following entities:

1. Backend API Route: [See also](https://cabloy.com/zh-cn/articles/515720864cc14d6b94c3194283272bb6.html)
2. Backend Service: [See also](https://cabloy.com/zh-cn/articles/fbe1d2789f1343fdb210e3acaac2097f.html)
3. Backend Model: [See also](https://cabloy.com/zh-cn/articles/d33153578d564a79a7ed1176944d0541.html)
4. Backend Configuration: [See also](https://cabloy.com/zh-cn/articles/13e14810cb124ac2908220caf4f29ac4.html)
5. Backend Error Handling: [See also](https://cabloy.com/zh-cn/articles/b81df4d4ed4d4428b286d41a8d7bbca3.html)
6. Backend I18n: [See also](https://cabloy.com/zh-cn/articles/f6d5a48f10dc40d3b8aed7862c23570b.html)

#### 4) Fast frontend build

CabloyJS uses WebPack to build the frontend of the project. Because the CabloyJS project is composed of a series of business modules, the module code can be pre-compiled in advance, which can significantly improve the speed of building the frontend of the whole project

In practice, if a project contains 40 business modules, it will take 70 seconds to build according to the normal build mode. With the precompiled mechanism, it only takes 20 seconds to complete. This has significant engineering significance for developing large-scale web projects

#### 5) Protecting business code

Business modules in CabloyJS can be built not only in frontend code, but also in backend code with WebPack. Backend code can also be built to specify whether it is ugly or not, a mechanism that meets the need to `protect business code`

> The foundation of CabloyJS backend is EggJS. How can we compile and build it?

The CabloyJS backend is extended on the basis of EggJS. Each business module has an entry file `main.js`, through which all JS codes of the backend can be serialized, so compilation and building can be easily realized

## Development Process of CabloyJS

The development of CabloyJS started in 2016. It has gone through two stages:

### Stage One：EggBornJS

EggBornJS implements a full-stack development framework with business modules as its core

For example, the module `egg-born-front` is the core module of the frontend of the framework, the module `egg-born-backend` is the core module of the backend of the framework, and the module `egg-born` is the command-line tool of the framework for creating the project skeleton

This is why all business modules are prefixed with `egg-born-module-`

### Stage Two：CabloyJS

EggBornJS is only a basic full-stack development framework. Considering business development, many business-related supporting features need to be provided, such as `User Management`, `Role Management`, `Permission Management`, `Menu Management`, `Settings Management`, `Form Validation`, `Login Mechanism`, and so on. Especially in the case of frontend and backend separation, the requirement of authority management is raised to a higher level

On the basis of EggBornJS, CabloyJS provided a set of core business modules, so as to realize a series of supporting features, which are organically combined to form a complete and flexible upper ecological architecture, thus supporting the specific business development process

> With EggBornJS, not only the components can be reused, but also the business modules do from now

> With CabloyJS, you can quickly develop all kinds of business applications

## CabloyJS Architecture Diagram

![](./docs/assets/images/cabloy.png)

## The Faith

> Any application that can be written in Javascript, will eventually be written in Javascript | Jeff Atwood (2007)

It is believed that the deep explorers of Javascript will be inspired by Atwood's law and work together to build a more prosperous application ecosystem for Javascript

CabloyJS is just an exploration of Atwood's law. Instead of repeating wheels, CabloyJS uses the latest open source technology in the industry to optimize full-stack development

Welcome to join the community ecology of CabloyJS to promote the prosperity and application of Javascript

## The Origin of Framework Name

### 1. EggBorn

The origin of this name is relatively simple, because there is Egg (backend framework), so there is EggBorn. There is an animated film called "Tianshu Qitan". Its originator is called "DanSheng". I like to watch it very much (inadvertently exposed the age😅)

### 2. Cabloy

Cabloy comes from the magic spell of the Smurfs. If you spell the word Cabloy correctly, it will have a magical effect. Likewise, CabloyJS is a magic about chemistry. Based on the combination and biochemical reactions of business modules, you will achieve whatever you want

## License

[LGPL](./LICENSE)

