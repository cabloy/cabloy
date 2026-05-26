English | [简体中文](./README.zh-CN.md)

# Zova

Zova: The Intuitive Frontend Framework = Vue3 Reactive + React TSX + Angular IOC

- Built-in out-of-the-box SSR solution, building `SSR/SPA/Website/Admin-Dashboard` in one codebase
- Supports dual-layer tabs navigation, enabling efficient page switching while maintaining page state
- Dynamically render CRUD list pages, entry pages, and search forms, while demonstrating best practices for Tanstack Table, Tanstack Form, and Tanstack Query

[![LICENSE MIT][license-image]][license-url]
[![NPM version][npm-image]][npm-url]
[![NPM download][download-image]][download-url]

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/zovajs/zova/blob/master/LICENSE
[npm-image]: https://img.shields.io/npm/v/zova.svg?style=flat-square
[npm-url]: https://npmjs.com/package/zova
[download-image]: https://img.shields.io/npm/dm/zova?color=orange&label=npm%20downloads
[download-url]: https://npmjs.com/package/zova

## With UI libraries

Zova can be used with any UI library and comes with built-in project templates for several UI libraries, making it easy to use out of the box, including:

- Daisyui
- Quasar
- Vuetify
- Empty: Other UI libraries can be used based on this empty template

## Documentation

- [Docs](https://zova.js.org/guide/start/introduction.html)

## Demo Online 1

- [vue3 + ts + tsx + tailwindcss + daisyui](https://zova.js.org/zova-demo/)
  - admin/123456

## Demo Online 2

The Website and Admin-Dashboard of Cabloy Store are built by one codebase

- Website: [https://cabloy.com](https://cabloy.com)
- Admin-Dashboard: [https://cabloy.com/admin](https://cabloy.com/admin)

## GIF Demo

- Dual-layer tabs navigation

![](./packages-docs/assets/img/start/cabloy-start-two-level-tabs.gif)

## Technology Stack

### Core

| Name           | Version  |
| -------------- | -------- |
| Vite           | >=8.0.0  |
| Vue            | >=3.5.6  |
| Vue Router     | >=4.4.5  |
| Zod            | >=4.1.13 |
| Tanstack Query | >=5.92.5 |
| Tanstack Form  | >=1.23.5 |
| Tanstack Table | >=8.21.3 |

### UI Libraries

Zova can be used with any UI library and comes with built-in project templates for several UI libraries, making it easy to use out of the box

| Name        | Version  |
| ----------- | -------- |
| Daisyui     | >=5.3.2  |
| Tailwindcss | >=4.1.14 |
| Quasar      | >=2.18.1 |
| Vuetify     | >=4.0.1  |

## Stay In Touch

- [Twitter](https://x.com/zhennann2024)
- [Bilibili](https://space.bilibili.com/454737998)

## Thanks

- Thanks to Angular that ioc container of Zova was in part inspired by Angular
- Thanks to React that React’s pioneering JSX syntax has significantly improved the efficiency and experience of front-end development
- Thanks to Vue that Vue provides a very powerful reactive system and ecosystem. Without the support of these ecosystems, Zova would be difficult to implement

## License

[MIT](./LICENSE)

Copyright (c) 2016-present, Zova
