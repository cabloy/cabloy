# User Workspace SSR Strategy

## Purpose

This note records how Cabloy Basic should place and render authenticated user-facing pages such as personal center, orders, account profile, addresses, notifications, and similar private workspace features. The approved request-local `public` / `session` implementation and migration plan is maintained in [SSR Request-Local Profiles](ssr-request-local-profiles.md).

It exists to prevent an incorrect coupling between business ownership and SSR cookie strategy:

- user-facing features must not move into Admin merely because Admin currently enables cookie-aware SSR;
- a `public` profile for Web does not mean Web cannot SSR; and
- a Site should be added only when its business and rendering boundaries justify it.

The Site and role terminology in this note follows [ADR 0006](../decisions/0006-ssr-site-access-and-role-model.md).

## Current Baseline

Cabloy Basic has these relevant Zova flavor settings:

| Flavor             | Site  | `SSR_PROFILE` | Current rendering intent                                               |
| ------------------ | ----- | ------------- | ---------------------------------------------------------------------- |
| `cabloyBasicWeb`   | Web   | `public`      | Anonymous/public SSR, suitable for cacheable and SEO-oriented content. |
| `cabloyBasicAdmin` | Admin | `session`     | Session-profile SSR for internal management and operations.            |

The `public` profile renders without request-cookie credentials. It remains appropriate only for a route with an explicit URL locale or a deliberately locale-neutral, cache-safe, hydration-equivalent public contract. The `session` profile permits cookie-backed locale resolution and the server-side Passport flow during SSR initial navigation, so normal route admission can redirect or deny before the response is sent. Web retains `public` as its flavor fallback, but a locale-sensitive route without `locale` params explicitly selects `session` rather than rendering the server in the default locale and hydrating in a browser-selected locale.

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

| Page class                                                     | Examples                                                                                                              | Business Site                        | SSR strategy                                                                                                                                                         |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public content with explicit locale or locale-neutral contract | canonical public content, cacheable error/not-found pages                                                             | Web                                  | `public` only when the explicit URL locale or locale-neutral contract makes the server and hydration trees equivalent; declare `requiresAuth: false` when anonymous. |
| No-locale public or private shell                              | login, registration, recovery, profile shell, order shell, notifications shell                                        | Web                                  | Route-level `session` for cookie-backed locale; anonymous admission uses `requiresAuth: false`; private data may remain neutral until an explicit client boundary.   |
| Private user workspace requiring personalized SSR              | Account Settings at `/home/user/account`, personalized order list, account dashboard with required server first paint | Web or Dedicated Member/Account Site | Route-level `session` SSR with normal protected-route admission and, where appropriate, authorized private-query transfer.                                           |
| Internal back office                                           | user management, content operations, system settings                                                                  | Admin                                | Session-profile SSR with a `session` profile.                                                                                                                        |

The default route decision for a locale-sensitive page without `locale` params is `session`, while Web remains `public` as the flavor fallback. A Web user workspace stays in the Web business boundary whether it renders only a neutral private-data shell or requires personalized first paint. Account Settings is one protected Web example: it uses cookie-aware `session` SSR without becoming an Admin feature.

## Recommended Default: Web Session SSR with a Neutral Private-Data Shell

Personal center, orders, account profile, and similar end-user pages remain in the Web Site unless there is a concrete product requirement for a dedicated Site. A locale-sensitive route without `locale` params explicitly uses `meta.ssrProfile: 'session'`, whether it needs personalized first paint or only needs locale-equivalent SSR. The latter may retain a neutral shell and defer private data without changing its rendering profile.

A protected Web route uses the default `requiresAuth` behavior and the `web` Site policy:

```text
registeredUser.siteIds includes web
```

The rendering flow is:

```text
Request a profile shell or orders shell
  -> Web SSR with the route-level session profile
  -> resolve cookie-backed locale and normal protected-route admission
  -> render a generic shell, skeleton, or non-private route frame when private data is deferred
  -> browser hydration
  -> browser requests private profile/order data at an explicit client boundary
  -> Vona API/resource guards verify identity and resource permissions
```

The server-rendered HTML may omit private user data when personalized first paint is unnecessary. The `session` response remains private and non-storable, while Vona API authorization continues to protect every later private-data request.

