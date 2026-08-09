# User Workspace SSR Strategy

## Purpose

This note records how Cabloy Basic should place and render authenticated user-facing pages such as personal center, orders, account profile, addresses, notifications, and similar private workspace features. The approved request-local `public` / `session` implementation and migration plan is maintained in [SSR Request-Local Profiles](ssr-request-local-profiles.md).

It exists to prevent an incorrect coupling between business ownership and SSR cookie strategy:

- user-facing features must not move into Admin merely because Admin currently enables cookie-aware SSR;
- `SSR_COOKIE=false` for Web does not mean Web cannot SSR; and
- a Site should be added only when its business and rendering boundaries justify it.

The Site and role terminology in this note follows [ADR 0006](../decisions/0006-ssr-site-access-and-role-model.md).

## Current Baseline

Cabloy Basic has these relevant Zova flavor settings:

| Flavor             | Site  | `SSR_COOKIE` | Current rendering intent                                               |
| ------------------ | ----- | -----------: | ---------------------------------------------------------------------- |
| `cabloyBasicWeb`   | Web   |      `false` | Anonymous/public SSR, suitable for cacheable and SEO-oriented content. |
| `cabloyBasicAdmin` | Admin |       `true` | Cookie-aware SSR for internal management and operations.               |

`SSR_COOKIE=false` sets `cookieDisabledOnServer` during server rendering. Router guards therefore cannot use a request cookie to construct a complete server-side Passport for authenticated-route admission. Browser hydration can still obtain Passport state and run the same route policy.

`SSR_COOKIE=true` permits the server-side Passport flow during SSR initial navigation, so a route can perform authenticated Site admission and fetch/render personalized data before the response is sent.

## Problem

Personal center, orders, account profile, and other end-user workspace pages are user-facing business features. Their business ownership is Web, not Admin.

However, these pages are commonly authenticated and may need private user data. This creates an apparent conflict:

```text
Put them in Admin
  -> cookie-aware SSR is available
  -> but the business boundary and Site admission semantics are wrong

Put them in Web
  -> business boundary is correct
  -> Web cannot use cookie-derived user state during SSR
```

The conflict is false when SSR rendering strategy is separated from business ownership.

## Decision Framework

Choose a rendering strategy per page class, not by treating every authenticated page as an Admin page.

| Page class                                                  | Examples                                                                                                                      | Business Site                 | SSR strategy                                                                              |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------- |
| Public content                                              | home, content detail, product list, search, login, registration                                                               | Web                           | Anonymous SSR. These routes declare `requiresAuth: false`.                                |
| Private user workspace without personalized SSR requirement | profile shell, order shell, account settings, notifications shell                                                             | Web                           | Anonymous SSR shell followed by browser Passport/site admission and private data loading. |
| Private user workspace requiring personalized SSR           | personalized order list, account dashboard with required server first paint, user workspace with strict server route decision | Dedicated Member/Account Site | Cookie-aware SSR with `SSR_COOKIE=true`.                                                  |
| Internal back office                                        | user management, content operations, system settings                                                                          | Admin                         | Cookie-aware SSR with `SSR_COOKIE=true`.                                                  |

The default is the second row: a user workspace page remains in Web and uses anonymous SSR plus client-side private-data loading.

## Recommended Default: Web Anonymous SSR Shell

Personal center, orders, account profile, and similar end-user pages remain in the Web Site unless there is a concrete product requirement for personalized SSR.

A protected Web route uses the default `requiresAuth` behavior and the `web` Site policy:

```text
registeredUser.siteIds includes web
```

The rendering flow is:

```text
Request /account or /orders
  -> Web SSR with SSR_COOKIE=false
  -> render a generic shell, skeleton, or non-private route frame
  -> browser hydration
  -> Router Guard obtains Passport state
  -> Router Guard checks the role policy against SITE_ID=web
  -> browser requests private profile/order data
  -> Vona API/resource guards verify identity and resource permissions
```

The server-rendered HTML must not contain private user data. This preserves the Web flavor's anonymous SSR, cache, SEO, and hydration behavior while keeping private data behind Vona API authorization.

The hydration-time first client tree must remain that same anonymous shell. Browser Passport restoration, Site admission, and private query initialization may replace the shell only after an explicit client boundary; they must not create a private or differently shaped loading branch during hydration itself. Avoiding private HTML leakage is necessary but insufficient when the initial client render still differs from the server output.

An external payment-provider return is a concrete protected-route case. The continuation page must keep the same neutral shell through SSR and first hydration, then recover Passport in the browser when a valid token remains but the browser Passport projection is missing, before issuing customer-owned payment or order requests. The detailed callback-to-continuation flow is recorded in [Zova SSR Payment Return and Passport Recovery](zova-ssr-payment-return-passport-recovery.md).

This is still SSR:

```text
SSR exists
  !=
personalized user-data SSR exists
```

The page has SSR HTML and route structure; only private user state and data wait for browser authentication.

