# $api

Zova 在`$fetch`基础上提供面向业务的 API 服务。

## 创建Api

在模块 demo-student 中创建一个 api 服务`menu`，用于封装获取菜单的 api 调用。

### 1. Cli命令

```bash
$ zova :create:bean api menu --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Zova Create/Api`
:::

依据提示输入 api 的名称`menu`，VSCode 插件会自动添加 api 的代码骨架。

## Api定义

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

## 使用Api

可以通过 Scope 实例直接访问 Api。

```diff
class ControllerTest {
  async retrieveMenus() {
+   const menus = await this.scope.api.menu.retrieveMenus();
  }
}
```

## 跨模块使用Api

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

为了进一步提升开发体验，简化代码，系统自动加载模块`home-api`，在`BeanBase`基类中注入了`$api`对象，从而可以在任何 bean 实例中通过`this.$api`访问模块`home-api`提供的 API 服务。

```diff
class ControllerTest {
  async retrieveMenus() {
+   const menus = await this.$api.homeBaseMenu.retrieveMenus({
+      params: { publicPath: '' },
+    });
  }
}
```
