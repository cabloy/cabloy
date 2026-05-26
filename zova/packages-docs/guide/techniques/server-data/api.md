# $api

Zova provides business-oriented API services based on `$fetch`

## Creating an API

Create an API service `menu` in the `demo-student` module to encapsulate API calls for retrieving menus.

### 1. CLI Command

```bash
$ zova :create:bean api menu --module=demo-student
```

### 2. Menu Command

::: tip
Context Menu - [Module Path]: `Zova Create/Api`
:::

Enter the API name `menu` as prompted, and the VSCode plugin will automatically add the API code skeleton.

## API Definition

`src/module/demo-student/src/api/menu.ts`

```typescript
export interface ApiMenuRetrieveMenusResult {
  title: string;
  link: string;
}

@Api()
export class ApiMenu extends BeanApiBase {
  retrieveMenus() {
    return this.$fetch.get<any, ApiMenuRetrieveMenusResult>('/home/base/menu/');
  }
}
```

## Using API

You can access the API directly through a Scope instance.

```diff
class ControllerTest {
  async retrieveMenus() {
+   const menus = await this.scope.api.menu.retrieveMenus();
  }
}
```

## Using API cross-module

```diff
+ import { ScopeModuleDemoStudent } from 'zova-module-demo-student';

class ControllerOther {
+ @UseScope()
+ $$scopeDemoStudent: ScopeModuleDemoStudent;

  async retrieveMenus() {
+   const menus = await this.$$scopeDemoStudent.api.menu.retrieveMenus();
  }
}
```

## $api

To further enhance the development experience and simplify code, the system automatically loads the `home-api` module and injects the `$api` object into the `BeanBase` base class, allowing any bean instance to access API services provided by the `home-api` module via `this.$api`

```diff
class ControllerTest {
  async retrieveMenus() {
+   const menus = await this.$api.homeBaseMenu.retrieveMenus({
+      params: { publicPath: '' },
+    });
  }
}
```
