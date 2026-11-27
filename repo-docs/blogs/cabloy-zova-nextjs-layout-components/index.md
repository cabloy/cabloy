---
title: 'Cabloy/Zova and Next.js Layouts: From Directory Nesting to Route Shells'
titleZh: 'Cabloy/Zova 与 Next.js 的布局组件差异：从目录嵌套到路由应用壳'
titleEn: 'Cabloy/Zova and Next.js Layouts: From Directory Nesting to Route Shells'
subtitle: How route metadata and filesystem conventions shape shared UI, navigation state, and SSR.
summary: A comparison of layout components in Cabloy/Zova and the two Next.js routers, using Cabloy Basic source examples to explain layout selection, page hosting, state retention, and server rendering.
tags:
  - Cabloy
  - Zova
  - Next.js
  - Vue
  - React
  - Layouts
  - SSR
  - Frontend Architecture
slug: cabloy-zova-nextjs-layout-components-en
cover: ./cover-en-v1.png
date: 2026-11-27
---

# Cabloy/Zova and Next.js Layouts: From Directory Nesting to Route Shells

An Admin dashboard and a sign-in page can live in the same application with very different surroundings. The dashboard might need a sidebar and tabs for open tasks. The sign-in page might need only the form and a language switcher. Where do you decide which shell wraps each page?

