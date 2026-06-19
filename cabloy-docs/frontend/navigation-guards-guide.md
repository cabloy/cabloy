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

Representative shape:

```typescript
class ServiceRouterGuards {
  protected onRouterGuards(router: BeanRouter) {
    router.beforeEach(async to => {
      if (
        !this.sys.config.ssr.cookieDisabledOnServer &&
        to.meta.requiresAuth !== false &&
        !this.$passport.isAuthenticated
      ) {
        const [_res, err] = await catchError(() => {
          return this.$passport.ensurePassport();
        });
        if (err) {
          this.$errorHandler(err, 'onRouterGuards');
          return false;
        }
        if (!this.$passport.isAuthenticated) {
          this.app.$gotoLogin(to.fullPath);
          return false;
        }
      }
    });
  }
}
```

## Why route meta matters here

The example makes a key architectural point: navigation guards are tightly coupled to route metadata such as `requiresAuth`.

That means route configuration and guard behavior should be read together, not as separate concerns.

## SSR-sensitive detail

The example also references SSR-related configuration such as cookie handling on the server side.

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
