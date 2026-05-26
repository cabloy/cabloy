# Introduction

Zova provides built-in out-of-the-box SSR solution, supporting both front-end applications and admin management systems.

Zova SSR is based on `@quasar/app-vite` and optimizes a lot of details to make the SSR development experience more natural and convenient. For an introduction to the principles of SSR, please see: [Quasar-SSR](https://quasar.dev/quasar-cli-vite/developing-ssr/introduction)

## Features

1. `More UI libraries`: Can be used in combination with different UI libraries, and has built-in SSR solutions for several UI libraries out of the box
2. `Fine-grained theme support`: For front-end applications, it provides the ability of toggling dark/light themes. For admin management systems, it provides two-dimensional theme toggling capabilities based on Cookie, See: [$theme](../css-in-js/theme.md)
3. `Sidebar support`: For admin management systems, the ability to toggle the sidebar can be implemented based on Localstorage
4. `Initialize data`: Prepare the initial data on the server in a very intuitive way, synchronize it to the client, and automatically complete hydration
5. `SEO Meta`: For SEO optimization, it can provide a more flexible Meta data setting mechanism
6. `Env Configuration`: Provide env environment variables, which is very convenient to configure the behaviors of certain functions and features
