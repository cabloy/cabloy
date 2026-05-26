import type { DefaultTheme } from 'vitepress';

import { defineConfig } from 'vitepress';

export const en = defineConfig({
  lang: 'en-US',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/guide/start/introduction', activeMatch: '/guide/' },
      { text: 'CabloyJS', link: '/cabloy/introduction', activeMatch: '/cabloy/' },
      { text: 'Basic', link: '/cabloy-basic/introduction', activeMatch: '/cabloy-basic/' },
      { text: 'Start', link: '/cabloy-start/introduction', activeMatch: '/cabloy-start/' },
      { text: 'Store', link: 'https://cabloy.com', target: '_self' },
    ],
    sidebar: {
      '/guide/': { base: '/guide/', items: sidebarGuide() },
      '/cabloy/': { base: '/cabloy/', items: sidebarCabloy() },
      '/cabloy-basic/': { base: '/cabloy-basic/', items: sidebarCabloyBasic() },
      '/cabloy-start/': { base: '/cabloy-start/', items: sidebarCabloyStart() },
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2016-present Zova',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zovajs/zova' },
      { icon: 'x', link: 'https://twitter.com/zhennann2024' },
      { icon: 'youtube', link: 'https://www.youtube.com/@cabloyjs' },
      { icon: 'discord', link: 'https://discord.gg/CC89A22a' },
    ],
  },
});

function sidebarCabloy(): DefaultTheme.SidebarItem[] {
  return [{ text: 'Introduction', link: 'introduction' }];
}

function sidebarCabloyBasic(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Introduction', link: 'introduction' },
    { text: 'Quick Start', link: 'quick-start' },
  ];
}

