# Navigation Guards

Zova provides a module `home-base`, in which `navigation guards` can be added, such as checking the user's authentication status, redirecting to the Login page, and so on.

## onRouterGuards

The module `home-base` provides a Service bean `ServiceRouterGuards`, and you can directly add custom logic in the `onRouterGuards` method.

`src/suite/a-home/modules/home-base/src/service/routerGuards.ts`

```typescript
class ServiceRouterGuards {
  protected onRouterGuards(router: BeanRouter) {
    router.beforeEach(async to => {
      if (!this.sys.config.ssr.ignoreCookieOnServer && to.meta.requiresAuth !== false && !this.$passport.isAuthenticated) {
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
