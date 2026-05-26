# 导航守卫

Zova 提供了一个模块`home-base`，可以在这个模块中添加`导航守卫`，比如判断用户认证状态，跳转 Login 页面，等等。

## onRouterGuards

模块`home-base`提供了一个 Service bean `ServiceRouterGuards`，直接在`onRouterGuards`方法中添加自定义逻辑即可。

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
