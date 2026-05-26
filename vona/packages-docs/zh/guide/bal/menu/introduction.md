# 菜单体系

模块`a-ssr`提供了通用的 SSR 菜单体系。事实上可以完全忽略这个`菜单体系`，提供自己的菜单获取逻辑。但是，使用系统约定的`菜单体系`有利于在社区中分享和复用代码资源，显著提升系统的扩展性和可维护性。

## bean.ssr

模块`a-ssr`提供了全局 Bean `bean.ssr`，可以通过统一的方式获取菜单。

以模块`home-base`为例：

`src/suite/a-home/modules/home-base/src/service/menu.ts`

```typescript
class ServiceMenu {
  async retrieveMenus(publicPath?: string): Promise<IMenus> {
    const res = await this.bean.ssr.retrieveMenus(publicPath);
    if (res) return res;
    return this._getMenusDefault();
  }

  private _getMenusDefault(): IMenus {
    return {
      menus: [
        { name: 'home', title: this.$scope.homeIndex.locale.Home(), icon: '::home', link: '/' },
      ],
    };
  }
}
```

- `bean.ssr.retrieveMenus`: 获取 SSR 菜单
- `_getMenusDefault`: 提供缺省菜单

## Menu API

模块`home-base`提供了获取菜单的 API，实现`开箱即用`

`src/suite/a-home/modules/home-base/src/controller/menu.ts`

```typescript
class ControllerMenu {
  @Web.get(':publicPath?')
  @Api.body(v.object(DtoMenus))
  async retrieveMenus(@Arg.param('publicPath', v.optional()) publicPath?: string): Promise<IMenus> {
    return await this.scope.service.menu.retrieveMenus(publicPath);
  }
}
```
