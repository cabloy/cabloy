# Introduction

## What is Vona?

Vona is a fullstack framework for building SSR/SPA/Website/Admin in one codebase, featuring frontend and backend separation and native type sharing.

- Supports dual-layer tabs navigation, enabling efficient page switching while maintaining page state
- Dynamically render CRUD list pages, entry pages, and search forms, while demonstrating best practices for Tanstack Table, Tanstack Form, and Tanstack Query
- Dynamically infer and generate DTOs to eliminate redundant type definitions and boost development productivity

## Fullstack Mechanism

Vona adopts a frontend-backend separation architecture. The frontend uses the Zova framework, and the built JS bundle is placed into the Vona backend for direct SSR rendering on the backend.

Frontend-backend type sharing mechanism:

- The backend generates Swagger/OpenAPI Schema for generating API SDK on the frontend
- The frontend generates types for icons, routes, and components for providing type hints on the backend

## Demo Online

The Website and Admin of Cabloy Store are built by one codebase.

- Website: [https://cabloy.com](https://cabloy.com)
- Admin: [https://cabloy.com/admin](https://cabloy.com/admin)

## GIF Demo

- Dual-layer tabs navigation

![](../../assets/img/start/cabloy-start-two-level-tabs.gif)

## Features

- `Fullstack`: Building `SSR/SPA/Website/Admin` in one codebase
- `Admin Supports SSR`: Provides full SSR support for Admin applications, preventing sidebar flickering on page refresh
- `CRUD Dynamic Rendering`: Dynamically render CRUD list pages, entry pages, and search forms, while demonstrating best practices for Tanstack Table, Tanstack Form, and Tanstack Query
- `DTO Infer and Generation`: Dynamically infer and generate DTOs to eliminate redundant type definitions and boost development productivity
- `Dual-layer Tabs Navigation`: Supports dual-layer tabs navigation, enabling efficient page switching while maintaining page state
- `Developed in TypeScript`: Provides comprehensive TypeScript type hints
- `Using ESM modules throughout`: Faster project startup
- `File-level precise HMR`: Makes the development experience smoother and more efficient
- `Complete modular system`: Module-based business segmentation makes code more cohesive and easier to reuse and share
- `IOC container and dependency lookup`: We recommend using `dependency lookup` to obtain bean instances directly from the container, making code writing more intuitive and elegant
- `Universal bean configuration capabilities`: All options of bean classes can be modified in App Config, significantly improving the scalability of the entire system and saving a large amount of configuration-related code
- `Bean global singleton`: `Async Local Storage` is used under the hood to implement a complete global singleton mechanism, ensuring very low memory usage and significantly improving garbage collection performance
- `Multi-tenancy`: Supports the development of multi-tenancy SaaS systems with a shared database schema, but data generated during operation is isolated
- `Multi-database and multi-datasource`: Supports multi-database and multi-datasource, and provides out-of-the-box read-write splitting and dynamic datasource capabilities
- `Database Transaction`: Built-in database transaction capabilities and support for transaction propagation mechanisms
- `Cli Commands`: Provides a large number of Cli commands for generating code skeletons for various resources
- `Menu Commands`: Execute Cli commands through the menus, significantly reducing mental overhead and improving the development experience
- `Configuration Capabilities Based on Multi-Dimensional Variables`: Loads env/config files based on multi-dimensional variables, providing a more flexible configuration mechanism and supporting more complex business scenarios
- `More Comprehensive AOP Programming`: Provides more comprehensive AOP programming capabilities, including controller aspect, internal aspect, and external aspect
- `Playground`: Provides a Playground, which allows us to test the code and verify the ideas very conveniently and quickly

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

Zova can be used with any UI library and comes with built-in project templates for several UI libraries, making it easy to use out of the box.

| Name        | Version  |
| ----------- | -------- |
| Daisyui     | >=5.3.2  |
| Tailwindcss | >=4.1.14 |
| Quasar      | >=2.18.1 |
| Vuetify     | >=4.0.1  |

## Philosophy

### 1. About Coding

Many frameworks showcase design elegance with the simplest cases, while ignoring the coding challenges of real business complexity.

As business grows and changes, project code can quickly degrade and become hard to maintain.

Zova addresses large-scale business complexity with a set of engineering solutions, allowing elegant and intuitive code even in complex systems.

This improves development efficiency and experience, while making subsequent iteration and maintenance easier.

### 2. About Performance

Many frameworks showcase high performance with simplified use cases, neglecting the challenges posed by real business complexity.

As systems scale, performance often suffers, requiring increasingly complex optimizations that bloat the codebase.

Vona takes a different approach: it integrates caching strategies into its core, providing built-in mechanisms such as two-layer cache, query cache, and entity cache.

This allows you to build large-scale systems elegantly while maintaining performance without extensive custom optimization code.

## Stay In Touch

- [Twitter](https://x.com/zhennann2024)
- [Bilibili](https://space.bilibili.com/454737998)

## License

MIT License.

Copyright (c) 2016-present, Vona.
