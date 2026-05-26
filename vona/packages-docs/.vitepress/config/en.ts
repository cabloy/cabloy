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
      copyright: 'Copyright © 2016-present Vona',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vonajs/vona' },
      { icon: 'x', link: 'https://twitter.com/zhennann2024' },
      { icon: 'youtube', link: 'https://www.youtube.com/@cabloyjs' },
      { icon: 'discord', link: 'https://discord.gg/CC89A22a' },
    ],
  },
});

function sidebarCabloy(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Introduction', link: 'introduction' },
    { text: 'a-datasharding: Sharding', link: 'sharding' },
    { text: 'a-datasource: Dynamic Datasource', link: 'dynamic-datasource' },
  ];
}

function sidebarCabloyBasic(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Introduction', link: 'introduction' },
    { text: 'Quick Start', link: 'quick-start' },
    { text: 'vona-suite-cabloy-basic', link: 'vona-suite-cabloy-basic' },
    { text: 'zova-suite-cabloy-basic', link: 'zova-suite-cabloy-basic' },
  ];
}

function sidebarCabloyStart(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Introduction', link: 'introduction' },
    { text: 'Quick Start', link: 'quick-start' },
    { text: 'vona-suite-cabloy-start', link: 'vona-suite-cabloy-start' },
    { text: 'zova-suite-cabloy-start', link: 'zova-suite-cabloy-start' },
  ];
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Getting Started',
      items: [
        { text: 'Introduction', link: 'start/introduction' },
        { text: 'Comparison with Next/Nest/Django', link: 'start/comparison' },
        { text: '1. Quick Start', link: 'start/quick-start' },
        { text: '2. Create the first CRUD', link: 'start/first-crud' },
        { text: '3. Integrate with Zova', link: 'start/with-zova' },
        { text: 'Cli Commands', link: 'start/cli' },
        { text: 'Menu Commands', link: 'start/menu' },
        { text: 'Scripts', link: 'start/scripts' },
        { text: 'Playground', link: 'start/play' },
        { text: 'Update', link: 'start/update' },
      ],
    },
    {
      collapsed: true,
      text: 'Environment & Configuration',
      items: [
        {
          text: 'Runtime Environments & Flavors',
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
          text: 'Multi-instance/Multi-tenancy',
          base: '/guide/env-config/instance/',
          link: 'introduction',
        },
        {
          text: 'Database Strategy',
          base: '/guide/env-config/db-strategy/',
          link: 'introduction',
        },
        {
          text: 'App Startup Customization',
          base: '/guide/env-config/app-start/',
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
            { text: 'Dependency Lookup', link: 'dependency-lookup' },
            { text: 'Dependency Lookup (API)', link: 'inject-api' },
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
            { text: 'Service', link: 'service' },
            { text: 'Model', link: 'model' },
            { text: 'Entity', link: 'entity' },
          ],
        },
      ],
    },
    {
      collapsed: true,
      text: 'Rest API',
      base: '/guide/rest-api/',
      items: [
        { text: 'Create CRUD', link: 'crud' },
        { text: 'Controller', link: 'controller' },
        { text: 'Service', link: 'service' },
        { text: 'Model', link: 'model' },
        { text: 'Entity', link: 'entity' },
        { text: 'Dto', link: 'dto' },
        { text: 'Migration & Changes', link: 'version' },
        { text: 'Field Indexes', link: 'field-index' },
        { text: 'Unit test', link: 'unit-test' },
      ],
    },
    {
      collapsed: true,
      text: 'AOP Programming',
      items: [
        {
          text: 'Introduction',
          base: '/guide/aop/',
          link: 'introduction',
        },
        {
          text: 'Controller Aspect',
          base: '/guide/aop/controller/',
          collapsed: true,
          items: [
            {
              text: 'Middleware',
              items: [
                { text: 'Local Middleware', link: 'middleware-local' },
                { text: 'Global Middleware', link: 'middleware-global' },
                { text: 'System Middleware', link: 'middleware-system' },
                { text: 'Built-in Middleware', link: 'middleware-builtin' },
              ],
            },
            {
              text: 'Guard',
              items: [
                { text: 'Local Guard', link: 'guard-local' },
                { text: 'Global Global', link: 'guard-global' },
                { text: 'Built-in Guard', link: 'guard-builtin' },
              ],
            },
            {
              text: 'Interceptor',
              items: [
                { text: 'Local Interceptor', link: 'interceptor-local' },
                { text: 'Global Interceptor', link: 'interceptor-global' },
                { text: 'Built-in Interceptor', link: 'interceptor-builtin' },
              ],
            },
            {
              text: 'Pipe',
              items: [
                { text: 'Local Pipe', link: 'pipe-local' },
                { text: 'Global Pipe', link: 'pipe-global' },
                { text: 'Argument Pipe', link: 'pipe-argument' },
                { text: 'Zod Integration', link: 'pipe-zod' },
              ],
            },
            {
              text: 'Filter',
              items: [
                { text: 'Built-in Filter', link: 'filter-builtin' },
                { text: 'Local Filter', link: 'filter-local' },
                { text: 'Global Filter', link: 'filter-global' },
              ],
            },
          ],
        },
        {
          text: 'Internal Aspect',
          base: '/guide/aop/internal/',
          collapsed: false,
          items: [
            { text: 'AOP Method', link: 'aop-method' },
            { text: 'Magic Method', link: 'magic-method' },
            { text: 'Built-in Aspect', link: 'builtin' },
          ],
        },
        {
          text: 'External Aspect',
          base: '/guide/aop/external/',
          link: 'introduction',
        },
      ],
    },
    {
      collapsed: true,
      text: 'Business Abstraction Layer',
      items: [
        {
          text: 'User System',
          base: '/guide/bal/user/',
          collapsed: false,
          items: [
            { text: 'User', link: 'user' },
            { text: 'Role', link: 'role' },
            { text: 'Passport', link: 'passport' },
          ],
        },
        {
          text: 'Authentication System',
          base: '/guide/bal/auth/',
          collapsed: false,
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: 'auth-simple', link: 'auth-simple' },
            { text: 'auth-oauth', link: 'auth-oauth' },
          ],
        },
        {
          text: 'Captcha System',
          base: '/guide/bal/captcha/',
          collapsed: false,
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: 'Captcha Provider', link: 'captcha-provider' },
            { text: 'Captcha Scene', link: 'captcha-scene' },
          ],
        },
        {
          text: 'Menu System',
          base: '/guide/bal/menu/',
          collapsed: false,
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: 'SSR Menu', link: 'ssr-menu' },
          ],
        },
      ],
    },
    {
      collapsed: true,
      text: 'Distributed Components',
      base: '/guide/distributed/',
      items: [
        { text: 'Introduction', link: 'introduction' },
        { text: 'Redis', link: 'redis' },
        {
          text: 'Queue',
          base: '/guide/distributed/queue/',
          collapsed: false,
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: 'Datasource Level', link: 'db-level' },
            { text: 'Extra Data', link: 'extra-data' },
          ],
        },
        {
          text: 'Startup',
          base: '/guide/distributed/startup/',
          collapsed: false,
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: 'Built-in Startup', link: 'builtin' },
          ],
        },
        { text: 'Broadcast', link: 'broadcast' },
        { text: 'Schedule', link: 'schedule' },
        { text: 'Redlock', link: 'redlock' },
        { text: 'Election', link: 'election' },
        { text: 'Worker', link: 'worker' },
      ],
    },
    {
      text: 'Vona Cache',
      base: '/guide/techniques/cache/',
      collapsed: true,
      items: [
        { text: 'Introduction', link: 'introduction' },
        { text: 'Mem Cache', link: 'mem' },
        { text: 'Redis Cache', link: 'redis' },
        { text: 'Summer Cache (Two-Layer Cache)', link: 'summer' },
        { text: 'Caching Decorator', link: 'caching' },
      ],
    },
    {
      text: 'Vona ORM',
      base: '/guide/techniques/orm/',
      collapsed: true,
      items: [
        { text: 'Introduction', link: 'introduction' },
        { text: 'Datasource Config', link: 'config-datasource' },
        { text: 'ORM Config', link: 'config-orm' },
        { text: 'ORM Basics', link: 'basics' },
        { text: 'CRUD (Select)', link: 'crud-select' },
        { text: 'CRUD (Insert/Update/Delete)', link: 'crud-cud' },
        { text: 'CRUD (Magic Methods)', link: 'crud-magic' },
        { text: 'Transaction', link: 'transaction' },
        { text: 'Relations (Static)', link: 'relations-static' },
        { text: 'Relations (Dynamic)', link: 'relations-dynamic' },
        { text: 'Aggregate & Group', link: 'aggr-group' },
        { text: 'Aggregate on Relations', link: 'relations-aggr' },
        { text: 'Group on Relations', link: 'relations-group' },
        { text: 'Caching', link: 'caching' },
        {
          text: 'DTO infer & generation',
          base: '/guide/techniques/orm/dto/',
          collapsed: false,
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: '$Dto.get', link: 'get' },
            { text: '$Dto.listAndCount', link: 'listAndCount' },
            {
              text: '$Dto.query/DtoQueryBase',
              collapsed: false,
              items: [
                { text: 'Introduction', link: 'query/introduction' },
                { text: 'Filter Transform', link: 'query/filter-transform' },
              ],
            },
            { text: '$Dto.queryPage/DtoQueryPageBase', link: 'query-page' },
            { text: '$Dto.create', link: 'create' },
            { text: '$Dto.update', link: 'update' },
            { text: '$Dto.aggregate', link: 'aggregate' },
            { text: '$Dto.group', link: 'group' },
          ],
        },
        {
          text: 'Advanced Features',
          base: '/guide/techniques/orm/advanced/',
          collapsed: false,
          items: [
            { text: 'Multi-database/Multi-datasource', link: 'multi-database' },
            { text: 'Table-partitioning', link: 'table-partitioning' },
            { text: 'Dynamic Datasource', link: 'dynamic-datasource' },
            { text: 'Sharding', link: 'sharding' },
            { text: 'Datasource Level', link: 'db-level' },
            { text: 'Multi-instance/Multi-tenancy', link: 'multi-instance' },
            { text: 'Database Strategy', link: 'db-strategy' },
          ],
        },
      ],
    },
    {
      collapsed: true,
      text: 'Techniques',
      items: [
        {
          text: 'Validation',
          base: '/guide/techniques/validation/',
          collapsed: false,
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: 'Zod Refine', link: 'zod-refine' },
            { text: 'Zod Transform', link: 'zod-transform' },
          ],
        },
        {
          text: 'Swagger/Openapi',
          base: '/guide/techniques/openapi/',
          link: 'introduction',
        },
        {
          text: 'Serialization',
          base: '/guide/techniques/serialization/',
          collapsed: false,
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: 'Tools', link: 'tools' },
          ],
        },
        {
          text: 'Event',
          base: '/guide/techniques/event/',
          collapsed: false,
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: 'Event Listener', link: 'event-listener' },
          ],
        },
        {
          text: 'I18n',
          base: '/guide/techniques/i18n/',
          collapsed: false,
          items: [
            { text: 'Locale', link: 'locale' },
            { text: 'Timezone', link: 'timezone' },
          ],
        },
        {
          text: 'JWT',
          base: '/guide/techniques/jwt/',
          link: 'introduction',
        },
        {
          text: 'Logger',
          base: '/guide/techniques/logger/',
          collapsed: false,
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: 'Logger Level', link: 'logger-level' },
          ],
        },
        {
          text: 'Mail',
          base: '/guide/techniques/mail/',
          link: 'introduction',
        },
        {
          text: 'PrintTip',
          base: '/guide/techniques/printTip/',
          link: 'introduction',
        },
        {
          text: 'Runtime',
          base: '/guide/techniques/runtime/',
          link: 'introduction',
        },
        {
          text: 'Static & Assets',
          base: '/guide/techniques/assets/',
          collapsed: false,
          items: [
            { text: 'Static', link: 'static' },
            { text: 'Assets', link: 'assets' },
          ],
        },
        {
          text: 'Upload',
          base: '/guide/techniques/upload/',
          link: 'introduction',
        },
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
