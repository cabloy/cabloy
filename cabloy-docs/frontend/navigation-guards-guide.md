# Navigation Guards Guide

This page migrates the highest-value ideas from the legacy Zova navigation-guards documentation.

## Why navigation guards matter

Navigation guards are one of the main places where routing behavior becomes application policy.

Typical uses include:

- checking authentication state
- redirecting unauthenticated users to login
- enforcing route-level behavior from route metadata

## Home-base guard entrypoint

The legacy docs highlighted that the `home-base` module provides a router-guard service hook where custom logic can be added.

Representative shape:

```typescript
class ServiceRouterGuards {
  protected onRouterGuards(router: BeanRouter) {
    router.beforeEach(async to => {
      if (
        !this.sys.config.ssr.ignoreCookieOnServer &&
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

The legacy example also references SSR-related configuration such as cookie handling on the server side.

So guards are not purely a client-side router concern. In Cabloy/Zova, they can also intersect with SSR behavior.

## Why this matters for AI workflows

When AI changes auth-sensitive routing behavior, it should ask:

1. does the route meta need to change?
2. does the guard logic need to change?
3. does SSR cookie or server-side behavior affect the guard decision path?
4. should redirects happen at the routing-policy layer rather than being hardcoded into page logic?

That produces cleaner and more framework-native navigation behavior.
