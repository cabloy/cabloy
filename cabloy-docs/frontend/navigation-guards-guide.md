# Navigation Guards Guide

This guide explains how navigation guards work in Zova within the Cabloy monorepo.

## Why navigation guards matter

Navigation guards are one of the main places where routing behavior becomes application policy.

Typical uses include:

- checking authentication state
- redirecting unauthenticated users to login
- enforcing route-level behavior from route metadata

## Home-base guard entrypoint

The `home-base` module provides a router-guard service hook where custom logic can be added.

Use the pure `app.$getPagePath(...)` family to construct a guard destination. Use the imperative `app.$gotoPage(...)` family from event handlers or workflows that intentionally start navigation. Do not call `$gotoLogin()` or `$gotoAccessDenied()` from a `beforeEach` guard and then return `false`: Client-side `$goto...()` starts a nested navigation while `false` aborts the navigation currently being guarded.

Representative shape:

```typescript
class ServiceRouterGuards {
  protected onRouterGuards(router: BeanRouter) {
    router.beforeEach(async to => {
      if (to.meta.requiresAuth === false) return;
      if (this.sys.config.ssr.cookieDisabledOnServer) return;

      if (!this.$passport.isAuthenticated) {
        const [_res, err] = await catchError(() => this.$passport.ensurePassport());
        if (err) {
          this.$errorHandler(err, 'onRouterGuards');
          return false;
        }
      }

      if (!this.$passport.isAuthenticated) {
        const pagePath = this.app.$getPagePathLogin(to.fullPath);
        if (process.env.SERVER) {
          this.app.$redirect(pagePath);
        }
        return pagePath;
      }
    });
  }
}
```

`$getPagePathLogin(to.fullPath)` preserves the protected destination as `returnTo` without starting navigation. On the Client, returning that path lets Vue Router redirect the current navigation atomically. On the Server, `$redirect(...)` preserves the SSR HTTP redirect flow.

## Why route meta matters here

The example makes a key architectural point: navigation guards are tightly coupled to route metadata such as `requiresAuth`.

That means route configuration and guard behavior should be read together, not as separate concerns.

## SSR-sensitive detail

The example also references SSR-related configuration such as cookie handling on the server side.

When `SSR_COOKIE=false`, `cookieDisabledOnServer` is true only during server rendering. The guard deliberately allows the protected route's neutral SSR entry, then the browser restores Passport state and applies the same admission policy after hydration. This preserves equivalent server and hydration-time initial rendering without weakening Client-side protection.

For cookie-enabled SSR, a rejected request must still use `$redirect(...)` so the SSR layer returns its HTTP redirect response. On the Client, return a route path or route-location object from the guard instead of using an imperative `$goto...()` helper.

So guards are not purely a client-side router concern. In Cabloy/Zova, they can also intersect with SSR behavior.

## Implementation checks for navigation-guard changes

When changing auth-sensitive routing behavior, ask:

1. does the route meta need to change?
2. does the guard logic need to change?
3. does SSR cookie or server-side behavior affect the guard decision path?
4. should redirects happen at the routing-policy layer rather than being hardcoded into page logic?

That produces cleaner and more framework-native navigation behavior.

## Where to read next

- If you want the broader route-record surface first, continue with [Page Route Guide](/frontend/page-route-guide).
- If the guard decision depends on route metadata or task-level shell state, continue with [Page Meta Guide](/frontend/page-meta-guide).
- If the guard behavior is really part of a larger SSR decision path, continue with [SSR Architecture Overview](/frontend/ssr-architecture-overview).
- If you want the deeper routing runtime after the public policy surface is clear, descend into [Zova Router Under the Hood](/frontend/zova-router-under-the-hood).
