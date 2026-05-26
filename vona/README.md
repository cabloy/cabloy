English | [简体中文](./README.zh-CN.md)

# Vona

Vona is a fullstack framework for building SSR/SPA/Website/Admin in one codebase, featuring frontend and backend separation and native type sharing

- Supports dual-layer tabs navigation, enabling efficient page switching while maintaining page state
- Dynamically render CRUD list pages, entry pages, and search forms, while demonstrating best practices for Tanstack Table, Tanstack Form, and Tanstack Query
- Dynamically infer and generate DTOs to eliminate redundant type definitions and boost development productivity

[![LICENSE MIT][license-image]][license-url]
[![NPM version][npm-image]][npm-url]
[![Test coverage][cov-image]][cov-url]
[![NPM download][download-image]][download-url]

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/vonajs/vona/blob/master/LICENSE
[npm-image]: https://img.shields.io/npm/v/vona.svg?style=flat-square
[npm-url]: https://npmjs.com/package/vona
[cov-image]: https://img.shields.io/codecov/c/github/vonajs/vona.svg?style=flat-square
[cov-url]: https://app.codecov.io/github/vonajs/vona
[download-image]: https://img.shields.io/npm/dm/vona?color=orange&label=npm%20downloads
[download-url]: https://npmjs.com/package/vona

## Fullstack Mechanism

Vona adopts a frontend-backend separation architecture. The frontend uses the Zova framework, and the built JS bundle is placed into the Vona backend for direct SSR rendering on the backend

Frontend-backend type sharing mechanism:

- The backend generates Swagger/OpenAPI Schema for generating API SDK on the frontend
- The frontend generates types for icons, routes, and components for providing type hints on the backend

## Documentation

- [Docs](https://vona.js.org/guide/start/introduction.html)

## Demo Online

The Website and Admin of Cabloy Store are built by one codebase

- Website: [https://cabloy.com](https://cabloy.com)
- Admin: [https://cabloy.com/admin](https://cabloy.com/admin)

## GIF Demo

- Dual-layer tabs navigation

![](./packages-docs/assets/img/start/cabloy-start-two-level-tabs.gif)

## Technology Stack

### General

| Name       | Version   |
| ---------- | --------- |
| pnpm       | >=10.19.0 |
| Nodejs     | >=24.8.0  |
| Typescript | >=5.9.3   |

### Backend(Vona)

| Name       | Version  |
| ---------- | -------- |
| Koa        | >=3.0.0  |
| Knex       | >=3.1.0  |
| Zod        | >=4.1.13 |
| Redis      | >=7.2.6  |
| Sqlite3    | builtin  |
| MySQL      | >=8      |
| Postgresql | >=16     |

- `Redis`: VonaJS provides the following capabilities based on Redis:
  - `Queue, Schedule, Startup, Broadcast, Caching, Two-layer cache, and Redlock`
- `Sqlite3`: You need to set up the node-gyp environment in advance to ensure that `better_sqlite3.node` can be compiled properly when installing dependencies

### Frontend(Zova)

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

## License

[MIT](./LICENSE)

Copyright (c) 2016-present, Vona