### Router guard behavior

For all Sites, `route.meta.requiresAuth` is the page-level anonymous-access rule:

```text
requiresAuth: false
  -> allow anonymous route access and skip role Site policy

requiresAuth not false
  -> ensure Passport
  -> if unauthenticated, navigate to the current Site login route
  -> if authenticated but role siteIds omit SITE_ID, render/route to access denied
  -> otherwise continue
```

For Web with `SSR_COOKIE=false`, the authenticated portion is completed after hydration. For a cookie-enabled Site, it can be completed during SSR initial navigation.

The client-side check is a navigation and user-experience control. It does not replace Vona API/resource guards, which remain mandatory for every private data request and mutation.

## When to Add a Dedicated Member or Account Site

Create a new cookie-aware SSR Site only when one or more of these requirements are explicit:

1. the product requires personalized user data in the initial SSR response;
2. an authenticated user workspace needs server-side login and `403` decisions before HTML render;
3. user workspace first-paint performance depends materially on server data prefetch;
4. the user workspace is becoming a substantial independent application/workbench; or
5. public Web caching policy and authenticated workspace rendering need complete operational separation.

Recommended identity and policy if this Site is introduced:

| SSR Site          | `siteId`              | Cookie SSR | Responsibility                                                 |
| ----------------- | --------------------- | ---------: | -------------------------------------------------------------- |
| Web               | `web`                 |    `false` | Public/anonymous user-facing content and anonymous SSR shells. |
| Member or Account | `member` or `account` |     `true` | Personalized end-user workspace.                               |
| Admin             | `admin`               |     `true` | Internal administration and operations.                        |

Example initial role policy:

```text
registeredUser.siteIds = ['web', 'member']
systemAdmin.siteIds = ['web', 'member', 'admin']
```

The exact Site ID should be selected before implementation and then remain stable. Do not use `admin` for a user workspace merely to reuse Cookie SSR.

## Why Not Enable `SSR_COOKIE=true` for All Web Pages

Changing the Web flavor to `SSR_COOKIE=true` is technically possible but is not the default recommendation.

It makes the entire Web SSR output potentially cookie- and user-state-aware, including public pages. Before choosing it, evaluate:

- shared-cache and CDN behavior for cookie-varying responses;
- additional Passport parsing/load on public page requests;
- theme, locale, and login-state hydration consistency;
- whether public SSR pages should differ by user state;
- whether the majority of Web pages actually benefit from personalized SSR.

Use this option only when Web as a whole is intended to be a cookie-aware SSR application. Do not enable it solely for a small number of account pages.

## Site, Route, and API Boundaries

The following boundaries must remain explicit:

| Layer                    | Responsibility                                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| Vona `@SsrSite.siteId`   | Stable server-owned identity for an SSR Site.                                                 |
| Zova `SITE_ID`           | Current Site runtime context. Vona derives it for SSR; SPA flavors configure it explicitly.   |
| Zova Router Guard        | Page navigation, `requiresAuth`, Passport availability, and role Site-policy user experience. |
| Vona API/resource guards | Server-side authorization for all private data and mutations.                                 |

A same-domain cookie only proves authentication. It never grants Admin, Member, or Web workspace data access by itself.

`SITE_ID` sent to the browser is public runtime context and must never be returned to Vona as an authorization assertion.

## Implementation Checklist

### Default Web user workspace

1. Keep user-facing account/order/profile routes in the Web flavor.
2. Leave public routes explicitly marked `requiresAuth: false`.
3. Keep user workspace routes authenticated by default.
4. Ensure Web SSR output for authenticated routes contains no private data when `SSR_COOKIE=false`.
5. Keep the client's hydration-time initial render equivalent to that anonymous SSR shell; do not start a private query or render a private/loading branch until an explicit post-hydration, admission, mounted, or interaction boundary.
6. In the browser, complete Passport and `SITE_ID=web` role-policy checks before private data interaction.
7. Protect every private data API with Vona Passport/resource guards.
8. Test anonymous SSR output, hydration-time equivalence, browser admission, unauthenticated redirect, role denial, and direct API denial separately.

### Dedicated Member/Account Site, when justified

1. Add a stable `siteId` and explicit Zova flavor `SITE_ID` mapping.
2. Enable `SSR_COOKIE=true` only for that Site's flavor.
3. Add the Site ID explicitly to intended role `siteIds`.
4. Keep public Web and Member cache/deployment behavior separate.
5. Verify personalized SSR, server-side redirect/403 handling, browser navigation, and API authorization.

## Related Records

- [ADR 0006: SSR Site Access and Role Model](../decisions/0006-ssr-site-access-and-role-model.md)
- [SSR Module Architecture](a-ssr-module-architecture.md)
- `zova/env/.env.cabloyBasicWeb`
- `zova/env/.env.cabloyBasicAdmin`
- `zova/src/suite/a-home/modules/home-base/src/service/routerGuards.ts`
- `zova/src/front/config/config/config.ts`
