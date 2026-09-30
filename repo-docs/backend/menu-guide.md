# Menu Guide

## Why menus matter in Cabloy SSR flows

In Cabloy, SSR menu retrieval can be treated as a reusable backend capability instead of a one-off frontend-only concern.

That matters because shared menu retrieval makes it easier to reuse navigation logic across modules and editions.

## Core SSR menu model

The `a-ssr` module provides a general SSR menu system.

A project can ignore the system menu model and implement its own retrieval logic, but the built-in model is useful because it improves reuse, consistency, and scalability.

## `bean.ssr`

Vona exposes a global bean `bean.ssr` for SSR-facing menu retrieval.

A representative usage pattern is:

```typescript
const res = await this.bean.ssr.retrieveMenus(publicPath);
```

This allows a module-level menu service to:

1. ask the shared SSR menu system for the effective menu set
2. fall back to default local menus when needed

The current `home-base` implementation in this repo follows exactly that pattern in its menu service, which keeps this guide grounded in the real out-of-the-box SSR path.

## Fallback strategy

A practical menu service can:

- try shared SSR menu retrieval first
- return a module-defined default menu if no shared menu is available

That keeps menu integration flexible without giving up framework-level reuse.

## Menu API shape

A backend controller can expose the menu retrieval path directly:

```typescript
@Web.get(':publicPath?')
@Api.body(v.object(DtoMenus))
@Passport.public()
async retrieveMenus(@Arg.param('publicPath', v.optional()) publicPath?: string) {
  return await this.scope.service.menu.retrieveMenus(publicPath);
}
```

This makes menu retrieval part of the broader backend contract surface.

In the current repo implementation, the out-of-the-box menu controller is public and delegates directly to `this.scope.service.menu.retrieveMenus(publicPath)`.

## SSR Site targeting

`@SsrMenu(...)` and `@SsrMenuGroup(...)` require an explicit `site` to select the SSR Site onion(s) that receive the declaration. It is a navigation-composition filter, not a site-admission, role-visibility, or backend-authorization decision.

- Use a site string or an array of site strings to target known SSR Sites.
- Omission, `undefined`, `null`, and empty or whitespace-only strings are invalid, including blank entries in an array.
- `site: []` is valid and explicitly means no sites receive the declaration.
- Sharing requires an explicit array of intended sites; there is no wildcard or implicit all-sites scope.
- Menu and group declarations are independently scoped. A menu does not inherit its group's `site`; declare the intended sites on both.
- `locale` remains optional: omitting it leaves the declaration unrestricted by locale.

Use a single site string for navigation owned by one SSR Site:

```typescript
@SsrMenu({
  item: {
    title: $locale('Operations'),
    link: 'presetResource',
    roles: ['systemAdmin'],
  },
  // This Basic Admin-owned entry intentionally targets one SSR Site.
  site: 'basic-siteadmin:admin',
})
```

For a shared module declaration, list every intended compatible SSR Admin site explicitly:

```typescript
@SsrMenu({
  item: {
    title: $locale('SharedOperations'),
    link: 'presetResource',
    roles: ['systemAdmin'],
  },
  // Share only with these explicitly selected SSR Sites.
  site: ['basic-siteadmin:admin', 'commerce-siteadmin:commerceAdmin'],
})
```

Choose the site list from the intended navigation contract, not merely the current/default Admin site. Isolate an independent site through its enabled module composition and site-owned menus/groups. When a shared capability needs genuinely different navigation contracts per site, use an explicit, approved site-specific composition or owner.

> [!WARNING]
> This is a breaking change for declarations that previously omitted `site` to reach all sites. Migrate each menu and group to an explicit site string or array, or use `site: []` when it should reach no sites. Add future shared sites to the array deliberately; omission is no longer a sharing mechanism.

`site` is distinct from a role's `siteIds`, menu `roles` or role-menu associations, and Passport/RBAC authorization:

```text
site              -> which SSR Site receives a menu/group declaration
siteIds           -> which frontend Site a subject may enter
roles / role-menu -> which admitted subject may discover a menu leaf
Passport / RBAC   -> which backend actions or data the subject may use
```

See [Menu Authorization](/backend/menu-authorization) for the site-admission, navigation-disclosure, and backend-authority boundaries.

## Static menu visibility

`@SsrMenu(...)` items can declare static role visibility without changing the public menu DTO:

- Omit `roles` to make an item visible to anonymous and authenticated callers.
- Use `roles: []` when an item has no static role visibility and is intended to be disclosed only through dynamic Role-menu configuration.
- A nonempty `roles` array is visible when the current Passport has at least one matching role name; it can also be disclosed through dynamic Role-menu configuration.
- `roles` is server-only declaration metadata. It is filtered out before the API response and is not part of `IMenuItem`, OpenAPI, or generated frontend clients.
- This controls navigation disclosure only. It never grants access to a page, controller action, API, or resource; those boundaries retain their own route and Passport/permission guards. For the fullstack pattern that pairs an Admin `presetResource` entry with independently authorized Admin APIs and separately scoped Web self-service APIs, see [Admin Resource and Web Self-Service](/fullstack/admin-resource-and-web-self-service).

SSR Site menu definitions are cached structurally by Site and locale. The framework keeps static role policy in that prepared cache, then creates a filtered response for each request without mutating the cached definition.

### Frontend query lifecycle

Passport filtering does not add user or role identity to the frontend menu query key. The menu resource remains keyed by stable inputs: Site/public path and locale.

On login, `ModelPassport.afterLogin()` stores the Passport/JWT before returning to the destination layout. The layout's ordinary `$useStateData(...)` lifecycle refreshes stale menu data using the newly authenticated request context. On logout, the Passport model navigates to login and then clears query data.

A dynamic role or menu-policy change while the user remains signed in is different: the mutation owner must explicitly refresh authoritative Passport state when needed and invalidate or refetch the affected menu query. This is UI freshness behavior only; route, controller, API, and resource authorization remain enforced independently by their existing guards.

## Relationship to frontend integration

Menu retrieval is especially relevant in SSR-sensitive frontend flows.

The backend menu contract should be read together with frontend routing, SSR, and page-loading behavior, especially when different editions expose different module or menu structures.

A practical boundary is:

- backend decides how menus are retrieved, merged, and defaulted
- frontend decides how those menu DTOs are rendered into route or navigation state

That split helps avoid re-implementing menu policy independently on both sides.

## Implementation checks for SSR menu changes

When editing SSR menu behavior, ask:

1. should the logic use `bean.ssr.retrieveMenus(...)` instead of inventing a parallel retrieval path?
2. is there a default fallback menu that should remain available?
3. does the menu contract belong in backend API design, frontend route design, or both?
4. does the active edition affect the menu structure or public path assumptions?
5. does every menu and group declare its own explicit `site` string or array, with all intended shared sites listed and `[]` used only when no sites should receive it?

That helps AI keep menu behavior aligned with Cabloy’s shared SSR architecture.
