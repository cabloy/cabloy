# CabloyJS

CabloyJS: The Ultimate Javascript Full Stack Business Development Platform, based on EggJS & VueJS

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

Essentially, `egg-born-backend` and `EggJS' are both `code loaders`. However, in order to realize the mechanism of `business modularization`, `egg-born-backend` has made many enhancements on the basis of `EggJS'. The core features are as follows:

1. In a `business module`, resources such as `backend routes, controller, service, middleware, i18n, configuration` can be set separately

2. In `EggJS`, these resources are organized and loaded by `predefined file location`. In the `business module` of `egg-born-backend`, these resources are explicitly organized and loaded by `require`. Thus, `business module` can be compiled separately

3. `Business modules` can be compiled separately, so that they can be released separately, deployed separately and upgraded separately, thus promoting the prosperity of the whole ecosystem of CabloyJS and further accelerating the development of actual business

4. On the other hand, `business modules` can be compiled separately may meet the requirement of `protecting business code`

## CabloyJS Architecture Diagram

![](./docs/assets/images/cabloy.png)

## Faith

> Any application that can be written in Javascript, will eventually be written in Javascript | Jeff Atwood (2007)

It is believed that the deep explorers of Javascript will be inspired by Atwood's law and work together to build a more prosperous application ecosystem for Javascript

CabloyJS is just an exploration of Atwood's law. Instead of repeating wheels, CabloyJS uses the latest open source technology in the industry to optimize full-stack development

Welcome to join the community ecology of CabloyJS to promote the prosperity and application of Javascript

## The Origin of Cabloy's Name

Cabloy comes from the magic spell of the Smurfs. If you spell the word Cabloy correctly, it will have a magical effect. Likewise, CabloyJS is a magic about chemistry. Based on the combination of atoms and biochemical reactions, you will achieve whatever you want