The hydration-time first client tree must remain that same neutral shell. Private query initialization may replace the shell only after an explicit client boundary; it must not create a private or differently shaped loading branch during hydration itself. Avoiding private HTML leakage is necessary but insufficient when the initial client render still differs from the server output.

An external payment-provider return is a concrete protected-route case. The continuation page must keep the same neutral shell through SSR and first hydration, then recover Passport in the browser when a valid token remains but the browser Passport projection is missing, before issuing customer-owned payment or order requests. The detailed callback-to-continuation flow is recorded in [Zova SSR Payment Return and Passport Recovery](zova-ssr-payment-return-passport-recovery.md).

This is still SSR:

```text
SSR exists
  !=
personalized user-data SSR exists
```

The page has SSR HTML and route structure; when private data is deferred, only that data waits for an explicit browser boundary. The route profile can still be `session` for locale-equivalent SSR and normal protected-route admission.

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

For the explicit `public`-contract exception, a protected route completes its authenticated portion after hydration. For a `session` route, normal protected-route admission can complete during SSR initial navigation. An anonymous `session` route sets `requiresAuth: false`, which exits the guard before Passport recovery or Site admission; the profile itself never authenticates or authorizes the visitor.

The client-side check is a navigation and user-experience control. It does not replace Vona API/resource guards, which remain mandatory for every private data request and mutation.

## Route-Level Session SSR and Dedicated Member or Account Sites

A Web-owned route can opt into `meta.ssrProfile: 'session'` without converting the entire Web flavor. Every locale-sensitive Web route without `locale` params does so to make the server locale input equivalent to hydration. Account Settings additionally uses the profile for protected-route admission: its route guard establishes request-cookie Passport and Web Site admission before rendering, the page's model-owned Account query is prepared for SSR, and anonymous requests redirect to the Web login route. This does not justify a separate Site.

The response policy for a route-level session page must follow the configured session profile rather than public shared-cache assumptions. Its server HTML and hydration-time client tree must remain equivalent through locale state and, where private state is server-rendered, Passport/session state and query dehydration.

## When to Add a Dedicated Member or Account Site

Create a new cookie-aware SSR Site only when one or more of these requirements are explicit:

1. the product requires personalized user data in the initial SSR response;
2. an authenticated user workspace needs server-side login and `403` decisions before HTML render;
3. user workspace first-paint performance depends materially on server data prefetch;
4. the user workspace is becoming a substantial independent application/workbench; or
5. public Web caching policy and authenticated workspace rendering need complete operational separation.

Recommended identity and policy if this Site is introduced:

| SSR Site          | `siteId`              | Flavor fallback | Responsibility                                                                   |
| ----------------- | --------------------- | --------------- | -------------------------------------------------------------------------------- |
| Web               | `web`                 | `public`        | User-facing content and workspace routes; no-locale routes may select `session`. |
| Member or Account | `member` or `account` | `session`       | Personalized end-user workspace when a separate Site is justified.               |
| Admin             | `admin`               | `session`       | Internal administration and operations.                                          |

Example initial role policy:

```text
registeredUser.siteIds = ['web', 'member']
systemAdmin.siteIds = ['web', 'member', 'admin']
```

The exact Site ID should be selected before implementation and then remain stable. Do not use `admin` for a user workspace merely to reuse Cookie SSR.

## Why Not Enable a `session` profile for All Web Pages

Changing the entire Web flavor to a `session` profile is technically possible but is not the default recommendation.

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
2. Use `session` explicitly for every locale-sensitive route without `locale` params; use `public` only for an explicit URL-locale or deliberately locale-neutral, cache-safe exception.
3. Declare anonymous admission explicitly with `requiresAuth: false`; keep user workspace routes authenticated by default.
4. Keep a no-private-data route's server HTML and hydration-time tree equivalent even when its `session` profile later supports protected-route admission.
5. Do not start a deferred private query or render a private/loading branch until an explicit post-hydration, admission, mounted, or interaction boundary.
6. Verify Passport and `SITE_ID=web` role-policy checks before private data interaction where that data is not server-rendered.
7. Protect every private data API with Vona Passport/resource guards.
8. Test locale-equivalent SSR/hydration, anonymous admission, protected-route redirect, role denial, private-data timing, and direct API denial separately.

### Dedicated Member/Account Site, when justified

1. Add a stable `siteId` and explicit Zova flavor `SITE_ID` mapping.
2. Enable a `session` profile only for that Site's flavor.
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
