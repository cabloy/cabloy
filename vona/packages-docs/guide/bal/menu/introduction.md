# Menu System

The `a-ssr` module provides a generic ssr menu system. In fact, this `menu system` can be completely ignored, and your own menu retrieval logic can be provided. However, using a system-defined menu system facilitates the sharing and reuse of code resources within the community, significantly improving the system's scalability and maintainability.

## bean.ssr

The module `a-ssr` provides a global bean `bean.ssr`, which allows for the unified retrieval of menus.

Taking the module `home-base` as an example:

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

- `bean.menu.retrieveMenus`: Retrieves the ssr menus
- `_getMenusDefault`: Provides the default menus

## Menu API

The `home-base` module provides an API for retrieving the menus, making it `out-of-the-box`

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
