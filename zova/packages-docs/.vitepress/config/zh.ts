import type { DefaultTheme } from 'vitepress';

import { defineConfig } from 'vitepress';

export const zh = defineConfig({
  lang: 'zh-CN',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/zh/guide/start/introduction', activeMatch: '/zh/guide/' },
      { text: 'CabloyJS', link: '/zh/cabloy/introduction', activeMatch: '/zh/cabloy/' },
      { text: 'Basic', link: '/zh/cabloy-basic/introduction', activeMatch: '/zh/cabloy-basic/' },
      { text: 'Start', link: '/zh/cabloy-start/introduction', activeMatch: '/zh/cabloy-start/' },
      { text: 'Store', link: 'https://cabloy.com', target: '_self' },
    ],
    sidebar: {
      '/zh/guide/': { base: '/zh/guide/', items: sidebarGuide() },
      '/zh/cabloy/': { base: '/zh/cabloy/', items: sidebarCabloy() },
      '/zh/cabloy-basic/': { base: '/zh/cabloy-basic/', items: sidebarCabloyBasic() },
      '/zh/cabloy-start/': { base: '/zh/cabloy-start/', items: sidebarCabloyStart() },
    },
    footer: {
      message: '基于 MIT 许可发布',
      copyright: '版权所有 © 2016-present Zova',
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
  return [{ text: '介绍', link: 'introduction' }];
}

function sidebarCabloyBasic(): DefaultTheme.SidebarItem[] {
  return [
    { text: '介绍', link: 'introduction' },
    { text: '快速上手', link: 'quick-start' },
  ];
}

function sidebarCabloyStart(): DefaultTheme.SidebarItem[] {
  return [
    { text: '介绍', link: 'introduction' },
    { text: '快速上手', link: 'quick-start' },
  ];
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '开始',
      items: [
        { text: '简介', link: 'start/introduction' },
        { text: '如何做到直观、优雅、强大?🔥', link: 'start/how' },
        { text: '1. 快速上手', link: 'start/quick-start' },
        { text: '2. 创建第一个页面', link: 'start/first-page' },
        { text: 'Cli命令', link: 'start/cli' },
        { text: '菜单命令', link: 'start/menu' },
        { text: 'Scripts', link: 'start/scripts' },
        { text: '框架升级', link: 'start/update' },
      ],
    },
    {
      collapsed: true,
      text: '环境与配置',
      items: [
        {
          text: '多维变量',
          base: '/zh/guide/env-config/mode-flavor/',
          link: 'introduction',
        },
        {
          text: 'Env环境变量',
          base: '/zh/guide/env-config/env/',
          link: 'introduction',
        },
        {
          text: 'Config配置',
          base: '/zh/guide/env-config/config/',
          link: 'introduction',
        },
        {
          text: '应用启动自定义',
          base: '/zh/guide/env-config/app-start/',
          link: 'introduction',
        },
        {
          text: '系统启动自定义',
          base: '/zh/guide/env-config/sys-start/',
          link: 'introduction',
        },
      ],
    },
    {
      collapsed: true,
      text: '基础',
      items: [
        {
          text: '模块化体系',
          base: '/zh/guide/essentials/modularization/',
          collapsed: true,
          items: [
            { text: '模块', link: 'module' },
            { text: '套件', link: 'suite' },
            { text: '目录结构', link: 'directory-structure' },
            { text: 'package.json', link: 'package' },
          ],
        },
        {
          text: 'IOC控制反转',
          base: '/zh/guide/essentials/ioc/',
          collapsed: true,
          items: [
            { text: '简介', link: 'introduction' },
            { text: 'Bean标识', link: 'bean-identifier' },
            { text: 'Bean Scene', link: 'bean-scene' },
            { text: 'Onion名称', link: 'onion-name' },
            { text: '创建Bean', link: 'bean-create' },
            { text: '依赖注入', link: 'dependency-injection' },
            { text: '依赖注入(API)', link: 'dependency-injection-api' },
            { text: 'BeanBase基类', link: 'bean-base' },
            { text: '生命周期', link: 'lifecycle' },
          ],
        },
        {
          text: '模块Scope',
          base: '/zh/guide/essentials/scope/',
          collapsed: true,
          items: [
            { text: '简介', link: 'introduction' },
            { text: 'Config配置', link: 'config' },
            { text: 'Constant常量', link: 'constant' },
            { text: 'I18n国际化', link: 'locale' },
            { text: 'Error错误异常', link: 'error' },
            { text: 'Api', link: 'api' },
          ],
        },
      ],
    },
    {
      collapsed: true,
      text: '页面',
      base: '/zh/guide/page/',
      items: [
        { text: '简介', link: 'introduction' },
        { text: '渐进式代码拆分', link: 'progressive-code-splitting' },
        { text: '页面Query', link: 'page-query' },
        { text: '页面Params', link: 'page-params' },
        { text: '页面路由', link: 'page-route' },
        { text: '路由别名', link: 'route-alias' },
        { text: '页面布局', link: 'page-layout' },
        { text: '导航守卫', link: 'navigation-guards' },
        { text: 'zod', link: 'zod' },
      ],
    },
    {
      collapsed: true,
      text: '组件',
      base: '/zh/guide/component/',
      items: [
        { text: '简介', link: 'introduction' },
        { text: '渐进式代码拆分', link: 'progressive-code-splitting' },
        { text: '组件Props', link: 'component-props' },
        { text: 'v-model', link: 'v-model' },
        { text: '泛型组件', link: 'component-generic' },
      ],
    },
    {
      collapsed: true,
      text: '技术',
      items: [
        {
          text: '服务端数据',
          base: '/zh/guide/techniques/server-data/',
          items: [
            { text: '简介', link: 'introduction' },
            { text: '$fetch', link: 'fetch' },
            { text: '$api', link: 'api' },
            { text: 'Model: 状态管理', link: 'model' },
            { text: 'Openapi SDK', link: 'openapi-sdk' },
            { text: '$apiSchema', link: 'apiSchema' },
            { text: '$sdk', link: 'sdk' },
          ],
        },
        {
          text: 'Mock',
          base: '/zh/guide/techniques/mock/',
          link: 'introduction',
        },
        {
          text: '图标',
          base: '/zh/guide/techniques/icon/',
          link: 'icon-engine',
        },
        {
          text: 'CSS-in-JS: 样式&主题',
          base: '/zh/guide/techniques/css-in-js/',
          items: [
            { text: '简介', link: 'introduction' },
            { text: '$style', link: 'style' },
            { text: '$cssBase', link: 'css' },
            { text: '$token', link: 'token' },
            { text: '$theme', link: 'theme' },
          ],
        },
        {
          text: 'Model: 状态管理',
          base: '/zh/guide/techniques/model/',
          items: [
            { text: '简介', link: 'introduction' },
            { text: '异步数据', link: 'async-data' },
            { text: '同步数据', link: 'sync-data' },
            { text: 'API', link: 'api' },
          ],
        },
        {
          text: 'SSR',
          base: '/zh/guide/techniques/ssr/',
          items: [
            { text: '简介', link: 'introduction' },
            { text: '初始化数据', link: 'init-data' },
            { text: 'ClientOnly', link: 'client-only' },
            { text: 'SEO Meta', link: 'seo-meta' },
            { text: 'env', link: 'env' },
          ],
        },
      ],
    },
    {
      collapsed: true,
      text: 'Vue生态支持',
      items: [
        { text: 'Composables', link: 'vue/composables' },
        { text: 'Provide/Inject', link: 'vue/provide-inject' },
        { text: 'Refs', link: 'vue/refs' },
        { text: 'Others', link: 'vue/others' },
      ],
    },
    {
      text: '资源',
      items: [
        { text: '常见问题', link: 'resources/faq' },
        { text: '视频', link: 'resources/videos' },
        { text: '文章', link: 'resources/articles' },
      ],
    },
    { text: '致谢', link: 'others/thanks' },
    { text: 'License', link: 'others/license' },
  ];
}
