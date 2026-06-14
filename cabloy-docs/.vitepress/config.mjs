import { defineConfig } from 'vitepress';

const editionsItems = [
  { text: 'Overview', link: '/editions/overview' },
  {
    text: 'Choosing Basic vs Start',
    link: '/editions/choosing-between-basic-and-start',
  },
  { text: 'Cabloy Basic', link: '/editions/cabloy-basic' },
  { text: 'Cabloy Start', link: '/editions/cabloy-start' },
  { text: 'Edition Detection', link: '/editions/detection' },
];

const aiItems = [
  { text: 'Introduction', link: '/ai/introduction' },
  { text: 'Repo Guidance', link: '/ai/repo-guidance' },
  { text: 'Skills', link: '/ai/skills' },
  { text: 'Class Placement Rule', link: '/ai/class-placement-rule' },
  { text: 'Global Bean Lookup', link: '/ai/global-bean-lookup' },
  { text: 'Docs / Skills Mapping', link: '/ai/docs-skills-rules-mapping' },
  { text: 'CLI to Skill Map', link: '/ai/cli-to-skill-map' },
  { text: 'Future Skill Roadmap', link: '/ai/future-skill-roadmap' },
  { text: 'Playbook: Backend Module', link: '/ai/playbook-backend-module' },
  { text: 'Playbook: Frontend Page', link: '/ai/playbook-frontend-page' },
  { text: 'Playbook: Contract Regeneration', link: '/ai/playbook-contract-regeneration' },
  { text: 'Playbook: Metadata Refresh', link: '/ai/playbook-metadata-refresh' },
  { text: 'CLI for Agents', link: '/ai/cli-for-agents' },
  { text: 'Rules and Config', link: '/ai/rules-and-config' },
  { text: 'Edition Detection', link: '/ai/edition-detection' },
  { text: 'Edition Consistency Checklist', link: '/ai/edition-consistency-checklist' },
  { text: 'Verification', link: '/ai/verification' },
];

const fullstackGroups = [
  {
    text: 'Fullstack / Getting Started',
    items: [
      { text: 'Introduction', link: '/fullstack/introduction' },
      { text: 'Quickstart', link: '/fullstack/quickstart' },
    ],
  },
  {
    text: 'Fullstack / Tutorials',
    items: [
      { text: 'Tutorials Overview', link: '/fullstack/tutorials-overview' },
      { text: 'Tutorial 1: First Module', link: '/fullstack/tutorial-1-first-module' },
      { text: 'Tutorial 2: First CRUD', link: '/fullstack/tutorial-2-first-crud' },
      {
        text: 'Tutorial 3: Frontend Metadata Sharing',
        link: '/fullstack/tutorial-3-frontend-metadata-sharing',
      },
      {
        text: 'Tutorial 4: Backend Contract Sharing',
        link: '/fullstack/tutorial-4-backend-contract-sharing',
      },
      {
        text: 'Tutorial 5: One Contract Surface, Four Uses',
        link: '/fullstack/tutorial-5-one-contract-four-uses',
      },
    ],
  },
  {
    text: 'Tooling & Workflow',
    items: [
      { text: 'CLI', link: '/fullstack/cli' },
      { text: 'VS Code Extensions', link: '/fullstack/vscode-extensions' },
    ],
  },
  {
    text: 'Architecture & Integration',
    items: [
      {
        text: 'Comparison with Other Frameworks',
        link: '/fullstack/comparison-with-other-frameworks',
      },
      { text: 'Framework Performance', link: '/fullstack/framework-performance' },
      { text: 'Vona + Zova Integration', link: '/fullstack/vona-zova-integration' },
      { text: 'Backend OpenAPI to Frontend SDK', link: '/fullstack/openapi-to-sdk' },
      {
        text: 'Frontend Metadata Back to Backend',
        link: '/fullstack/frontend-metadata-to-backend',
      },
      {
        text: 'Edition Collaboration Differences',
        link: '/fullstack/edition-collaboration-differences',
      },
    ],
  },
];