function sidebarCabloyStart(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Introduction', link: 'introduction' },
    { text: 'Quick Start', link: 'quick-start' },
  ];
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Getting Started',
      items: [
        { text: 'Introduction', link: 'start/introduction' },
        { text: 'How Intuitive, Elegant, and Powerful?🔥', link: 'start/how' },
        { text: '1. Quick Start', link: 'start/quick-start' },
        { text: '2. Create the first Page', link: 'start/first-page' },
        { text: 'Cli Commands', link: 'start/cli' },
        { text: 'Menu Commands', link: 'start/menu' },
        { text: 'Scripts', link: 'start/scripts' },
        { text: 'Update', link: 'start/update' },
      ],
    },
    {
      collapsed: true,
      text: 'Environment & Configuration',
      items: [
        {
          text: 'Multi-dimensional Variables',
          base: '/guide/env-config/mode-flavor/',
          link: 'introduction',
        },
        {
          text: 'Env',
          base: '/guide/env-config/env/',
          link: 'introduction',
        },
        {
          text: 'Config',
          base: '/guide/env-config/config/',
          link: 'introduction',
        },
        {
          text: 'App Startup Customization',
          base: '/guide/env-config/app-start/',
          link: 'introduction',
        },
        {
          text: 'Sys Startup Customization',
          base: '/guide/env-config/sys-start/',
          link: 'introduction',
        },
      ],
    },
    {
      collapsed: true,
      text: 'Essentials',
      items: [
        {
          text: 'Modularization',
          base: '/guide/essentials/modularization/',
          collapsed: true,
          items: [
            { text: 'Module', link: 'module' },
            { text: 'Suite', link: 'suite' },
            { text: 'Directory Structure', link: 'directory-structure' },
            { text: 'package.json', link: 'package' },
          ],
        },
        {
          text: 'IOC',
          base: '/guide/essentials/ioc/',
          collapsed: true,
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: 'Bean Identifier', link: 'bean-identifier' },
            { text: 'Bean Scene', link: 'bean-scene' },
            { text: 'Onion Name', link: 'onion-name' },
            { text: 'Create Bean', link: 'bean-create' },
            { text: 'Dependency Injection', link: 'dependency-injection' },
            { text: 'Dependency Injection (API)', link: 'dependency-injection-api' },
            { text: 'BeanBase', link: 'bean-base' },
            { text: 'Lifecycle', link: 'lifecycle' },
          ],
        },
        {
          text: 'Module Scope',
          base: '/guide/essentials/scope/',
          collapsed: true,
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: 'Config', link: 'config' },
            { text: 'Constant', link: 'constant' },
            { text: 'I18n', link: 'locale' },
            { text: 'Error Exception', link: 'error' },
            { text: 'Api', link: 'api' },
          ],
        },
      ],
    },
    {
      collapsed: true,
      text: 'Page',
      base: '/guide/page/',
      items: [
        { text: 'Introduction', link: 'introduction' },
        { text: 'Progressive Code Splitting', link: 'progressive-code-splitting' },
        { text: 'Page Query', link: 'page-query' },
        { text: 'Page Params', link: 'page-params' },
        { text: 'Page Route', link: 'page-route' },
        { text: 'Route Alias', link: 'route-alias' },
        { text: 'Page Layout', link: 'page-layout' },
        { text: 'Navigation Guards', link: 'navigation-guards' },
        { text: 'zod', link: 'zod' },
      ],
    },
    {
      collapsed: true,
      text: 'Component',
      base: '/guide/component/',
      items: [
        { text: 'Introduction', link: 'introduction' },
        { text: 'Progressive Code Splitting', link: 'progressive-code-splitting' },
        { text: 'Component Props', link: 'component-props' },
        { text: 'v-model', link: 'v-model' },
        { text: 'Generic Component', link: 'component-generic' },
      ],
    },
    {
      collapsed: true,
      text: 'Techniques',
      items: [
        {
          text: 'Server Data',
          base: '/guide/techniques/server-data/',
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: '$fetch', link: 'fetch' },
            { text: '$api', link: 'api' },
            { text: 'Model: State Management', link: 'model' },
            { text: 'Openapi SDK', link: 'openapi-sdk' },
            { text: '$apiSchema', link: 'apiSchema' },
            { text: '$sdk', link: 'sdk' },
          ],
        },
        {
          text: 'Mock',
          base: '/guide/techniques/mock/',
          link: 'introduction',
        },
        {
          text: 'Icon',
          base: '/guide/techniques/icon/',
          link: 'icon-engine',
        },
        {
          text: 'CSS-in-JS: Style & Theme',
          base: '/guide/techniques/css-in-js/',
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: '$style', link: 'style' },
            { text: '$cssBase', link: 'css' },
            { text: '$token', link: 'token' },
            { text: '$theme', link: 'theme' },
          ],
        },
        {
          text: 'Model: State Management',
          base: '/guide/techniques/model/',
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: 'Async Data', link: 'async-data' },
            { text: 'Sync Data', link: 'sync-data' },
            { text: 'API', link: 'api' },
          ],
        },
        {
          text: 'SSR',
          base: '/guide/techniques/ssr/',
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: 'Init Data', link: 'init-data' },
            { text: 'ClientOnly', link: 'client-only' },
            { text: 'SEO Meta', link: 'seo-meta' },
            { text: 'env', link: 'env' },
          ],
        },
      ],
    },
    {
      collapsed: true,
      text: 'Vue Ecosystem Support',
      items: [
        { text: 'Composables', link: 'vue/composables' },
        { text: 'Provide/Inject', link: 'vue/provide-inject' },
        { text: 'Refs', link: 'vue/refs' },
        { text: 'Others', link: 'vue/others' },
      ],
    },
    {
      text: 'Resources',
      items: [
        { text: 'FAQ', link: 'resources/faq' },
        { text: 'Videos', link: 'resources/videos' },
        { text: 'Articles', link: 'resources/articles' },
      ],
    },
    { text: 'Thanks', link: 'others/thanks' },
    { text: 'License', link: 'others/license' },
  ];
}
