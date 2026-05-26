# Introduction

## What is Zova?

Zova: The Intuitive Frontend Framework = Vue3 Reactive + React TSX + Angular IOC.

- Built-in out-of-the-box SSR solution, building `SSR/SPA/Website/Admin-Dashboard` in one codebase
- Supports dual-layer tabs navigation, enabling efficient page switching while maintaining page state
- Dynamically render CRUD list pages, entry pages, and search forms, while demonstrating best practices for Tanstack Table, Tanstack Form, and Tanstack Query

## With UI libraries

Zova can be used with any UI library and comes with built-in project templates for several UI libraries, making it easy to use out of the box, including:

- Daisyui
- Quasar
- Vuetify
- Empty: Other UI libraries can be used based on this empty template

## Demo Online 1

- [vue3 + ts + tsx + tailwindcss + daisyui](https://zova.js.org/zova-demo/)
  - admin/123456

## Demo Online 2

The Website and Admin-Dashboard of Cabloy Store are built by one codebase.

- Website: [https://cabloy.com](https://cabloy.com)
- Admin-Dashboard: [https://cabloy.com/admin](https://cabloy.com/admin)

## GIF Demo

- Dual-layer tabs navigation

![](../../assets/img/start/cabloy-start-two-level-tabs.gif)

## Code Style

Zova delivers an intuitive, elegant, and powerful code style by combining the core design strengths of Vue3, React, and Angular:

- `Vue3`: intuitive reactive state
- `React`: flexible TSX rendering
- `Angular`: powerful IOC container

## Features

- `SSR`: Built-in out-of-the-box SSR solution, building `SSR/SPA/Website/Admin-Dashboard` in one codebase
- `Dual-layer Tabs Navigation`: Supports dual-layer tabs navigation, enabling efficient page switching while maintaining page state
- `CRUD Dynamic Rendering`: Dynamically render CRUD list pages, entry pages, and search forms, while demonstrating best practices for Tanstack Table, Tanstack Form, and Tanstack Query
- `Reactivity`: With the support of ioc container, defining reactive states no longer needs `ref/reactive`. Without `ref`, naturally there is no need to write a lot of `ref.value`
- `CSS-in-JS`: Built-in CSS-in-JS capability making style development more flexible and convenient, while providing out-of-the-box theme switching capabilities
- `Unified state management`: Encapsulating unified state data through model mechanism, including Cookie, Localstorage and server-side data managed by TanStack Query
- `IOC + AOP`: Offers powerful IOC + AOP capabilities, making the system more extensible and maintainable

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

Zova can be used with any UI library and comes with built-in project templates for several UI libraries, making it easy to use out of the box.

| Name        | Version  |
| ----------- | -------- |
| Daisyui     | >=5.3.2  |
| Tailwindcss | >=4.1.14 |
| Quasar      | >=2.18.1 |
| Vuetify     | >=4.0.1  |

## Philosophy

Many frameworks showcase design elegance with the simplest cases, while ignoring the coding challenges of real business complexity.

As business grows and changes, project code can quickly degrade and become hard to maintain.

Zova addresses large-scale business complexity with a set of engineering solutions, allowing elegant and intuitive code even in complex systems.

This improves development efficiency and experience, while making subsequent iteration and maintenance easier.

## Stay In Touch

- [Twitter](https://x.com/zhennann2024)
- [Bilibili](https://space.bilibili.com/454737998)

## Thanks

- Thanks to Angular that ioc container of Zova was in part inspired by Angular
- Thanks to React that React’s pioneering JSX syntax has significantly improved the efficiency and experience of front-end development
- Thanks to Vue that Vue provides a very powerful reactive system and ecosystem. Without the support of these ecosystems, Zova would be difficult to implement

## License

MIT License.

Copyright (c) 2016-present, Zova.