const referenceGroups = [
  {
    text: 'Reference / Workflow Entry',
    items: [
      { text: 'Introduction', link: '/reference/introduction' },
      { text: 'Repo Scripts', link: '/reference/repo-scripts' },
      { text: 'CLI Reference', link: '/reference/cli-reference' },
      { text: 'Bean Scene Boilerplate Variants', link: '/reference/bean-scene-boilerplates' },
    ],
  },
  {
    text: 'Structure & Lookup',
    items: [
      { text: 'Package Map', link: '/reference/package-map' },
      { text: 'Backend Directory Structure', link: '/reference/backend-directory-structure' },
      { text: 'Frontend Directory Structure', link: '/reference/frontend-directory-structure' },
      { text: 'Glossary', link: '/reference/glossary' },
    ],
  },
];

const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;
const gaHead = GA_MEASUREMENT_ID
  ? [
      [
        'script',
        {
          async: '',
          src: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
        },
      ],
      [
        'script',
        {},
        `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`,
      ],
    ]
  : [];

export default defineConfig({
  title: 'Cabloy',
  description: 'Unified fullstack and AI-development documentation for the Cabloy monorepo',
  lang: 'en-US',
  base: '/',
  ignoreDeadLinks: [/^https?:\/\/localhost/],
  head: gaHead,
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Fullstack', link: '/fullstack/introduction', activeMatch: '^/fullstack/' },
      { text: 'Backend (Vona)', link: '/backend/introduction', activeMatch: '^/backend/' },
      { text: 'Frontend (Zova)', link: '/frontend/introduction', activeMatch: '^/frontend/' },
      { text: 'Editions', link: '/editions/overview', activeMatch: '^/editions/' },
      { text: 'AI Development', link: '/ai/introduction', activeMatch: '^/ai/' },
      { text: 'Reference', link: '/reference/introduction', activeMatch: '^/reference/' },
    ],
    sidebar: {
      '/fullstack/': fullstackGroups,
      '/backend/': [
        {
          text: 'Backend (Vona) / Getting Started',
          items: [
            { text: 'Introduction', link: '/backend/introduction' },
            { text: 'Foundation', link: '/backend/foundation' },
            { text: 'Backend Essentials', link: '/backend/backend-essentials' },
            { text: 'Quickstart', link: '/backend/quickstart' },
          ],
        },
        {
          text: 'Tooling & Runtime',
          items: [
            { text: 'CLI', link: '/backend/cli' },
            { text: 'Scripts', link: '/backend/scripts' },
            { text: 'Runtime and Flavors', link: '/backend/runtime-and-flavors' },
            { text: 'Config Guide', link: '/backend/config-guide' },
            { text: 'Backend Startup Guide', link: '/backend/startup-guide' },
            {
              text: 'Multi-Instance and Instance Resolution',
              link: '/backend/multi-instance-and-instance-resolution',
            },
          ],
        },
        {
          text: 'Security & Access',
          items: [
            { text: 'Auth Guide', link: '/backend/auth-guide' },
            { text: 'Captcha Guide', link: '/backend/captcha-guide' },
            { text: 'User Access Guide', link: '/backend/user-access-guide' },
            { text: 'JWT Guide', link: '/backend/jwt-guide' },
            { text: 'Validation Guide', link: '/backend/validation-guide' },
          ],
        },
        {
          text: 'Application Basics',
          items: [
            { text: 'Menu Guide', link: '/backend/menu-guide' },
            { text: 'I18n Guide', link: '/backend/i18n-guide' },
            { text: 'Error Guide', link: '/backend/error-guide' },
            { text: 'Event Guide', link: '/backend/event-guide' },
            { text: 'Logger Guide', link: '/backend/logger-guide' },
            { text: 'Upload Guide', link: '/backend/upload-guide' },
            { text: 'Mail Guide', link: '/backend/mail-guide' },
            { text: 'Serialization Guide', link: '/backend/serialization-guide' },
          ],
        },
        {
          text: 'Core Programming Model',
          items: [
            { text: 'AOP Overview', link: '/backend/aop-overview' },
            { text: 'Bean Scene Authoring', link: '/backend/bean-scene-authoring' },
            { text: 'Controller Guide', link: '/backend/controller-guide' },
            { text: 'Controller AOP Guide', link: '/backend/controller-aop-guide' },
            { text: 'Internal AOP Guide', link: '/backend/internal-aop-guide' },
            { text: 'External AOP Guide', link: '/backend/external-aop-guide' },
            { text: 'Service Guide', link: '/backend/service-guide' },
            { text: 'Model Guide', link: '/backend/model-guide' },
            { text: 'Entity Guide', link: '/backend/entity-guide' },
            { text: 'DTO Guide', link: '/backend/dto-guide' },
          ],
        },
        {
          text: 'Data & CRUD',
          items: [
            { text: 'CRUD Workflow', link: '/backend/crud-workflow' },
            { text: 'Migration and Changes', link: '/backend/migration-and-changes' },
            { text: 'Field Indexes', link: '/backend/field-indexes' },
            { text: 'ORM Guide', link: '/backend/orm-guide' },
            { text: 'ORM Configuration Guide', link: '/backend/orm-configuration-guide' },
            { text: 'ORM Select Guide', link: '/backend/orm-select-guide' },
            { text: 'ORM Mutation Guide', link: '/backend/orm-mutation-guide' },
            { text: 'ORM Aggregate and Group Guide', link: '/backend/orm-aggregate-group-guide' },
            { text: 'Relations Guide', link: '/backend/relations-guide' },
            { text: 'Transaction Guide', link: '/backend/transaction-guide' },
          ],
        },
        {
          text: 'Infrastructure & Distributed',
          items: [
            { text: 'Cache Guide', link: '/backend/cache-guide' },
            {
              text: 'Multi-Database and Datasource Guide',
              link: '/backend/multi-database-datasource',
            },
            { text: 'Sharding Guide', link: '/backend/sharding-guide' },
            { text: 'Dynamic Datasource Guide', link: '/backend/dynamic-datasource-guide' },
            { text: 'Redis Guide', link: '/backend/redis-guide' },
            { text: 'Queue Guide', link: '/backend/queue-guide' },
            { text: 'Election Guide', link: '/backend/election-guide' },
            { text: 'Schedule Guide', link: '/backend/schedule-guide' },
            { text: 'Worker Guide', link: '/backend/worker-guide' },
            { text: 'Broadcast Guide', link: '/backend/broadcast-guide' },
            { text: 'Redlock Guide', link: '/backend/redlock-guide' },
          ],
        },
        {
          text: 'API & Testing',
          items: [
            { text: 'OpenAPI Guide', link: '/backend/openapi-guide' },
            { text: 'DTO Infer and Generation', link: '/backend/dto-infer-generation' },
            { text: 'Unit Testing', link: '/backend/unit-testing' },
          ],
        },
      ],
      '/frontend/': [
        {
          text: 'Frontend (Zova) / Getting Started',
          items: [
            { text: 'Introduction', link: '/frontend/introduction' },
            { text: 'Quickstart', link: '/frontend/quickstart' },
            { text: 'Foundation', link: '/frontend/foundation' },
          ],
        },
        {
          text: 'Architecture & Modules',
          items: [
            { text: 'IoC and Beans', link: '/frontend/ioc-and-beans' },
            { text: 'Bean Scene Authoring', link: '/frontend/bean-scene-authoring' },
            { text: 'Modules and Suites', link: '/frontend/modules-and-suites' },
            { text: 'Module Scope', link: '/frontend/module-scope' },
            { text: 'Design Principles', link: '/frontend/design-principles' },
          ],
        },
        {
          text: 'Environment & Startup',
          items: [
            { text: 'Environment and Config Guide', link: '/frontend/environment-config-guide' },
            { text: 'App Startup Guide', link: '/frontend/app-startup-guide' },
            { text: 'System Startup Guide', link: '/frontend/system-startup-guide' },
          ],
        },
        {
          text: 'Tooling',
          items: [
            { text: 'CLI', link: '/frontend/cli' },
            { text: 'Scripts', link: '/frontend/scripts' },
            { text: 'Mock Guide', link: '/frontend/mock-guide' },
          ],
        },
        {
          text: 'Pages & Routing',
          items: [
            { text: 'Page Guide', link: '/frontend/page-guide' },
            { text: 'Page Query Guide', link: '/frontend/page-query-guide' },
            { text: 'Page Params Guide', link: '/frontend/page-params-guide' },
            { text: 'Zod Guide', link: '/frontend/zod-guide' },
            { text: 'Page Route Guide', link: '/frontend/page-route-guide' },
            { text: 'Router Tabs Introduction', link: '/frontend/router-tabs-introduction' },
            { text: 'Router Tabs Overview', link: '/frontend/router-tabs-overview' },
            { text: 'Router Tabs Mechanism', link: '/frontend/router-tabs-mechanism' },
            {
              text: 'Router Tabs Route Meta Cookbook',
              link: '/frontend/router-tabs-route-meta-cookbook',
            },
            {
              text: 'Router Tabs Admin and Web Comparison',
              link: '/frontend/router-tabs-admin-web-comparison',
            },
            { text: 'Route Alias Guide', link: '/frontend/route-alias-guide' },
            { text: 'Navigation Guards Guide', link: '/frontend/navigation-guards-guide' },
          ],
        },
        {
          text: 'Components & UI',
          items: [
            { text: 'Component Guide', link: '/frontend/component-guide' },
            { text: 'Component Props Guide', link: '/frontend/component-props-guide' },
            { text: 'Component v-model Guide', link: '/frontend/component-v-model-guide' },
            { text: 'Generic Component Guide', link: '/frontend/generic-component-guide' },
            { text: 'CSS-in-JS Guide', link: '/frontend/css-in-js-guide' },
            { text: 'Theme Guide', link: '/frontend/theme-guide' },
            { text: 'Icon Engine Guide', link: '/frontend/icon-engine-guide' },
          ],
        },
        {
          text: 'Data & State',
          items: [
            { text: 'Server Data', link: '/frontend/server-data' },
            { text: 'API Guide', link: '/frontend/api-guide' },
            { text: 'Model Architecture', link: '/frontend/model-architecture' },
            { text: 'Model State Guide', link: '/frontend/model-state-guide' },
          ],
        },
        {
          text: 'API Contract & SDK',
          items: [
            { text: 'OpenAPI SDK Guide', link: '/frontend/openapi-sdk-guide' },
            { text: 'API Schema Guide', link: '/frontend/api-schema-guide' },
            { text: 'SDK Guide', link: '/frontend/sdk-guide' },
          ],
        },
        {
          text: 'SSR',
          items: [
            { text: 'SSR Overview', link: '/frontend/ssr-overview' },
            { text: 'SSR Init Data', link: '/frontend/ssr-init-data' },
            { text: 'SSR ClientOnly', link: '/frontend/ssr-client-only' },
            { text: 'SSR SEO Meta', link: '/frontend/ssr-seo-meta' },
            { text: 'SSR Env', link: '/frontend/ssr-env' },
          ],
        },
      ],
      '/editions/': [
        {
          text: 'Editions',
          items: editionsItems,
        },
      ],
      '/ai/': [
        {
          text: 'AI Development',
          items: aiItems,
        },
      ],
      '/reference/': referenceGroups,
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/cabloy/cabloy' }],
    search: {
      provider: 'local',
    },
    editLink: {
      pattern: 'https://github.com/cabloy/cabloy/edit/main/cabloy-docs/:path',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2016-present Cabloy',
    },
  },
});