In Zova, the route record declares a layout and application configuration can supply the implementation. In the Next.js App Router, a page inherits layouts from its route segment and its ancestors. In the Pages Router, your React code wraps the active page in `pages/_app`. These choices also determine how each framework hosts routed content and what happens to layout and page state during navigation. [Cabloy Page Route Guide](https://cabloy.com/frontend/page-route-guide) · [Next.js App Router layouts](https://nextjs.org/docs/app/getting-started/layouts-and-pages) · [Next.js Pages Router layouts](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts)

## How Zova selects a layout

Zova modules declare pages in `routes.ts`. In Cabloy Basic, the `home-login` module registers its sign-in page with the `empty` layout. The same route record declares anonymous access and the `public` SSR profile as separate settings. [Sign-in route source](https://github.com/cabloy/cabloy/blob/main/zova/src/suite/a-home/modules/home-login/src/routes.ts)

```ts
export const routes: IModuleRoute[] = [
  {
    path: '',
    component: ZPageLogin,
    meta: {
      layout: 'empty',
      requiresAuth: false,
      ssrProfile: 'public',
    },
  },
];
```

Cabloy Basic maps logical names such as `default`, `empty`, and `mine` to layout component identifiers through `config.layout.component`. A route that omits `meta.layout` uses the configured default. The mapping lets the Admin and Web flavors supply their own default shells while routes continue to express their layout choice with the same name. [Cabloy Page Route Guide](https://cabloy.com/frontend/page-route-guide) · [Application configuration source](https://github.com/cabloy/cabloy/blob/main/zova/src/front/config/config/config.ts)

```ts
config.layout = {
  app: {
    component: 'a-app:app',
  },
  component: {
    empty: env.LAYOUT_COMPONENT_EMPTY,
    default: env.LAYOUT_COMPONENT_DEFAULT,
    mine: env.LAYOUT_COMPONENT_MINE,
  },
};
```

When Zova registers a route with a layout, it creates a parent route at the page's URL and places the page at the parent's empty child path. The root `RouterView` renders the layout, and the layout's own routed view renders the page. With `meta.layout: false`, Zova registers the page directly under the app host. The `empty` choice resolves to a component and can still provide shared UI, such as Cabloy Basic's language switcher. [Zova App Guide](https://cabloy.com/frontend/zova-app-guide) · [Route registration source](https://github.com/cabloy/cabloy/blob/main/zova/src/suite-vendor/a-zova/modules/a-router/src/bean/sys.router.ts) · [Empty layout source](https://github.com/cabloy/cabloy/blob/main/zova/src/suite/a-home/modules/home-layoutempty/src/component/layoutEmpty/controller.tsx)

## How the Next.js App Router nests layouts

In the App Router, `app/dashboard/layout.tsx` wraps both the page for `/dashboard` and its descendant routes. Each layout receives its child route content through `children`. The root layout contains the document's `<html>` and `<body>` elements. [Next.js App Router layouts](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

```text
app/
  layout.tsx
  dashboard/
    layout.tsx
    page.tsx
    settings/
      page.tsx
```

For `/dashboard/settings`, the root layout wraps the dashboard layout, which renders the settings page at `{children}`. The dashboard layout can place that content beside a shared sidebar.

```tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

Route groups such as `(admin)` and `(public)` let different branches supply their own layout while keeping group names out of the URL. If each group contains a root layout of its own, navigation between those roots triggers a full page load. A shared root above the groups lets both branches inherit the same document shell. [Next.js layout file convention](https://nextjs.org/docs/app/api-reference/file-conventions/layout) · [Next.js route groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)

## Layouts in the Next.js Pages Router

The Pages Router passes the active page to `pages/_app` as `Component`. A custom App can wrap it in a shared layout. It can also call an optional `getLayout` function defined by the page. A sign-in page can select a minimal shell while other pages use the default one. React preserves layout state across page transitions when the layout keeps the same component identity and position in the tree. [Next.js Pages Router layouts](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts)

```jsx
// pages/_app.jsx
export default function App({ Component, pageProps }) {
  const page = <Component {...pageProps} />;
  return Component.getLayout ? Component.getLayout(page) : <MainLayout>{page}</MainLayout>;
}
```

## What happens to state when you navigate?

In Cabloy Basic's Web layout, the Controller coordinates menu loading, initializes the Tabs model, and handles drawer and header interactions. Render beans compose the header and content. The content uses `ZRouterViewTabs` to host routed pages. The menu Model owns the query, which the layout Controller waits for during initialization. [Web layout Controller](https://github.com/cabloy/cabloy/blob/main/zova/src/suite/a-home/modules/home-layoutweb/src/component/layoutWeb/controller.tsx) · [Web layout Tabs render](https://github.com/cabloy/cabloy/blob/main/zova/src/suite/a-home/modules/home-layoutweb/src/component/layoutWeb/render.tabs.tsx)

Zova treats the shell's state and the open pages' state as separate concerns. The routed view uses a component key to identify the page instance and Vue's `KeepAlive` to retain eligible instances. Cabloy Basic's Admin layout enables tab caching, while its Web layout disables it by default. In Admin, retaining an editor as an open task can let a user check a record's details and return to the editor with its input intact. [Zova routed view source](https://github.com/cabloy/cabloy/blob/main/zova/src/suite-vendor/a-zova/modules/a-router/src/lib/routerViewBase.tsx) · [Admin layout configuration](https://github.com/cabloy/cabloy/blob/main/zova/src/suite/a-home/modules/home-layoutadmin/src/config/config.ts) · [Web layout configuration](https://github.com/cabloy/cabloy/blob/main/zova/src/suite/a-home/modules/home-layoutweb/src/config/config.ts)

In the App Router, navigating from `/dashboard` to `/dashboard/settings` via a client-side transition keeps the shared dashboard layout in place. An interactive sidebar inside it can retain its expanded state as the page content changes. If a section needs fresh component state when its route segment changes, a `template.tsx` creates a remount boundary at that segment. [Next.js client-side transitions](https://nextjs.org/docs/app/getting-started/linking-and-navigating) · [Next.js template file convention](https://nextjs.org/docs/app/api-reference/file-conventions/template)

## Layout data and SSR

With Vona integrated SSR, Vona matches the incoming request to an SSR Site and loads that site's Zova bundle. Zova resolves the route, renders the layout and page, and prepares state for Vue hydration. A layout Controller can coordinate Model queries during this render. For example, menu data needed for the first paint can be loaded before the shell renders, with session-specific data following the route's SSR and admission policies. [Cabloy SSR Architecture](https://cabloy.com/frontend/ssr-architecture-overview) · [Cabloy Page Route Guide](https://cabloy.com/frontend/page-route-guide)

In the App Router, layouts and pages are React Server Components by default. A dashboard layout can fetch navigation data on the server and pass it to a navigation component that it renders directly. A Client Component can then handle sidebar toggles or react to the current pathname. On the first load, Next.js uses the React Server Component payload and Client Components to produce HTML, and React hydrates the Client Components in the browser. [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) · [Next.js layout file convention](https://nextjs.org/docs/app/api-reference/file-conventions/layout)

## Mapping a dashboard layout from Next.js to Zova

Consider a dashboard and a sign-in page that need different shells. In the App Router, they can live in separate route groups with their own `layout.tsx` files. In Zova, the dashboard route can use the configured default while the sign-in route selects `empty`. The mapping describes which shell should render the page. The layout component then decides how to host it.

| What you want to express           | Next.js                                                                               | Zova                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Which shell a route uses           | A segment's `layout.tsx` in App Router, or a wrapper chosen in `_app` in Pages Router | The route's `meta.layout` and its configured component    |
| Where routed content appears       | `{children}` inside the layout                                                        | A routed view inside the layout's Render bean             |
| Where shared navigation data lives | A server layout or shared data loader in App Router                                   | A Model used by the layout Controller                     |
| How an open editor retains input   | React component identity and the application's state ownership                        | Page instance identity and the routed view's cache policy |

The practical difference shows up when routes from several Zova modules share a shell. You can change which layout the application maps to `default` without moving those pages. In the App Router, the shared segment in the directory tree tells you which pages inherit the shell and where it can stay mounted during navigation.
